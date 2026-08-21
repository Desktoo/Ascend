"use client";

import React from "react";

interface FormActionsProps {
  isDirty: boolean;
  isValid: boolean;
  onReset: () => void;
}

export default function FormActions({
  isDirty,
  isValid,
  onReset,
}: FormActionsProps) {
  return (
    <div className="pt-6 border-t border-zinc-800 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onReset}
        disabled={!isDirty}
        className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Reset
      </button>

      <button
        type="submit"
        disabled={!isDirty || !isValid}
        className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-xs text-white font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        Save Changes
      </button>
    </div>
  );
}