import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getNews } from "~/libs/radio.service";

export default function CarruselNews() {
  const [current, setCurrent] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["news-imgs"],
    queryFn: () =>
      getNews({
        limit: "5",
        page: "1",
      }),
  });
  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + data!.data.length) % data!.data.length);
    },
    [data?.data.length ?? 0],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, true, 4000, goTo]);
  return (
    <div className="w-full">
      {/* Viewport */}
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {data?.data ? (
            data?.data.map((img, i) => (
              <>
                <div key={i} className="relative min-w-full">
                  <img
                    key={i}
                    src={img.image_url}
                    alt={img.title}
                    className="min-w-full h-64 object-cover"
                  />
                  {img.title && i === current && (
                    <div className="flex flex-col absolute bottom-0 left-0 right-0 bg-linear-to-t/srgb from-black/90 to-transparent px-4 py-3">
                      <NavLink to={`news/${img.id}`}>
                        <p className="text-white text-2xl font-semibold truncate">
                          {img.title}
                        </p>
                      </NavLink>
                      <p className="text-white text-sm font-normal truncate">
                        {img.category.name}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ))
          ) : (
            <>
              <p className="text-center m-auto">
                ¡No hay noticias para mostrar por el momento!
              </p>
            </>
          )}
        </div>
      </div>

      {/* Controles */}
      {data?.data ? (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Anterior"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/10 transition-colors"
          >
            <img src="assets/PiconLeft.svg" alt="left" width={12} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {data?.data.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === current ? "bg-white scale-125" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(current + 1)}
            aria-label="Siguiente"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/10 transition-colors"
          >
            <img
              src="assets/PiconLeft.svg"
              alt="right"
              width={12}
              className="rotate-180"
            />
          </button>
        </div>
      ): null}
    </div>
  );
}
