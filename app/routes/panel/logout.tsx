import { destroySession, getSession } from "~/sessions.server";
import type { Route } from "../+types/home";
import { redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/panel/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}
export default function Logout() {
  return (
    <p>Cerrando session</p>
  )
}
