import { http } from "../axiosService";

export async function getDrills(body) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drills`,
    body
  );
}

export async function getDrillsPublic(body) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drills/public`,
    body
  );
}

export async function postDrill(data) {
  const result =  await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drills`,
    data
  );
  console.log(`postDrill RESPONSE: ${JSON.stringify(result?.data, null, 2)}`)
  return result;
}

export async function getDrill(id) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drills/${id}`
  );
}

export async function updateDrill(body) {
  const result =  await http.patch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drills/${body.id}`,
    { ...body, id: undefined }
  );
  console.log(`updateDrill RESPONSE: ${JSON.stringify(result?.data, null, 2)}`)
  return result;
}

export async function deleteDrill(id) {
  return await http.delete(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/drills/${id}`
  );
}