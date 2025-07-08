export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro: ${res.status} - ${res.statusText}`);
  }
  return res.json();
}
