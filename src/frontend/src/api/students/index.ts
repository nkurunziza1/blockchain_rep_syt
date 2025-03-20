import { getStoredUserData } from "../signin";
import axios from "axios";

export const getStudents = async (): Promise<any> => {
  try {
    const { sessionId } = getStoredUserData();

    const response = await axios.get(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/students`,
      {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

export const getStudentApi = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `${(import.meta as any).env.VITE_BASE_URL}/students`
    );
    return response.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};
