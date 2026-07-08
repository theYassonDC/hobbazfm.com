// src/features/horarios/hooks/useHorarios.ts
import { useQuery } from "@tanstack/react-query"
import type { Horario } from "~/libs/interface/horarios"
import { mapHorarios } from "~/libs/mappers/horarios.mapper"
import { getSchedules } from "~/libs/radio.service"

export const useHorarios = (semana: number, anio: number) => {
  return useQuery<Horario[]>({
    queryKey: ['horarios', semana, anio], // ← cuando semana cambia refetch automático
    queryFn:  async () => getSchedules({
        semana,
        anio
    }).then(r => mapHorarios(r)),
  })
}