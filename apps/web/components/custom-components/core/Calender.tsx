"use client";

import React, { useState } from "react";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { Calendar, Plus, MapPin, Clock, Video, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  location: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  date: Date;
  color: "yellow" | "blue" | "purple" | "gray";
  tags?: string[];
  hasJoinButton?: boolean;
}

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Team planning",
    location: "East camp, Room 205",
    startTime: "07:30",
    endTime: "09:00",
    date: new Date(2026, 4, 11),
    color: "yellow",
    tags: ["#dentistry"],
  },
  {
    id: "2",
    title: "Emergency visit",
    location: "West camp, Room 312",
    startTime: "07:00",
    endTime: "07:30",
    date: new Date(2026, 4, 11),
    color: "gray",
  },
  {
    id: "3",
    title: "Online visit",
    location: "West camp, Room 312",
    startTime: "07:00",
    endTime: "08:00",
    date: new Date(2026, 4, 12),
    color: "purple",
    hasJoinButton: true,
  },
  {
    id: "4",
    title: "Interns visit",
    location: "West camp, Conf 404",
    startTime: "08:30",
    endTime: "09:30",
    date: new Date(2026, 4, 13),
    color: "blue",
  },
];

const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export default function RedesignedWeeklyCalendar() {
  const [pivotDate, setPivotDate] = useState(new Date(2026, 4, 11));
  const startOfCurrentWeek = startOfWeek(pivotDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }).map((_, index) =>
    addDays(startOfCurrentWeek, index),
  );

  const timeSlots = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00"];
  const START_MINUTES = 7 * 60;
  const ROW_HEIGHT = 80; // Optimized slot height

  const colorVariants = {
    yellow: {
      bg: "bg-amber-500/10 dark:bg-amber-400/10",
      border: "border-amber-500/30 dark:border-amber-400/30",
      text: "text-amber-900 dark:text-amber-200",
      accent: "bg-amber-500",
      tag: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    },
    blue: {
      bg: "bg-sky-500/10 dark:bg-sky-400/10",
      border: "border-sky-500/30 dark:border-sky-400/30",
      text: "text-sky-900 dark:text-sky-200",
      accent: "bg-sky-500",
      tag: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    },
    purple: {
      bg: "bg-indigo-500/10 dark:bg-indigo-400/10",
      border: "border-indigo-500/30 dark:border-indigo-400/30",
      text: "text-indigo-900 dark:text-indigo-200",
      accent: "bg-indigo-500",
      tag: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    },
    gray: {
      bg: "bg-slate-500/10 dark:bg-slate-400/10",
      border: "border-slate-500/20 dark:border-slate-400/20",
      text: "text-slate-800 dark:text-slate-200",
      accent: "bg-slate-400",
      tag: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#0B0F17] min-h-screen text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Dr. Olivia
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Controls */}
          <div className="flex items-center bg-white dark:bg-[#151C28] border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setPivotDate(addDays(pivotDate, -7))}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {format(startOfCurrentWeek, "MMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMM d, yyyy")}
            </span>
            <button
              onClick={() => setPivotDate(addDays(pivotDate, 7))}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all">
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar View Container */}
      <div className="bg-white dark:bg-[#151C28] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-[65px_repeat(7,1fr)] sm:grid-cols-[80px_repeat(7,1fr)] border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#111622]">
          <div className="p-3 border-r border-slate-200 dark:border-slate-800/80 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            GMT+0
          </div>
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date(2026, 4, 14));
            return (
              <div
                key={idx}
                className={`py-3 px-1 text-center border-r last:border-r-0 border-slate-200 dark:border-slate-800/80 transition-colors ${
                  isToday ? "bg-indigo-500/5 dark:bg-indigo-500/10" : ""
                }`}
              >
                <span className={`block text-[11px] uppercase tracking-wider font-semibold ${
                  isToday ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                }`}>
                  {format(day, "EEE")}
                </span>
                <span className={`inline-flex items-center justify-center mt-1 w-8 h-8 rounded-full text-sm font-bold ${
                  isToday
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "text-slate-700 dark:text-slate-200"
                }`}>
                  {format(day, "d")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-[65px_repeat(7,1fr)] sm:grid-cols-[80px_repeat(7,1fr)] relative divide-x divide-slate-200 dark:divide-slate-800/80">
          {/* Time Axis Column */}
          <div className="bg-slate-50/30 dark:bg-[#111622]/30 select-none">
            {timeSlots.map((time, i) => (
              <div
                key={i}
                style={{ height: `${ROW_HEIGHT}px` }}
                className="pr-3 pt-2 text-right text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-200/60 dark:border-slate-800/40 last:border-b-0"
              >
                {time}
              </div>
            ))}
          </div>

          {/* 7 Day Column Tracks */}
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className="relative bg-transparent group">
              {/* Slot Background Dividers */}
              {timeSlots.map((_, slotIdx) => (
                <div
                  key={slotIdx}
                  style={{ height: `${ROW_HEIGHT}px` }}
                  className="border-b border-slate-100 dark:border-slate-800/40 last:border-b-0 group-hover:bg-slate-500/[0.015] transition-colors"
                />
              ))}

              {/* Render Events */}
              {MOCK_EVENTS.filter((event) => isSameDay(event.date, day)).map((event) => {
                const startMins = timeToMinutes(event.startTime);
                const endMins = timeToMinutes(event.endTime);

                // Pixel offsets using 80px per 30 minutes (2.666px per minute)
                const topOffset = ((startMins - START_MINUTES) / 30) * ROW_HEIGHT;
                const cardHeight = ((endMins - startMins) / 30) * ROW_HEIGHT;
                const variant = colorVariants[event.color];

                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 sm:left-1.5 sm:right-1.5 p-2.5 rounded-xl border backdrop-blur-md shadow-xs transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:z-20 cursor-pointer flex flex-col justify-between overflow-hidden ${variant.bg} ${variant.border} ${variant.text}`}
                    style={{
                      top: `${topOffset + 3}px`,
                      height: `${cardHeight - 6}px`,
                    }}
                  >
                    {/* Left Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${variant.accent}`} />

                    <div className="pl-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm leading-tight truncate">
                          {event.title}
                        </h4>
                        {event.tags && event.tags.length > 0 && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${variant.tag}`}>
                            {event.tags[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[11px] opacity-80 font-medium truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <div className="pl-1.5 mt-auto pt-1 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 text-[10px] font-semibold opacity-70">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>

                      {event.hasJoinButton && (
                        <button className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-xs transition-colors shrink-0">
                          <Video className="w-3 h-3" />
                          <span>Join</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}