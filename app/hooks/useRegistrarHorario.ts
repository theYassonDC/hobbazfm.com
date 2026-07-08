// src/features/horarios/hooks/useRegistrarHorario.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createSchedule, type RegistrarDTO } from "~/libs/radio.service"

export const useRegistrarHorario = (semana: number, anio: number, token?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegistrarDTO) =>
      createSchedule(data, token ? token : '') // <-- Token temporal
    .then(r => r), 

    onSuccess: () => {
      // Invalida el query de la semana actual → refetch automático
      queryClient.invalidateQueries({
        queryKey: ['horarios', semana, anio]
      })
    },

    onError: (error: any) => {
      console.error(error.response?.data?.message ?? 'Error al registrar horario')
    }
  })
}