export enum Role {
  Student = "student",
  Teacher = "teacher",
  Admin = "admin",
}

export type Course = {
  course_id: string;
  course_name: string;
  credits: string;
  duration_in_hours: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type UserProfile = {
  id: string;
  firstName: string;
  title: string;
  userId: string;
  lastName: string;
  email: string;
  phone: string;
  profilePic?: string;
  coverPic?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  country?: string;
  district?: string;
  regNumber?: string;
  role?: Role;
  descriptions?: string;
  province?: string;
};
