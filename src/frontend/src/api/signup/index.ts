import axios from "axios";
import { ICreateUser } from "../../schemas/user.schema";
import toast from "react-hot-toast";

export const fetchUserProfile = async (
  regNumber: string,
  role: string
): Promise<any> => {
  try {
    const baseUrl = (import.meta as any).env.VITE_BASE_URL;
    const endpoint =
      role === "student" ? `${baseUrl}/students` : `${baseUrl}/teachers`;
    const response = await fetch(endpoint);
    const profiles = await response.json();
    const profile = profiles.find(
      (profile: any) => profile.registration_id === regNumber
    );

    console.log("response", profiles);
    if (profile) {
      return {
        ...profile, // Return all profile data
        isDataFetched: true,
      };
    } else {
      return { isDataFetched: false };
    }
  } catch (error) {
    return { isDataFetched: false };
  }
};

export const createUser = async (
  formData: ICreateUser,
  navigate: (path: string) => void
): Promise<string | undefined> => {
  try {
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/auth/signup`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success(response.data.message);
    navigate("/login");
    return response.data;
  } catch (error: string | any) {
    console.error("Error creating user:", error);
    toast.error(error.response.data.message);
    return error.message;
  }
};
