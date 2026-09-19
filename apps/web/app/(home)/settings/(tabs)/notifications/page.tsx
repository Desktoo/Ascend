'use client';

import { useState } from 'react';
import { Bell, Monitor, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { clientEnv } from "../../../../../../../packages/config/client";
import { PushNotificationService } from '@/core/services/notifications/push.service';
import { NotificationPreferencesService } from '@/core/services/notifications/preference.service';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [desktopEnabled, setDesktopEnabled] = useState(false);
  const [remindersExpanded, setRemindersExpanded] = useState(false);
  const [midDayReminder, setMidDayReminder] = useState(true);

  const VAPID_PUBLIC_KEY = clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  // Handle Master Notification Toggle
  const handleMasterToggle = async (checked: boolean) => {
    setMasterEnabled(checked);
    try {
      await NotificationPreferencesService.updatePreferences({ masterNotification: checked });
    } catch (error) {
      toast.error("Failed to update master notification preference. Please try again.");
      console.error('Failed to update master notification preference:', error);
      setMasterEnabled(!checked); // Revert on error
    }
  };

  // Handle Desktop Push Notification Toggle
  const handleDesktopToggle = async (checked: boolean) => {
    if (checked) {
      const success = await PushNotificationService.enablePushNotifications(VAPID_PUBLIC_KEY);
      if (success) {
        setDesktopEnabled(true);
        try {
          await NotificationPreferencesService.updatePreferences({ webPushEnabled: true });
        } catch (error) {
          toast.error("Failed to update web push preference. Please try again.");
          console.error('Failed to update web push preference:', error);
        }
      } else {
        setDesktopEnabled(false);
      }
    } else {
      setDesktopEnabled(false);
      try {
        await NotificationPreferencesService.updatePreferences({ webPushEnabled: false });
      } catch (error) {
        toast.error("Failed to disable web push notifications. Please try again.");
        console.error('Failed to disable web push preference:', error);
        setDesktopEnabled(true); // Revert on error
      }
    }
  };

  // Handle Mid-Day Reminder Toggle
  const handleMidDayToggle = async (checked: boolean) => {
    setMidDayReminder(checked);
    try {
      await NotificationPreferencesService.updatePreferences({ midDayReminder: checked });
    } catch (error) {
      toast.error("Failed to update mid-day reminder preference. Please try again.");
      console.error('Failed to update mid-day reminder preference:', error);
      setMidDayReminder(!checked); // Revert on error
    }
  };

  return (
    <div className="max-w-lg text-gray-200">
      <h1 className="text-xl font-semibold mb-5 text-white">Notifications</h1>

      <div className="space-y-3">
        <div className="bg-[#121212] border border-gray-800 rounded-lg overflow-hidden">
          {/* Master Notifications */}
          <div className="flex items-center justify-between p-3.5 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-purple-500/10 rounded-md">
                <Bell className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-100">Master Notifications</h3>
                <p className="text-xs text-gray-400">Enable or disable all app notifications.</p>
              </div>
            </div>
            <Switch 
              className="scale-75 origin-right" 
              checked={masterEnabled} 
              onCheckedChange={handleMasterToggle} 
            />
          </div>

          {/* Nested Settings */}
          {masterEnabled && (
            <div className="p-3.5 space-y-3.5 bg-[#0a0a0a]">
              
              {/* Desktop Push Setting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Monitor className="w-3.5 h-3.5 text-gray-400" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-200">Desktop Push Notifications</h4>
                    <p className="text-[11px] text-gray-500">Receive alerts even when the app is closed.</p>
                  </div>
                </div>
                <Switch 
                  className="scale-75 origin-right" 
                  checked={desktopEnabled} 
                  onCheckedChange={handleDesktopToggle} 
                />
              </div>

              {/* Reminders Accordion */}
              <div className="border border-gray-800 rounded-md overflow-hidden">
                <button
                  onClick={() => setRemindersExpanded(!remindersExpanded)}
                  className="w-full flex items-center justify-between p-2.5 bg-[#121212] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-200">Daily Reminders</span>
                  </div>
                  {remindersExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </button>

                {/* Reminders Content */}
                {remindersExpanded && (
                  <div className="p-3 bg-[#0a0a0a] border-t border-gray-800 space-y-3">
                    <div className="flex items-center justify-between pl-6">
                      <div>
                        <h4 className="text-xs font-medium text-gray-300">Mid-Day Check-in</h4>
                        <p className="text-[11px] text-gray-500">Receive a prompt halfway through your day.</p>
                      </div>
                      <Switch 
                        className="scale-75 origin-right" 
                        checked={midDayReminder} 
                        onCheckedChange={handleMidDayToggle} 
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