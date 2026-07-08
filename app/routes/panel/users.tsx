import { tokenContext } from "~/context";
import type { Route } from "../+types/home";
import { getUsers } from "~/libs/radio.service";
import { useLoaderData } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createUser, deleteUser } from "~/libs/auth.service";
import { queryClient } from "~/libs/queyClient";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function UsersPage() {
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [username, setUsername] = useState("");
  const [schedule_title, setScheduleTitle] = useState("");
  // const [role, setRole] = useState('');
  const [password, setPassword] = useState("");
  const { token } = useLoaderData<typeof loader>();
  const { data, isLoading: isLoadingDataUsers } = useQuery({
    queryKey: ["users-data", page, limit],
    queryFn: () =>
      getUsers(token, {
        limit: String(limit),
        page: String(page),
      }),
  });

  const handleCancel = () => {
    setModal(false);
    setUsername("");
    setScheduleTitle("");
    // setRole('');
    setPassword("");
  };
  const createdUserMutation = useMutation({
    mutationFn: async () => {
      const data = {
        username,
        schedule_title,
        // role,
        password,
      };
      if (token) {
        const res = await createUser(token, data);
        return res;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-data"] });
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      if (token) {
        const res = await deleteUser(token, id);
        return res;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-data"] });
    },
  })
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    createdUserMutation.mutate();
    setModal(false);
  };
  const handleDelete = async (id: string) => {
    const res = confirm('¿Estas seguro que quieres borrar este usuario?');
    if (res) {
      deleteUserMutation.mutate(id)
    }
  }
  function generarContraseña(longitud = 12) {
    const mayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minus = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";

    const todos = mayus + minus + numeros;

    function randomChar(str: any) {
      return str[Math.floor(Math.random() * str.length)];
    }

    // Aseguramos al menos un carácter de cada tipo
    let password = [
      randomChar(mayus),
      randomChar(minus),
      randomChar(numeros),
    ];

    for (let i = password.length; i < longitud; i++) {
      password.push(randomChar(todos));
    }

    // Mezclamos el orden (Fisher-Yates shuffle)
    for (let i = password.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [password[i], password[j]] = [password[j], password[i]];
    }

    const passowrdGenerated = password.join("");
    setPassword(passowrdGenerated);
  }
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex gap-2 items-center">
        <button
          className="px-4 py-2 bg-green-500 border border-green-700 rounded-2xl hover:bg-green-700 cursor-pointer"
          onClick={() => setModal(true)}
        >
          Crear usuario
        </button>
        <select
          className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={1}>Numero de usuarios para ver</option>
          <option value={5}>Mostrar 5</option>
          <option value={10}>Mostrar 10</option>
          <option value={15}>Mostrar 15</option>
          <option value={20}>Mostrar 20</option>
        </select>
      </div>
      <table className="table-fixed border-collapse border border-neutral-400 text-center bg-neutral-600">
        <thead>
          <tr>
            <th>Nombre de usuario</th>
            <th>Activo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.data
            ? data!.data.map((v) => (
                <tr className="border border-neutral-400">
                  <td>{v.username}</td>
                  <td>{v.active === 1 ? "Si" : "No"}</td>
                  <td>{v.role}</td>
                  <td className="py-2">
                    <button className="px-4 py-2 bg-green-700 rounded-2xl cursor-pointer hover:bg-green-600 disabled:bg-green-800 disabled:cursor-no-drop" disabled>Editar</button>
                    <button onClick={() => handleDelete(v.id)} className="px-4 py-2 bg-red-500 rounded-2xl cursor-pointer hover:bg-red-600">Eliminar</button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <div className="flex gap-2 items-center w-full justify-center">
        <button
          aria-label="Siguiente"
          onClick={() => setPage(data!.prev_page_url != null ? page - 1 : 1)}
          className="w-auto px-4 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/10 transition-colors"
        >
          <img src="/assets/PiconLeft.svg" alt="right" width={12} />
          Anterior
        </button>
        <button
          aria-label="Siguiente"
          onClick={() => setPage(data!.next_page_url != null ? page + 1 : 1)}
          className="w-auto px-4 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/10 transition-colors"
        >
          Siguiente
          <img
            src="/assets/PiconLeft.svg"
            alt="right"
            width={12}
            className="rotate-180"
          />
        </button>
        {modal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={() => setModal(false)}
          >
            <div
              className="bg-neutral-900 rounded-xl p-5 w-1/2 h-2/3 shadow-xl border-2 border-neutral-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                className="flex flex-col justify-center gap-3"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-xs text-neutral-400">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="Schedule title"
                    className="text-xs text-neutral-400"
                  >
                    Titulo de horario
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setScheduleTitle(e.target.value)}
                    value={schedule_title}
                    className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-xs text-neutral-400"
                  >
                    Contraseña
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
                    />
                    <button
                      className="px-4 py-2 bg-green-500 rounded-2xl cursor-pointer hover:bg-green-500"
                      type="button"
                      onClick={() => generarContraseña()}
                    >
                      Generar
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 items-end w-full mt-10">
                  <button
                    className="px-4 py-2 bg-green-500 rounded-2xl cursor-pointer hover:bg-green-600"
                    type="submit"
                  >
                    Crear
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 rounded-2xl cursor-pointer hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
