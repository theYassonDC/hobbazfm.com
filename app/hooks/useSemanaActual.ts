export const useSemanaActual = () => {
  const ahora  = new Date()
  const inicio = new Date(ahora.getFullYear(), 0, 1)
  const semana = Math.ceil(
    ((ahora.getTime() - inicio.getTime()) / 86400000 + inicio.getDay() + 1) / 7
  )
  return { semana, anio: ahora.getFullYear() }
}