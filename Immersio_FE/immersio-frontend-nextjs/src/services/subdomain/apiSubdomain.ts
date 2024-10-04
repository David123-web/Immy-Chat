import { getSubdomainName } from "@/src/helpers/strings";
import { http } from "../axiosService";

export async function getSubdomainConfig() {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/subdomain/config/${getSubdomainName()}`
  );
}