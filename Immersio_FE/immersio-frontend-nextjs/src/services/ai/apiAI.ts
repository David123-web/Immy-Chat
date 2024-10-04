import { http } from "../axiosService";

export async function getAIs(body) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/ai`,
    body
  );
}

export async function postAI(data) {
  return await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/ai`,
    data
  );
}

export async function getAI(id) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/ai/${id}`
  );
}

export async function updateAI(body) {
  return await http.patch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/ai/${body.id}`,
    { ...body, id: undefined }
  );
}