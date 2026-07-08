import { NavLink } from "react-router";

export default function NotFound() {
  return (
    <div className="text-center text-2xl mt-10">
        <p>404</p>
        <p className="font-bold">Pagina no encontrada</p>
        <NavLink to={'/'} className="text-lg" >Volver al inicio</NavLink>
    </div>
  )
}
