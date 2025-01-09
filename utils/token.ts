import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

export const TokenKeys = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
};

export const TokenService = {
  getToken(): string | undefined {
    const token = getCookie(TokenKeys.AUTH_TOKEN);
    // return token as string
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdhNWFjMDA2MGFiNTEzOGY3N2ZlNWEiLCJlbWFpbCI6ImNtaWh1bnlvQHN0cmF0aG1vcmUuZWR1Iiwicm9sZXMiOlsiZW1wbG95ZWUiLCJociJdLCJpYXQiOjE3MzYzNjYwMjUsImV4cCI6MTczNjQ1MjQyNX0.wwIn6uEjOorL-VFe8O_ejXL97C9Br6oKukWLJGXVPwQ";
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
    const userData = getCookie(TokenKeys.USER_DATA);
    return userData ? JSON.parse(userData as string) : null;
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
