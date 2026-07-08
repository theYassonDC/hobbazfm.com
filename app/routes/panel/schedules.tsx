import TableSchedules from "~/components/schedules/TableSchedules";
import type { Route } from "../+types/home";
import { tokenContext } from "~/context";
import { useLoaderData } from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function Schedules() {
  const { token } = useLoaderData<typeof loader>();
  return (
    <>
      <TableSchedules isPanel={true} token={token} />
    </>
  );
}
