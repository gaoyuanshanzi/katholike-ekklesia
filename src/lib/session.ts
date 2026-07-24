import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "fallback-secret-for-katholike-ekklesia-magazine-jwt-development-only";
const key = new TextEncoder().encode(JWT_SECRET);

export async function signSession(payload: { adminId: string }, expiresIn: string = "2h"): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifySession(token: string): Promise<{ adminId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as { adminId: string };
  } catch {
    return null;
  }
}
