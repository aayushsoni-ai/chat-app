import { useAppStore } from "@/store";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE
} from "@/utils/constants";
import { toast } from "sonner";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      const HOST = import.meta.env.VITE_SERVER_URL; // Corrected reference
      setImage(`${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      // Call function if it's not a boolean
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat"); // Corrected spelling
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("please setup yuor profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0]; // Corrected from `event.target.file`
    
    if (!file) {
        console.error("No file selected!");
        return;
    }

    const formData = new FormData();
    formData.append("profile-image", file);

    try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
            withCredentials: true,
        });

        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          localStorage.setItem("profileImage", response.data.image); // Store in localStorage
          toast.success("Image updated successfully");
      }
        // Convert image to DataURL for preview
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(error.response?.data?.message || "Something went wrong!");
    }
};

const handleImageDelete = async () => {
  try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });

      if (response.status === 200) {
          setUserInfo({ ...userInfo, image: null });
          toast.success("Profile image removed successfully.");
          setImage(null)
      }
  } catch (error) {
      console.error("Error removing image:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
  }
};




  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-30 w-30 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-6xl border-[0.5px] flex items-center justify-center rounded-full  
                    ${getColor(selectedColor)}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/45 rounded-full cursor-pointer"
                onClick={image ? handleImageDelete : handleFileInputClick}
              >
                {" "}
                {image ? (
                  <FaTrash className="text-white text-2xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-2xl cursor-pointer" />
                )}{" "}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png ,.jpg ,.jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full ">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-red-300 border-none"
              />
            </div>
            <div className="w-full ">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 text-black bg-red-200 border-none"
              />
            </div>
            <div className="w-full ">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 text-black bg-red-200 border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${
                    selectedColor === index
                      ? "outline outline-white/80 outline-1"
                      : ""
                  }
                  `}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-rose-400 hover:bg-rose-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
