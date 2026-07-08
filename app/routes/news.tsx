import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NewCard from "~/components/news/NewCard";
import { getCategories, getNews } from "~/libs/radio.service";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["news-data", selectedCategory],
    queryFn: () =>
      getNews({
        limit: "10",
        page: "1",
        ...(selectedCategory && { category: selectedCategory }),
      }),
  });

  const { data: dataCategories, isLoading: isLoadCategories } = useQuery({
    queryKey: ["categories-data"],
    queryFn: () =>
      getCategories({
        limit: "10",
        page: "1",
      }),
  });

  return (
    <>
      <h1 className="text-center text-2xl p-4">Ultimas noticias</h1>
      <p className="pl-2 text-neutral-500">Categorias</p>
      <div className="flex gap-2 w-full py-4 px-2 items-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`p-4 py-2 border rounded-2xl cursor-pointer transition-colors ${
            selectedCategory === null
              ? "bg-purple-500 text-white border-purple-500"
              : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
          }`}
        >
          Todas
        </button>
        {dataCategories ? (
          dataCategories.data.map((v) => (
            <button
              key={v.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === v.id ? null : v.id)
              }
              className={`p-4 py-2 border rounded-2xl cursor-pointer transition-colors ${
                selectedCategory === v.id
                  ? "bg-purple-500 text-white border-purple-500"
                  : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              }`}
            >
              {v.name}
            </button>
          ))
        ) : (
          <>
            <p>No hay categorias</p>
          </>
        )}
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-2 justify-items-center">
        {isLoading && (
          <>
            <p className="text-center md:col-span-3">Cargando...</p>
          </>
        )}
        {data && data.data.length > 0 ? (
          data.data.map((v) => (
            <NewCard
              id={v.id}
              image_url={
                v.image_url ??
                "https://i.pinimg.com/1200x/bc/8e/1c/bc8e1cd9aca3ac07ce901f4529fa3fc9.jpg"
              }
              date={String(v.created_at)}
              title={v.title}
            />
          ))
        ) : (
          <>
            <p className="text-center col-span-1 md:col-span-3 w-full">
              No hay noticias por ahora disponibles
            </p>
          </>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
    </>
  );
}
