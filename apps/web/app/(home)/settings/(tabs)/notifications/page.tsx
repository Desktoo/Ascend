// src/app/settings/notifications/page.tsx
'use client';

import { useState } from 'react';
import { Bell, Monitor, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { clientEnv } from "../../../../../../../packages/config/client";
import { PushNotificationService } from '@/core/services/notifications/push.service';

export default function NotificationsPage() {
  // These would typically be populated by your SWR hook
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [desktopEnabled, setDesktopEnabled] = useState(false);
  const [remindersExpanded, setRemindersExpanded] = useState(false);
  const [midDayReminder, setMidDayReminder] = useState(true);

  // The VAPID Public Key from your Next.js environment variables
  const VAPID_PUBLIC_KEY = clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  const handleDesktopToggle = async (checked: boolean) => {
    if (checked) {
      // User turned it ON - Trigger the browser flow
      const success = await PushNotificationService.enablePushNotifications(VAPID_PUBLIC_KEY);
      if (success) {
        setDesktopEnabled(true);
        // Also call your backend PATCH /preferences to set webPushEnabled: true
      } else {
        // The user blocked it or an error occurred. Keep the UI disabled.
        setDesktopEnabled(false);
      }
    } else {
      // User turned it OFF - Call backend PATCH /preferences to set webPushEnabled: false
      setDesktopEnabled(false);
    }
  };

  return (
    <div className="max-w-2xl text-gray-200">
      <h1 className="text-2xl font-semibold mb-8 text-white">Notifications</h1>

      <div className="space-y-4">
        {/* MASTER NOTIFICATION ACCORDION / CARD */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-100">Master Notifications</h3>
                <p className="text-sm text-gray-400">Enable or disable all app notifications.</p>
              </div>
            </div>
            <ToggleSwitch checked={masterEnabled} onChange={setMasterEnabled} />
          </div>

          {/* NESTED SETTINGS (Only visible if Master is ON) */}
          {masterEnabled && (
            <div className="p-5 space-y-6 bg-[#0a0a0a]">
              
              {/* Desktop Push Setting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">Desktop Push Notifications</h4>
                    <p className="text-xs text-gray-500">Receive alerts even when the app is closed.</p>
                  </div>
                </div>
                <ToggleSwitch checked={desktopEnabled} onChange={handleDesktopToggle} />
              </div>

              {/* Reminders Accordion */}
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setRemindersExpanded(!remindersExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-[#121212] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">Daily Reminders</span>
                  </div>
                  {remindersExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Reminders Content */}
                {remindersExpanded && (
                  <div className="p-4 bg-[#0a0a0a] border-t border-gray-800 space-y-4">
                    <div className="flex items-center justify-between pl-7">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Mid-Day Check-in</h4>
                        <p className="text-xs text-gray-500">Receive a prompt halfway through your day.</p>
                      </div>
                      <ToggleSwitch 
                        checked={midDayReminder} 
                        onChange={(val) => {
                          setMidDayReminder(val);
                          // Call backend PATCH /preferences here
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * A reusable, accessible Tailwind Toggle Switch component
 */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`${
        checked ? 'bg-purple-600' : 'bg-gray-700'
      } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
    >
      <span
        aria-hidden="true"
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
}