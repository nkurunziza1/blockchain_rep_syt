import axios from "axios";
import toast from "react-hot-toast";
import { getStoredUserData } from "../signin";
import { StudentMarksRecord } from "../../types/students";

export const createMarks = async (marksData: StudentMarksRecord) => {
  try {
    const { sessionId } = getStoredUserData();
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/marks/create`,
      marksData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    toast.success("Marks added successfully");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add marks";
    toast.error(errorMessage);
    throw error;
  }
};

export const updateMarks = async (
  markId: string,
  updateData: Partial<StudentMarksRecord>
) => {
  try {
    const { sessionId } = getStoredUserData();
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/marks/update/${markId}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );

    toast.success("Marks updated successfully");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to update marks";
    console.log("response", error);
    toast.error(errorMessage);
    throw error;
  }
};

export const getStudentMarks = async () => {
  try {
    const { sessionId } = getStoredUserData();
    const response = await axios.get(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/marks`,
      {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch marks";
    toast.error(errorMessage);
    throw error;
  }
};

export const getStudentMark = async (regNumber: string) => {
  try {
    const { sessionId } = getStoredUserData();
    const response = await axios.get(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/marks/${regNumber}`,
      {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    console.log("response", response);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch marks";
    toast.error(errorMessage);
    throw error;
  }
};

export const getMarksHistory = async (
  regNumber: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  try {
    const { sessionId } = getStoredUserData();
    let url = `${
      (import.meta as any).env.VITE_CANISTER_ORIGIN
    }/marks/history/${regNumber}`;

    // Add date filters if provided
    if (filters?.startDate || filters?.endDate) {
      const params = new URLSearchParams();

      if (filters.startDate) {
        params.append("startDate", filters.startDate);
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch marks history";
    toast.error(errorMessage);
    throw error;
  }
};
