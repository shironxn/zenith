"use server";

import { AuthLogin, AuthRegister } from "@/lib/schema/auth";
import { serverFetch } from "@/lib/api/server-client";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

const extractCookieValue = (raw: string, name: string) => {
  const match = raw.match(new RegExp(`${name}=([^;]+)`));
  return match?.[1];
};

export const Login = async (data: AuthLogin) => {
  const res = await fetch(`${BASE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    try {
      const result = await res.json();
      if (typeof result.error === "string") return result.error;
      if (Array.isArray(result.error)) return result.error[0]?.error || "login failed";
      return "login failed";
    } catch {
      return "login failed";
    }
  }

  const rawCookie = res.headers.get("set-cookie") ?? "";
  const accessToken = extractCookieValue(rawCookie, "access-token");
  const refreshToken = extractCookieValue(rawCookie, "refresh-token");

  if (!accessToken || !refreshToken) {
    return "failed to initialize session";
  }

  cookies().set("access-token", accessToken, {
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 10 * 60 * 1000),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  cookies().set("refresh-token", refreshToken, {
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const Register = async (data: AuthRegister) => {
  const { error } = await serverFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (error) return error.message;
};

export const Logout = async () => {
  const { error } = await serverFetch("/auth/logout", { method: "POST" });
  if (error) return error.message;
  cookies().delete("access-token");
  cookies().delete("refresh-token");
};
