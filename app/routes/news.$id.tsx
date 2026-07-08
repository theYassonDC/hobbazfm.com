import { queryClient } from "~/libs/queyClient";
import type { Route } from "./+types/news.$id";
import { getNewById } from "~/libs/radio.service";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await queryClient.ensureQueryData({
    queryKey: ["news", params.id],
    queryFn: () => getNewById(params.id),
  });
  return null;
}

export default function NewPage({ params }: Route.ComponentProps) {
  const { data } = useQuery({
    queryKey: ["new", params.id],
    queryFn: () => getNewById(params.id),
  });

  if (!data) return null;
  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <div className="w-full h-full bg-linear-to-t from-black from-10% to-transparent absolute z-10"></div>
        <img
          src={data.image_url}
          alt="new.ssds"
          className="h-72 w-full object-cover absolute"
        />
      </div>
      <article className="flex flex-col gap-3 pl-4">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <pre>{data.content}</pre>
        <NavLink to="/news">Volver a las noticias</NavLink>
      </article>
    </div>
  );
}
