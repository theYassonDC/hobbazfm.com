import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "~/libs/auth.service";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [schedule_title, setScheduleTitle] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(0);
  const [mathPassword, setMathPassword] = useState("");
  const registerMutation = useMutation({
    mutationFn: async (data: UserRegisterDto) => {
      const res = await registerUser(data);
      return res;
    },
    onSuccess: () => {
      navigate("/panel/login");
    },
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (mathPassword !== password) return;
    const data = {
      username,
      schedule_title,
      password,
      code,
    };
    registerMutation.mutate(data);
  };
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <h1 className="text-3xl text-neutral-200 py-8">Registrar usuario al panel</h1>
      <form
        className="flex flex-col justify-center gap-3 w-92"
        onSubmit={handleSubmit}
      >
        {registerMutation.isError ? (
          <p className="text-sm text-red-500">
            {registerMutation.error.message}
          </p>
        ) : null}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs text-neutral-400">
            Codigo de registro
          </label>
          <input
            type="number"
            onChange={(e) => setCode(Number(e.target.value))}
            value={code}
            className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
          />
        </div>
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
          <label htmlFor="Schedule title" className="text-xs text-neutral-400">
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
          <label htmlFor="password" className="text-xs text-neutral-400">
            Contraseña
          </label>
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password_repeat" className="text-xs text-neutral-400">
            Repetir contraseña
          </label>
          <input
            type="text"
            onChange={(e) => setMathPassword(e.target.value)}
            value={mathPassword}
            className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
          />
          {mathPassword != password ? (
            <>
              <p className="text-sm text-red-500">
                Las contraseña no coinciden
              </p>
            </>
          ) : null}
        </div>
        <button
          className="px-4 py-2 bg-green-500 rounded-2xl cursor-pointer hover:bg-green-600"
          type="submit"
        >
          {registerMutation.isPending ? 'Procesando..' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}
