import * as z from "zod";

export enum Gender {
  Female = "female",
  Male = "male",
}

export enum Country {
  Rwanda = "rwanda",
}

export const profileSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, { message: "First name is required" }),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, { message: "Last name is required" }),
  dateOfBirth: z
    .string({ required_error: "Date of birth is required" })
    .nonempty("Date of birth is required"),
  gender: z.nativeEnum(Gender, {
    required_error: "Gender is required",
    invalid_type_error: "Please select a valid gender",
  }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  phone: z
    .string({ required_error: "Phone number is required" })
    .nonempty("Phone number is required"),
  country: z.nativeEnum(Country, { required_error: "Country is required" }),
  province: z
    .string({ required_error: "Province is required" })
    .nonempty("Province is required"),
  district: z
    .string({ required_error: "District is required" })
    .nonempty("District is required"),
  profilePic: z.instanceof(File).optional(),
  coverPic: z.instanceof(File).optional(),
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  descriptions: z
    .string({ required_error: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),
});

export type IcreateProfile = z.infer<typeof profileSchema>;
