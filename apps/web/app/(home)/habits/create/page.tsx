"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import AnchorZone from "./_components/AnchorZone";
import Step1Intent from "./_components/Step1Intent";
import Step2Parameters from "./_components/Step2Parameters";
import Step3Execution, { PriorityType } from "./_components/Step3Execution";

import { habitService } from "@/core/services/habits/habits.service";
import { HabitDto } from "@/core/types/habits.types";
import { toast } from "sonner";

export interface HabitFormValues {
  title: string;
  description: string;
  selectedDays: string[];
  selectedTag: string;
  taskTitle: string;
  dueTime: string;
  priority: PriorityType;
}

export default function CreateHabitPage() {
  const router = useRouter();

  const methods = useForm<HabitFormValues>({
    defaultValues: {
      title: "",
      description: "",
      selectedDays: [],
      selectedTag: "",
      taskTitle: "",
      dueTime: "12:00",
      priority: "MEDIUM",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger: validateFields,
    formState: { isValid },
  } = methods;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSection1Confirmed, setIsSection1Confirmed] = useState(false);
  const [isSection2Confirmed, setIsSection2Confirmed] = useState(false);

  const { trigger: submitToServer, isMutating } = useSWRMutation(
    "/habits/create",
    habitService.createHabit,
  );

  const handleNextFromStep1 = async () => {
    const isStep1Valid = await validateFields("title");
    if (!isStep1Valid) return;
    setIsSection1Confirmed(true);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = async () => {
    const isStep2Valid = await validateFields(["selectedDays", "selectedTag"]);
    if (!isStep2Valid) return;
    setIsSection2Confirmed(true);
    setCurrentStep(3);
  };

  const handleBackToStep1 = () => {
    setIsSection1Confirmed(false);
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setIsSection2Confirmed(false);
    setCurrentStep(2);
  };

  const onSubmit = async (data: HabitFormValues) => {
    try {
      const payload: HabitDto = {
        title: data.title,
        description: data.description,
        selectedDays: data.selectedDays,
        selectedTag: data.selectedTag,
        taskTitle: data.taskTitle,
        dueTime: data.dueTime,
        priority: data.priority,
      };
      await submitToServer(payload);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to activate habit blueprint. Please try again.");
      console.error("Failed to activate habit blueprint:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between antialiased overflow-x-hidden"
      >
        <div className="w-full flex flex-col flex-1">
          <div className="flex items-center p-6 justify-between border-b border-zinc-900/60 bg-black/40 backdrop-blur-md sticky top-0 z-30">
            <button
              type="button"
              onClick={() => {
                if (currentStep === 3) handleBackToStep2();
                else if (currentStep === 2) handleBackToStep1();
                else router.back();
              }}
              className="flex items-center gap-2.5 text-sm text-zinc-500 hover:text-zinc-300 font-medium transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="transform group-hover:-translate-x-0.5 transition-transform duration-150"
              />
              {currentStep === 1
                ? "Back to Dashboard"
                : `Back to Step ${currentStep - 1}`}
            </button>
            <div className="text-xs font-semibold tracking-wider uppercase text-zinc-600">
              Habit Setup
            </div>
          </div>

          <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-20 items-start">
            <AnchorZone
              currentStep={currentStep}
              isSection1Confirmed={isSection1Confirmed}
              isSection2Confirmed={isSection2Confirmed}
              isStep3Valid={isValid}
            />

            <div className="lg:col-span-7 overflow-hidden py-2">
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  width: "300%",
                  transform: `translateX(-${(currentStep - 1) * (100 / 3)}%)`,
                }}
              >
                <Step1Intent onNext={handleNextFromStep1} />
                <Step2Parameters
                  onBack={handleBackToStep1}
                  onNext={handleNextFromStep2}
                />
                <Step3Execution
                  onBack={handleBackToStep2}
                  isMutating={isMutating}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
