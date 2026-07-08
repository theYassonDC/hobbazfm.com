import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useHorarios } from "~/hooks/useHorarios";
import { useRegistrarHorario } from "~/hooks/useRegistrarHorario";
import { useSemanaActual } from "~/hooks/useSemanaActual";
import type {
  Franja,
  Horario,
  HorarioSeleccionado,
  MapaHorarios,
  Pais,
} from "~/libs/interface/horarios";
import type { Datum as ScheduleData } from "~/libs/interface/Schedules.interface";
import { mapHorarios } from "~/libs/mappers/horarios.mapper";
import { getSchedules } from "~/libs/radio.service";

const ZONA_RADIO = "America/Bogota"; // cámbiala si tu radio es de otro país

const PAISES = [
  { nombre: "Colombia / Perú", zona: "America/Bogota", bandera: "🇨🇴" },
  { nombre: "Venezuela", zona: "America/Caracas", bandera: "🇻🇪" },
  { nombre: "Ecuador", zona: "America/Guayaquil", bandera: "🇪🇨" },
  {
    nombre: "Argentina",
    zona: "America/Argentina/Buenos_Aires",
    bandera: "🇦🇷",
  },
  { nombre: "Chile", zona: "America/Santiago", bandera: "🇨🇱" },
  { nombre: "Brasil", zona: "America/Sao_Paulo", bandera: "🇧🇷" },
  { nombre: "México", zona: "America/Mexico_City", bandera: "🇲🇽" },
  { nombre: "España", zona: "Europe/Madrid", bandera: "🇪🇸" },
  { nombre: "EE.UU. (Este)", zona: "America/New_York", bandera: "🇺🇸" },
];

// ─── Configuración ─────────────────────────────────────────────────────────────
const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const detectarPais = (): Pais => {
  const zonaLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return PAISES.find((p) => p.zona === zonaLocal) ?? PAISES[0];
};

const getOffsetUTC = (zona: string): number => {
  const ahora = new Date();
  const enZona = new Date(ahora.toLocaleString("en-US", { timeZone: zona }));
  const enUTC = new Date(ahora.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((enZona.getTime() - enUTC.getTime()) / (1000 * 60 * 60));
};

const calcularDiferencia = (zonaRadio: string, zonaUsuario: string) =>
  getOffsetUTC(zonaUsuario) - getOffsetUTC(zonaRadio);

// Genera los rangos de hora: "12:00 A.M – 01:00 A.M", etc.
const generarFranjas = (offsetHoras: number = 0): Franja[] => {
  return Array.from({ length: 24 }, (_, horaLocal) => {
    const horaRadio = (((horaLocal - offsetHoras) % 24) + 24) % 24;
    const siguienteLocal = (horaLocal + 1) % 24;
    const fmt = (h: number) => {
      const n = ((h % 24) + 24) % 24;
      const periodo = n < 12 ? "A.M" : "P.M";
      const h12 = n === 0 ? 12 : n > 12 ? n - 12 : n;
      return `${String(h12).padStart(2, "0")}:00 ${periodo}`;
    };
    return { label: `${fmt(horaLocal)} – ${fmt(siguienteLocal)}`, horaRadio };
  });
};

// Colores — van como inline style porque Tailwind purga las clases dinámicas
const COLORES = {
  pink: { bg: "#FBAED2", text: "#831843", border: "#F472B6" },
  purple: { bg: "#C084FC", text: "#3B0764", border: "#A855F7" },
  blue: { bg: "#93C5FD", text: "#1E3A8A", border: "#3B82F6" },
  amber: { bg: "#FCD34D", text: "#78350F", border: "#F59E0B" },
  teal: { bg: "#5EEAD4", text: "#134E4A", border: "#14B8A6" },
  indigo: { bg: "#818CF8", text: "#1E1B4B", border: "#6366F1" },
};

const crearMapa = (horarios: Horario[]): MapaHorarios => {
  const mapa: MapaHorarios = {};
  horarios.forEach((h) => {
    mapa[`${h.dia}-${h.hora}`] = h;
  });
  return mapa;
};

interface HorariosGridProps {
  isPanel: boolean,
  token?: string
}

// ─── Componente ────────────────────────────────────────────────────────────────
export default function HorariosGrid(props: HorariosGridProps) {
  const { semana, anio } = useSemanaActual();
  const { data: horarios = [], isLoading } = useHorarios(semana, anio);
  const { mutate: registrar, isPending } = useRegistrarHorario(semana, anio, props.token); // temporal

  const [selected, setSelected] = useState<HorarioSeleccionado | null>(null);
  const [filtroDia, setFiltroDia] = useState<number | null>(null);
  const [paisSeleccionado, setPaisSeleccionado] = useState<Pais>(detectarPais);
  const offset = useMemo<number>(
    () => calcularDiferencia(ZONA_RADIO, paisSeleccionado.zona),
    [paisSeleccionado],
  );
  const franjas = useMemo(() => generarFranjas(offset), [offset]);
  const mapa = crearMapa(horarios);

  const diasVisibles = filtroDia !== null ? [filtroDia] : DAYS.map((_, i) => i);

  const handlePais = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const pais = PAISES.find((p) => p.zona === e.target.value);
    if (pais) setPaisSeleccionado(pais);
  };

  const handleCeldaVacia = (diaIdx: number, horaRadio: number) => {
    registrar({
      dia: diaIdx,
      hora: horaRadio,
      style: "pink",
      semana,
      anio,
    });
  };

  return (
    <div className="p-4 font-sans">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={paisSeleccionado.zona}
          onChange={handlePais}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5"
        >
          {PAISES.map((p) => (
            <option key={p.zona} value={p.zona} className="text-black">
              {p.bandera} {p.nombre}
            </option>
          ))}
        </select>
        {/* Filtro rápido por día */}
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFiltroDia(null)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filtroDia === null
                ? "bg-purple-500 text-white border-purple-500"
                : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
            }`}
          >
            Todos
          </button>
          {DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setFiltroDia(filtroDia === i ? null : i)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                filtroDia === i
                  ? "bg-purple-500 text-white border-purple-500"
                  : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className=" border border-gray-200 shadow-sm">
        <table className="w-full border-collapse text-sm min-w-max">
          {/* Cabecera */}
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-purple-800 text-gray-300 text-xs font-medium px-3 py-3 text-left whitespace-nowrap border-r border-gray-600 min-w-36">
                Hora
              </th>
              {diasVisibles.map((i) => (
                <th
                  key={i}
                  className="bg-purple-800 text-white text-xs font-semibold px-3 py-3 text-center whitespace-nowrap border-r border-gray-700 min-w-32"
                >
                  {DAYS[i]}
                </th>
              ))}
            </tr>
          </thead>

          {/* Cuerpo */}
          <tbody>
            {franjas.map(({ label, horaRadio }, rowIdx) => (
              <tr
                key={horaRadio}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {/* Columna hora */}
                <td className="sticky left-0 z-0 text-xs text-gray-500 px-3 py-2 border-r border-b border-gray-200 whitespace-nowrap font-medium bg-inherit">
                  {label}
                </td>

                {/* Celdas por día */}
                {diasVisibles.map((diaIdx) => {
                  const horario = mapa[`${diaIdx}-${horaRadio}`];
                  const c = horario ? COLORES[horario.color] : null;

                  return (
                    <td
                      key={diaIdx}
                      className="px-2 py-1 border-r border-b border-gray-200 text-center"
                    >
                      {horario ? (
                        <button
                          onClick={() => setSelected({ ...horario, label })}
                          className="w-full rounded px-2 py-1 text-xs font-semibold cursor-pointer border transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: c!.bg,
                            color: c!.text,
                            borderColor: c!.border,
                          }}
                        >
                          {horario.djNombre}
                        </button>
                      ) : props.isPanel && (
                        <button onClick={() => handleCeldaVacia(diaIdx, horaRadio)} className="cursor-pointer text-neutral-900 hover:text-neutral-700">
                          Apuntarme
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl p-5 w-72 shadow-xl border-2"
            style={{ borderColor: COLORES[selected.color].border }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {DAYS[selected.dia]}
                </p>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                  {selected.djNombre}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none bg-transparent border-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {[
                { label: "Día", value: DAYS[selected.dia] },
                { label: "Hora", value: franjas[selected.hora].label },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between pb-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
