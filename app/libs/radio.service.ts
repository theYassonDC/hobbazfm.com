import { BASE_API_URL, BASE_URL } from "~/config/containts";
import type { CategoriesResponse } from "./interface/Categories.interface";
import type {
  Datum as NewResponse,
  NewsResponse,
} from "./interface/News.interface";
import type {
  SchedulesResponse,
  Datum as ScheduleData,
} from "./interface/Schedules.interface";
import type { UsersResponse } from "./interface/Users.interface";

export interface RadiosBlum {
  history: string[];
  title: string;
  art: string;
  ulistener: string;
  listeners: string;
  bitrate: string;
  djusername: string;
  djprofile: string;
}
export async function getRadioInfo(): Promise<RadiosBlum> {
  const res = await fetch(BASE_URL, { method: "GET" });
  const data = (await res.json()) as RadiosBlum;
  return data;
}

interface NewsProps {
  page: string;
  limit: string;
  category?: string;
}
export async function getNews(param: NewsProps): Promise<NewsResponse> {
  const params = new URLSearchParams({
    page: param.page,
    limit: param.limit,
  });
  if (param.category) {
    params.set("category", param.category);
  }
  const res = await fetch(`${BASE_API_URL}/api/public/news?${params}`, {
    method: "GET",
  });
  const data = (await res.json()) as NewsResponse;
  return data;
}

export async function getCategories(
  param: Omit<NewsProps, "category">,
): Promise<CategoriesResponse> {
  const params = new URLSearchParams({
    page: param.page,
    limit: param.limit,
  });
  const res = await fetch(
    `${BASE_API_URL}/api/public/categories_news?${params}`,
    { method: "GET" },
  );
  const data = (await res.json()) as CategoriesResponse;
  return data;
}

export async function getNewById(id: string): Promise<NewResponse> {
  const res = await fetch(`${BASE_API_URL}/api/public/news/${id}`, {
    method: "GET",
  });
  const data = (await res.json()) as NewResponse;
  return data;
}
interface SchedulesProps {
  semana: number;
  anio: number;
}
export async function getSchedules({
  semana,
  anio,
}: SchedulesProps): Promise<ScheduleData[]> {
  const res = await fetch(
    `${BASE_API_URL}/api/public/schedules?semana=${semana}&anio=${anio}`,
    {
      method: "GET",
    },
  );
  const data = (await res.json()) as SchedulesResponse;
  return data.data;
}
export interface RegistrarDTO {
  dia: number;
  hora: number;
  style: string;
  semana: number;
  anio: number;
}
export async function createSchedule(
  body: RegistrarDTO,
  token: string,
): Promise<ScheduleData> {
  const res = await fetch(`${BASE_API_URL}/api/schedules`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as ScheduleData;
  return data;
}
export async function getUsers(
  token: string | null,
  param: Omit<NewsProps, "category">,
): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: param.page,
    limit: param.limit,
  });
  const res = await fetch(`${BASE_API_URL}/api/users?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as UsersResponse;
  return data;
}

export async function getTeam(): Promise<UsersResponse> {
  const res = await fetch(`${BASE_API_URL}/api/public/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as UsersResponse;
  return data;
}