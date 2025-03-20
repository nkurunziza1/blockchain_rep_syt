import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../appUi/components/forms/Input";
import Button from "../../appUi/components/forms/Button";
import Heading from "../../appUi/components/ui/Heading";
import { useDropzone } from "react-dropzone";
import { createUser, fetchUserProfile } from "../../api/signup";
import { ICreateUser, signupSchema } from "../../schemas/user.schema";
import { debounce } from "lodash-es";
import SelectWithErrorCustomSelect from "../../appUi/components/forms/Select";
import Loading from "../../appUi/components/loading";
import { useNavigate } from "react-router-dom";

const debouncedFetch = debounce(
    (regNum: string, role: string, callback: (result: any) => void) => {
        fetchUserProfile(regNum, role).then(callback);
    },
    300
);

type User = {
    id: string;
    email: string;
    password: string;
    role: "student" | "teacher";
    sessionId: string;
    firstName: string;
    lastName: string;
    phone: string;
    regNumber: string;
    studentInfo?: StudentInfo;
    teacherInfo?: TeacherInfo;
};

type StudentInfo = {
    student_id: string;
    full_name: {
        first: string;
        middle: string;
        last: string;
    };
    registration_id: string;
    program: string;
    year_of_study: number;
    email: string;
    phone_number: string;
    school: string;
    department: string;
    enrolled_courses: Array<{
        course_id: string;
        course_name: string;
        duration_in_hours: number;
        credits: number;
    }>;
    status: string;
    gpa: number;
    date_of_birth: string;
    nationality: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: number;
    };
    study_progress: {
        completed_modules: number;
        total_modules: number;
    };
};

type TeacherInfo = {
    teacher_id: string;
    name: {
        first: string;
        last: string;
    };
    full_name: {
        first: string;
        middle: string;
        last: string;
    };
    registration_id: string;
    status: string;
    email: string;
    phone_number: string;
    registered_courses: Array<{
        course_id: string;
        course_name: string;
        course_credits: number;
    }>;
    experience_years: number;
    specialization: string;
};

const Signup: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [regNumber, setRegNumber] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<StudentInfo | TeacherInfo | null>(null);

    const roleOptions = [
        { value: "", label: "Select your role" },
        { value: "student", label: "Student" },
        { value: "teacher", label: "Lecturer" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<ICreateUser>({
        resolver: zodResolver(signupSchema),
    });

    const handleRegNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegNumber(value);

        if (value.length >= 3) {
            setIsFetching(true);
            debouncedFetch(value, role, (result) => {
                if (result.isDataFetched) {
                    setProfileData(result);
                    setValue("firstName", result.full_name.first);
                    setValue("lastName", result.full_name.last);
                    setValue("email", result.email);
                    setValue("phone", result.phone_number);
                    setIsDataFetched(true);
                } else {
                    setProfileData(null);
                    setValue("firstName", "");
                    setValue("lastName", "");
                    setValue("email", "");
                    setValue("phone", "");
                    setIsDataFetched(false);
                }
                setIsFetching(false);
            });
        } else {
            setValue("firstName", "");
            setValue("lastName", "");
            setValue("email", "");
            setValue("phone", "");
            setIsDataFetched(false);
        }
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                role: data.role,
                regNumber: regNumber,
                password: data.password,
                ...(role === "student" && profileData && {
                    studentInfo: profileData as StudentInfo
                }),
                ...(role === "teacher" && profileData && {
                    teacherInfo: profileData as TeacherInfo
                })
            };
            await createUser(userData, navigate);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[450px] bg-white p-4 border rounded-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <Heading
                    subTitle="Create your account to get started"
                    className="md:text-md"
                    subTitleClassName="text-base text-[16px] mt-0"
                >
                    Create Account
                </Heading>

                <SelectWithErrorCustomSelect
                    options={roleOptions}
                    label="Role"
                    isSearchable={false}
                    placeholder="Select your role"
                    error={errors.role?.message?.toString()}
                    value={roleOptions.find((option) => option.value === role)}
                    onChange={(selectedOption: any) => {
                        const value = selectedOption.value;
                        setRole(value);
                        setRegNumber("");
                        setIsDataFetched(false);
                        reset();
                        setValue("role", value);
                    }}
                />
                {role && (
                    <div className="relative">
                        <Input
                            error={errors.regNumber?.message}
                            {...register("regNumber")}
                            value={regNumber}
                            onChange={handleRegNumberChange}
                            label={`${role === "student" ? "Student" : "Teacher"
                                } Registration Number`}
                            placeholder={role === "student" ? "STU123456" : "LEC123456"}
                        />
                        {isFetching && (
                            <div className="absolute right-3 top-[70%] transform -translate-y-1/2">
                                <Loading />
                            </div>
                        )}
                    </div>
                )}

                <Input
                    error={errors.firstName?.message}
                    {...register("firstName")}
                    label="First Name"
                    disabled={!isDataFetched}
                    placeholder="Enter your first name"
                />

                <Input
                    error={errors.lastName?.message}
                    {...register("lastName")}
                    label="Last Name"
                    disabled={!isDataFetched}
                    placeholder="Enter your last name"
                />

                <Input
                    error={errors.email?.message}
                    {...register("email")}
                    label="Email"
                    type="email"
                    disabled={!isDataFetched}
                    placeholder="Enter your email"
                />

                <Input
                    error={errors.phone?.message}
                    {...register("phone")}
                    label="Phone Number"
                    disabled={!isDataFetched}
                    placeholder="Enter your phone number"
                />
                <Input
                    error={errors.password?.message}
                    {...register("password")}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                />
                <Button
                    loadingText="Creating account..."
                    isLoading={isLoading}
                    className={`${isLoading ? "bg-white" : "bg-largeTextColor"
                        } text-white`}
                >
                    Create Account
                </Button>

                <div className="pt-10">
                    <p className="text-sm">
                        By creating an account, you agree to E-portfolio's <br></br>
                        <a
                            href="/"
                            className="underline text-primaryBlueColor font-normal text-sm"
                        >
                            Conditions of Use
                        </a>{" "}
                        and{" "}
                        <a
                            href="/"
                            className="underline text-primaryBlueColor font-normal text-sm"
                        >
                            Privacy Notice.
                        </a>
                    </p>
                    <div className="flex flex-col shadow-md p-4 ">
                        <div className="h-[1px] bg-grayColor my-4"></div>
                        <h1 className="text-sm font-bold text-blackColor">
                            Buying for work?
                        </h1>
                        <p className="text-sm text-primaryBlueColor py-1">
                            Create a free business account
                        </p>
                    </div>

                    <p className="mt-auto font-normal text-sm pt-4">
                        Already have an account?{" "}
                        <a href="/login" className=" underline   text-primaryBlueColor">
                            Sign in
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
