"use client";

import React from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import ProfileHeader from "./_components/Header";
import ProfileFormFields from "./_components/ProfileFormFields";
import { userService } from "@/core/services/user/update-profile";
import useUserProfile from "@/core/hooks/useUserProfile";

export interface ProfileFormValues {
  userName: string;
  email: string;
  dayStartTime: string;
}

export default function BasicProfilePage() {
  // 1. All hooks called unconditionally at the top level
  const { user, isLoading } = useUserProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, dirtyFields },
  } = useForm<ProfileFormValues>({
    // Using `values` automatically keeps the form synced when SWR user finishes loading
    values: user
      ? {
          userName: user.userName,
          email: user.email,
          dayStartTime: user.dayStartTime,
        }
      : undefined,
    mode: "onChange",
  });

  const { trigger: updateProfile, isMutating: isUpdating } = useSWRMutation(
    "/user/update-profile",
    userService.updateProfile,
    {
      onSuccess: (updatedUser) => {
        reset({
          userName: updatedUser.userName,
          email: updatedUser.email,
          dayStartTime: updatedUser.dayStartTime,
        });
      },
    }
  );

  const onSubmit = async (data: ProfileFormValues) => {
    const updatedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      const fieldKey = key as keyof ProfileFormValues;
      acc[fieldKey] = data[fieldKey];
      return acc;
    }, {} as Partial<ProfileFormValues>);

    if (Object.keys(updatedFields).length === 0) return;

    try {
      await updateProfile(updatedFields);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // 2. Early return / Loading state AFTER all hooks have executed
  if (isLoading || !user) {
    return (
      <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0C0C0E] text-zinc-400 text-xs font-mono">
        Loading user profile...
      </div>
    );
  }

  // 3. Render Form Component
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 rounded-2xl border h-full border-zinc-800 bg-[#0C0C0E] text-zinc-200 space-y-6 w-full max-w-full shadow-lg"
    >
      <ProfileHeader
        rank={user.rank}
        userName={user.userName}
        avatarUrl={ "/images/user-logo.png"}
        level={user.level}
        isSaveDisabled={!isDirty || !isValid}
        isUpdating={isUpdating}
      />

      <ProfileFormFields register={register} errors={errors} />
    </form>
  );
}