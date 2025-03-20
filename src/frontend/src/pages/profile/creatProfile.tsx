import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IcreateProfile, profileSchema } from "../../schemas/profiles";
import Heading from "../../appUi/components/ui/Heading";
import SelectWithErrorCustomSelect from "../../appUi/components/forms/Select";
import Input from "../../appUi/components/forms/Input";
import Button from "../../appUi/components/forms/Button";
import { ImageDropzone } from "../../appUi/components/dropzone/dropzone";
import { createProfile } from "../../api/profiles";
import { uploadToCloudinary } from "../../utils/uploadImg";
import { getStoredUserData } from "../../api/signin";
import { useNavigate } from "react-router-dom";

const ProfileCreation: React.FC = () => {

    const user = getStoredUserData();
    console.log("user", user)
    const [isLoading, setIsLoading] = useState(false);
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
    const [coverPicPreview, setCoverPicPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IcreateProfile>({
        resolver: zodResolver(profileSchema), defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            phone: user?.phone
        }
    });
    const navigate = useNavigate()
    const onSubmit = async (data: IcreateProfile) => {
        setIsLoading(true);
        try {
            await createProfile(data);
            const userData = getStoredUserData();
            if (userData) {
                const profileUrl = `/profile/${userData.lastName}-${userData.firstName}`.toLowerCase();
                navigate(profileUrl);
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false);
        }
    };


    const handleSetValue = (name: string, value: File) => {
        setValue(name as keyof IcreateProfile, value as any);
    };

    const gender = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
    ];
    const country = [{ value: "rwanda", label: "Rwanda" }];

    return (
        <div className="max-w-[650px] border  bg-white p-4 rounded-md mx-auto">
            <Heading
                subTitle="Create your profile to be seen by recruiters"
                className="md:text-md"
                subTitleClassName="text-base text-[16px] mt-0 mb-10"
            >
                Create your profile
            </Heading>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="relative mb-20">
                    <div>
                        <ImageDropzone
                            name="profilePic"
                            label="Profile Picture"
                            preview={profilePicPreview}
                            onPreviewChange={setProfilePicPreview}
                            setValue={handleSetValue}
                        />
                    </div>
                    <ImageDropzone
                        name="coverPic"
                        label="Cover Picture"
                        preview={coverPicPreview}
                        onPreviewChange={setCoverPicPreview}
                        setValue={handleSetValue}
                    />
                </div>

                <Input
                    error={errors.firstName?.message}
                    {...register("firstName")}
                    label="First Name"
                    placeholder="Enter your first name"
                />

                <Input
                    error={errors.lastName?.message}
                    {...register("lastName")}
                    label="Last Name"
                    placeholder="Enter your last name"
                />

                <Input
                    type="date"
                    error={errors.dateOfBirth?.message}
                    {...register("dateOfBirth")}
                    label="Date of Birth"
                />

                <SelectWithErrorCustomSelect
                    name="gender"
                    onChange={(selectedOption) => {
                        if (selectedOption?.value) {
                            setValue("gender", selectedOption.value as any);
                        }
                    }}
                    label="Gender"
                    options={gender}
                    error={errors.gender?.message}
                />

                <Input
                    type="email"
                    error={errors.email?.message}
                    {...register("email")}
                    label="Email"
                    placeholder="Enter your email"
                />

                <Input
                    error={errors.phone?.message}
                    {...register("phone")}
                    label="Phone Number"
                    placeholder="Enter your phone number"
                />

                <SelectWithErrorCustomSelect
                    name="country"
                    onChange={(selectedOption) => {
                        setValue("country", selectedOption?.value as any);
                    }}
                    label="Country"
                    options={country}
                    error={errors.country?.message}
                />

                <Input
                    error={errors.district?.message}
                    {...register("district")}
                    label="District"
                    placeholder="Enter your district"
                />

                <Input
                    error={errors.province?.message}
                    {...register("province")}
                    label="Province"
                    placeholder="Enter your province"
                />

                <Input
                    error={errors.title?.message}
                    {...register("title")}
                    label="Title"
                    placeholder="Enter your title"
                />

                <div>
                    <label htmlFor="descriptions" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="descriptions"
                        {...register("descriptions")}
                        rows={4}
                        placeholder="Enter your description"
                        className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm focus:ring-largeTextColor focus:border-largeTextColor sm:text-md ${errors.descriptions ? "border-red-500" : ""
                            }`}
                    ></textarea>
                    {errors.descriptions && (
                        <p className="text-red-500 text-sm mt-1">{errors.descriptions.message}</p>
                    )}
                </div>

                <Button
                    loadingText="create Profile..."
                    isLoading={isLoading}
                    className={`${isLoading ? "bg-white" : "bg-largeTextColor"
                        } text-white`}
                    type="submit"
                >
                    Create Profile
                </Button>
            </form>
        </div>
    );
};
export default ProfileCreation;
