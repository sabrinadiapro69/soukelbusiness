import { cookies } from "next/headers";
import { wilayas } from "@/lib/wilayas";

export async function getWilayaPref(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get("wilaya_pref")?.value;
  return value && wilayas.includes(value) ? value : null;
}
