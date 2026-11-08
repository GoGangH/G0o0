export async function adminApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin${url}`, { cache: "no-store", ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "요청을 처리하지 못했어요");
  return data;
}
export const json = (method: string, body: unknown): RequestInit => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
