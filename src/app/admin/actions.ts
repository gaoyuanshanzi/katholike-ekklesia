"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession } from "@/lib/session";

const ADMIN_ID = process.env.ADMIN_ID || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bopyun";

export type ActionResponse = {
  error?: string;
} | undefined;

export async function loginAdmin(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "아이디와 비밀번호를 모두 입력해 주세요." };
  }

  if (username !== ADMIN_ID || password !== ADMIN_PASSWORD) {
    return { error: "아이디 또는 비밀번호가 잘못되었습니다." };
  }

  // Generate session token
  const token = await signSession({ adminId: username });

  // Set session cookie (HTTPOnly)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7200, // 2 hours
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
