import Navbar from "~/components/Navbar";
import { Outlet } from "react-router";
import Playerbar from "~/components/Playerbar";
import type { Route } from "./+types/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HobbazFM ~ Tu mejor radio" },
    { name: "description", content: "Bienvenido a tu radio favorita de hobbaz.es!" },
  ];
}

export default function LayoutWeb() {
  return (
    <>
      <Navbar />
      <main className="h-screen">
        <Outlet />
      </main>
      <Playerbar />
    </>
  );
}
