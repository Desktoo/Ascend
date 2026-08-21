// components/custom-components/common/TimeZoneSync.tsx
"use client";

import { useEffect } from "react";
import { apiClient } from "@/core/services/client";

export default function TimeZoneSync() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cachedTz = localStorage.getItem("dm_tz");

    if (cachedTz === tz) return;

    apiClient("/user/timezone", {
      method: "PATCH",
      body: JSON.stringify({ timeZone: tz }),
    })
      .then(() => localStorage.setItem("dm_tz", tz))
      .catch(() => {});
  }, []);

  return null; // renders nothing, purely a side-effect component
}