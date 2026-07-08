import { useQuery } from "@tanstack/react-query";
import StatCard from "~/components/panel/StatCard";
import { tokenContext } from "~/context";
import { getNews, getUsers } from "~/libs/radio.service";
import type { Route } from "../+types/home";
import { useLoaderData } from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function Dashboard() {
  const { token } = useLoaderData<typeof loader>();
  const { data, isLoading } = useQuery({
    queryKey: ["news-data"],
    queryFn: () =>
      getNews({
        limit: "10",
        page: "1",
      }),
  });
  const { data: dataUsers, isLoading: isLoadingDataUsers } = useQuery({
    queryKey: ["users-data"],
    queryFn: () =>
      getUsers(token, {
        limit: "10",
        page: "1",
      }),
  });

  return (
    <div className="grid grid-cols-3">
      <div className="flex gap-2 col-span-3 py-2 px-4">
        <StatCard description="Total de usuarios" value={dataUsers ? dataUsers.total : 0} style="green" />
        <StatCard
          description="Noticias"
          value={data ? data.total : 0}
          style="red"
        />
      </div>
    </div>
  );
}
