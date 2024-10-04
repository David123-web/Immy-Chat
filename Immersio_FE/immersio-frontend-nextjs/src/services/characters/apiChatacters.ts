import { http } from "../axiosService";

export async function getCharacters() {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-characters`
  );
}

export async function postCharacter(data) {
  return await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-characters`,
    data
  );
}

export async function getCharacter(id) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-characters/${id}`
  );
}

export async function updateCharacter(body) {
  return await http.patch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-characters/${body.id}`,
    { ...body, id: undefined }
  );
}

export async function deleteCharacter(id) {
  return await http.delete(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-characters/${id}`
  );
}