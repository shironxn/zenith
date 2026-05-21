import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | undefined>;
};

type APIError = {
  message: string;
  fields?: Record<string, string>;
};

const normalizeError = (input: any): APIError => {
  if (typeof input === "string") {
    return { message: input };
  }

  if (Array.isArray(input)) {
    const fields = input.reduce((acc, item) => {
      if (item?.field && item?.error) acc[item.field] = item.error;
      return acc;
    }, {} as Record<string, string>);

    const first = input[0]?.error || "validation failed";
    return { message: first, fields };
  }

  if (input && typeof input === "object") {
    return { message: input.error || input.message || "request failed" };
  }

  return { message: "request failed" };
};

export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: APIError | null }> {
  const { params, ...init } = options;

  const url = new URL(`${BASE_API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get("access-token")?.value;
  const cookieHeader = cookieStore.toString();

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      return { data: null, error: normalizeError(errorData.error || errorData) };
    } catch {
      return { data: null, error: { message: res.statusText } };
    }
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return { data: null, error: null };
  }

  try {
    const data = await res.json();
    return { data, error: null };
  } catch {
    return { data: null, error: null };
  }
}
