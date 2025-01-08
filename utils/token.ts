import { cookies } from "next/headers";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

export const TokenKeys = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
};

export const TokenService = {
  getToken(): string | undefined {
    if (typeof window === "undefined") {
      return cookies().get(TokenKeys.AUTH_TOKEN)?.value;
    }
    return getCookie(TokenKeys.AUTH_TOKEN) as string | undefined;
  },

  setToken(token: string): void {
    setCookie(TokenKeys.AUTH_TOKEN, token, {
      maxAge: 86400,
      path: "/",
      secure: true,
      sameSite: "strict",
    });
  },

  removeToken(): void {
    deleteCookie(TokenKeys.AUTH_TOKEN, { path: "/" });
  },

  getUserData<T>(): T | null {
    let userData: string | undefined;

    if (typeof window === "undefined") {
      userData = cookies().get(TokenKeys.USER_DATA)?.value;
    } else {
      userData = getCookie(TokenKeys.USER_DATA) as string | undefined;
    }

    return userData ? JSON.parse(userData) : null;
  },

  setUserData<T>(data: T): void {
    setCookie(TokenKeys.USER_DATA, JSON.stringify(data), {
      maxAge: 86400,
      path: "/",
      secure: true,
      sameSite: "strict",
    });
  },

  removeUserData(): void {
    deleteCookie(TokenKeys.USER_DATA, { path: "/" });
  },

  clearAll(): void {
    this.removeToken();
    this.removeUserData();
  },
};
