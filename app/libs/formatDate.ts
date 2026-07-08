const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const userLocale = navigator.language;

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(userLocale, {
    timeZone: userTimeZone, // 👈 zona horaria del usuario
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}