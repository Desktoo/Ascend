"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import IdentityStep from "./_components/IdentityStep";
import HorizonStep from "./_components/HorizonStep";
import BlueprintStep from "./_components/BlueprintStep";
import TimelineStepper from "./_components/TimelineStepper";
import { CreateObjectiveFormState } from "./types/create-habit.types";
import { objectiveService } from "@/core/services/objectives/objective.service";
import { GoalDto } from "@/core/types/objective.types";
import { toast } from "sonner";

export default function CreateObjectivePage() {
  const router = useRouter();

  // Handle server sync pipelines exclusively using SWR mutation primitives
  const { trigger: submitToServer, isMutating } = useSWRMutation(
    "/goals",
    objectiveService.createObjective,
    { throwOnError: true }
  );

  const methods = useForm<CreateObjectiveFormState>({
    defaultValues: {
      title: "",
      description: "",
      rewardText: "",
      timeframe: "Weekly",
      weekendsExcluded: false,
      configuredWorkDaysPerWeek: 5,
      firstGoalTask: "",
      goalTaskPriority: "MEDIUM",
      goalTaskDueTime: "12:00",
      startDate: new Date().toISOString().split("T")[0],
      monthlyWeekThemes: ["", "", "", "", ""],
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    trigger: validateFields,
    formState: { isValid },
  } = methods;

  const timeframeValue = watch("timeframe");

  // Step state management blocks for visual tracking carousel
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSection1Confirmed, setIsSection1Confirmed] = useState(false);
  const [isSection2Confirmed, setIsSection2Confirmed] = useState(false);

  // Structural step gatekeepers leveraging React Hook Form field validators
  const handleNextFromStep1 = async () => {
    const isStep1Valid = await validateFields(["title", "description"]);
    if (!isStep1Valid) return;
    setIsSection1Confirmed(true);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = async () => {
    const isStep2Valid = await validateFields([
      "timeframe",
      "configuredWorkDaysPerWeek",
      "startDate",
    ]);
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

  const onSubmit = async (data: CreateObjectiveFormState) => {
    try {
      // Map component form matrix state safely to specified backend schema payloads
      const payload: GoalDto = {
        title: data.title,
        description: data.description,
        rewardText: data.rewardText,
        timeframe: data.timeframe,
        weekendsExcluded: data.weekendsExcluded,
        configuredWorkDaysPerWeek: Number(data.configuredWorkDaysPerWeek),
        startDate: data.startDate,
        monthlyWeekThemes: data.timeframe === "Monthly" ? data.monthlyWeekThemes : [],
        firstGoalTask: data.firstGoalTask,
        goalTaskDueTime: data.goalTaskDueTime,
        goalTaskPriority: data.goalTaskPriority,
      };

      console.log("Activating production execution payload via SWR: ", payload);
      await submitToServer(payload);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to execute objective deployment sequence. Please try again.");
      console.error("Failed to execute objective deployment sequence:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between antialiased overflow-x-hidden"
      >
        <div className="w-full flex flex-col flex-1">
          {/* STICKY TOP NAVIGATION BAR */}
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
            <div className="text-xs font-semibold tracking-wider uppercase text-purple-400 font-mono">
              Objective Setup Engine
            </div>
          </div>

          {/* MAIN COLUMN ASYMMETRIC CONTENT MATRIX */}
          <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-20 items-start">
            {/* LEFT STICKY TRACKING PANEL */}
            <TimelineStepper
              currentStep={currentStep}
              isSection1Confirmed={isSection1Confirmed}
              isSection2Confirmed={isSection2Confirmed}
              isStep3Valid={isValid}
            />

            {/* RIGHT CAROUSEL SLATE VIEWS */}
            <div className="lg:col-span-7 overflow-hidden py-2 w-full">
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  width: "300%",
                  transform: `translateX(-${(currentStep - 1) * (100 / 3)}%)`,
                }}
              >
                {/* Step 1: Identity Panel view */}
                <IdentityStep onNext={handleNextFromStep1} />

                {/* Step 2: Horizon Parameters Panel view */}
                <HorizonStep
                  onBack={handleBackToStep1}
                  onNext={handleNextFromStep2}
                />

                {/* Step 3: Blueprint Final Activation Panel view */}
                <BlueprintStep
                  timeframe={timeframeValue}
                  onBack={handleBackToStep2}
                  isSubmitting={isMutating}
                  isValid={isValid}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}