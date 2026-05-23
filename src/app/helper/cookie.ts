import type { Response } from "express";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options?: {
    httpOnly?: boolean;
    secure?: boolean;
    maxAge?: number; // in milliseconds
    sameSite?: "strict" | "lax" | "none";
    path?: string;
  }
) => {
  res.cookie(name, value, {
    httpOnly: options?.httpOnly ?? true,
    secure: options?.secure ?? false, // set true in prod with https
    maxAge: options?.maxAge ?? 7 * 24 * 60 * 60 * 1000, // default 7 days
    sameSite: options?.sameSite ?? "lax",
    path: options?.path ?? "/",
  });
};
//  setCookie(res, "token", token, { secure: true, maxAge: 24 * 60 * 60 * 1000 });