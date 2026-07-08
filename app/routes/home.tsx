import CarruselNews from "~/components/news/Carrusel";
import type { Route } from "./+types/home";
import { Form } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HobbazFM ~ Tu mejor radio" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <h1 className="p-4 text-2xl text-center">
        ¡Bienvenido a la radio HobbazFM!
      </h1>
      <CarruselNews />
      <div className="flex flex-col p-3 w-full items-center">
        {/* <h1 className="p-4 text-2xl">¡Pide tu cancion!</h1>
        <Form className="flex flex-col w-72 gap-2">
          <label htmlFor="username">Nombre de usuario</label>
          <input type="text" name="username" id="username" className="px-4 py-2 bg-neutral-600 border-2 border-neutral-400 outline-none rounded-lg" />
          <label htmlFor="content">Peticion</label>
          <textarea name="content" id="content" className="px-4 py-2 bg-neutral-600 border-2 border-neutral-400 outline-none rounded-lg"></textarea>
          <button className="px-8 py-4 cursor-pointer bg-green-500 rounded-lg">Enviar</button>
        </Form> */}
      </div>
      <br />
      <br />
      <br />
    </>
  );
}
