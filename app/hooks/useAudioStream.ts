// app/hooks/useAudioStream.ts
import { useRef, useState, useCallback, useEffect } from "react";

interface UseAudioStreamReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  volume: number;
  toggle: () => void;
  setVolume: (vol: number) => void;
}

let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = false;

export function useAudioStream(streamUrl: string): UseAudioStreamReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(1);

  const buildAudioGraph = useCallback(() => {
    if (contextRef.current) return; // Ya está construido

    const audio = audioRef.current!;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);

    // Filtro lowpass: corta frecuencias altas cuando el volumen es bajo
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 20000; // Empieza abierto (sin filtro)
    filter.Q.value = 0.8;

    // Gain: controla el volumen real
    const gain = ctx.createGain();
    gain.gain.value = 1;

    // Cadena: source → filter → gain → salida
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    contextRef.current = ctx;
    gainRef.current = gain;
    filterRef.current = filter;
  }, []);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";

      audioRef.current.onwaiting = () => setIsLoading(true);
      audioRef.current.oncanplay = () => setIsLoading(false);
      audioRef.current.onplay = () => {
        globalIsPlaying = true; // 👈 sincroniza la variable global
        setIsPlaying(true);
      };
      audioRef.current.onpause = () => {
        globalIsPlaying = false; // 👈 sincroniza la variable global
        setIsPlaying(false);
      };
      audioRef.current.onerror = () => {
        setError("Error al cargar el stream");
        setIsPlaying(false);
        setIsLoading(false);
      };
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    if (!globalAudio) return;

    globalAudio.onplay = () => {
      globalIsPlaying = true;
      setIsPlaying(true);
    };
    globalAudio.onpause = () => {
      globalIsPlaying = false;
      setIsPlaying(false);
    };
    globalAudio.onwaiting = () => setIsLoading(true);
    globalAudio.oncanplay = () => setIsLoading(false);
    globalAudio.onerror = () => {
      setError("Error al cargar el stream");
      setIsPlaying(false);
      globalIsPlaying = false;
    };
  }, []);
  
  const toggle = useCallback(() => {
    const audio = getAudio();

    if (isPlaying) {
      audio.pause();
      audio.src = "";
    } else {
      setError(null);
      setIsLoading(true);
      audio.src = streamUrl;

      audio
        .play()
        .then(() => {
          // Construir el grafo solo tras el primer play (requiere gesto del usuario)
          buildAudioGraph();
          contextRef.current?.resume();
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [isPlaying, streamUrl, getAudio, buildAudioGraph]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);

    if (!gainRef.current || !filterRef.current || !contextRef.current) return;

    const ctx = contextRef.current;
    const now = ctx.currentTime;

    // Volumen con rampa suave para evitar clicks/pops
    gainRef.current.gain.cancelScheduledValues(now);
    gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
    gainRef.current.gain.linearRampToValueAtTime(vol, now + 0.08);

    // Frecuencia de corte del filtro:
    // vol 1   → 20000 Hz (abierto, sin filtro, sonido claro)
    // vol 0   → 800 Hz  (muy filtrado, efecto de fondo)
    const minFreq = 800;
    const maxFreq = 20000;
    const freq = minFreq + (maxFreq - minFreq) * vol ** 2; // curva exponencial

    filterRef.current.frequency.cancelScheduledValues(now);
    filterRef.current.frequency.setValueAtTime(
      filterRef.current.frequency.value,
      now,
    );
    filterRef.current.frequency.linearRampToValueAtTime(freq, now + 0.08);
  }, []);

  return { isPlaying, isLoading, error, volume, toggle, setVolume };
}
