import { BASE_API_URL } from "~/config/containts";

interface HobbazImgResponse {
  img_url: string;
}
type actionTypes = "wave";
type sizesTypes = "n" | "l";

interface getKekoParams {
  user: string;
  action: actionTypes;
  size: sizesTypes;
}

export const getKekoImg = async (
  param: getKekoParams,
): Promise<HobbazImgResponse> => {
  const params = new URLSearchParams({
    user: param.user,
    action: param.action,
    size: param.size,
  });
  const res = await fetch(
    `${BASE_API_URL}/api/public/hobbazimg?${params}`,
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "es-ES,es;q=0.9",
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
  const data = (await res.json()) as HobbazImgResponse;
  return data;
};
