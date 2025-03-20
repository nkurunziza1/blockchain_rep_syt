import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaCamera,
  FaMapMarkerAlt,
  FaCertificate,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { ProfileImpactCard } from "../../appUi/components/profileCard";
import { UserProfile } from "../../types/profile";
import { getProfile } from "../../api/profiles";

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const MapMarkerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.success) {
        setProfile(response.profile);
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) =>
      prev
        ? {
          ...prev,
          [field]: value,
        }
        : null
    );
  };

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <div className="flex gap-6">
        {/* Impact Card - Left Sidebar */}
        <ProfileImpactCard />

        {/* Main Content */}
        <div className="w-2/3 space-y-6">
          {/* Profile Header Card - LinkedIn Style */}
          <div className="bg-white rounded-lg  border border-gray-200 overflow-hidden">
            {/* Cover Photo */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-700">
              {profile.coverPic ? (
                <img
                  src={profile.coverPic}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-80"
                />
              ) : null}
              <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 p-2 rounded-full transition">
                <FaCamera className="text-white" size={18} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="px-6 pb-6 relative">
              {/* Profile Picture */}
              <div className="absolute -top-16 left-6 rounded-full border-4 border-white ">
                <img
                  src={profile.profilePic}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-gray-200  p-1.5 rounded-full hover:bg-gray-300">
                  <FaCamera size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Profile Header */}
              <div className="pt-16">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl  mt-4  font-semibold text-gray-800 flex items-center">
                      {`${profile?.firstName} ${profile?.lastName}`}
                      <CheckCircleIcon />
                    </h1>

                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-base text-gray-600 font-medium">
                        {profile?.title}
                      </span>
                      <div className="h-4 border-l border-gray-300 mx-2"></div>
                      <div className="flex items-center text-gray-500 space-x-1">
                        <MapMarkerIcon />
                        <span className="text-sm">{`${profile?.district}, ${profile?.country}`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <FaEdit className="mr-2 cursor-pointer text-primaryBlueColor" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg  border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              {[
                { label: "Email", value: profile?.email },
                { label: "Phone", value: profile?.phone },
                { label: "Role", value: profile?.role },
                { label: "Gender", value: profile?.gender },
                { label: "Date of Birth", value: profile?.dateOfBirth },
                { label: "Reg Number", value: profile?.regNumber },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="font-medium">{item.value || "Not Provided"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg  border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">About</h2>
            <p className="text-gray-600">
              {profile?.descriptions || "No description provided"}
            </p>
          </div>

          {/* Sections with "Add" functionality */}
          {[
            {
              title: "Experience",
              icon: null,
              emptyText: "No experience added yet",
            },
            {
              title: "Education",
              icon: null,
              emptyText: "No education history added yet",
            },
            {
              title: "Certifications",
              icon: <FaCertificate className="mr-2 text-primaryBlueColor" />,
              emptyText: "No certifications added  yet",
            },
            { title: "Skills", icon: null, emptyText: "No skills added yet" },
          ].map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg  border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {section.icon}
                {section.title}
                <button className="ml-auto text-primaryBlueColor hover:bg-blue-50 px-3 py-1 rounded-full">
                  + Add
                </button>
              </h2>
              <div className="text-gray-500 text-center py-8">
                {section.emptyText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
