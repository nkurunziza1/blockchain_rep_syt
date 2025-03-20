import axios from "axios";
import toast from "react-hot-toast";
import { ISignIn } from "../../schemas/user.schema";

interface LoginResponse {
  sessionId: string;
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  message: string;
  phone: string;
  email: string;
  regNumber: string;
}

export const loginUser = async (
  formData: ISignIn
): Promise<LoginResponse | any> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/auth/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = response;

    const tokenData = btoa(
      JSON.stringify({
        sessionId: data.sessionId,
        userId: data.userId,
        role: data.role,
        timestamp: new Date().getTime(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        regNumber: data.regNumber,
      })
    );

    localStorage.setItem("authToken", tokenData);
    toast.success(data.message || "Login successful");

    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    toast.error(errorMessage);
    return error;
  }
};

export const getStoredUserData = () => {
  const tokenData = localStorage.getItem("authToken");
  if (!tokenData) return null;

  try {
    return JSON.parse(atob(tokenData));
  } catch (error) {
    return error;
  }
};
