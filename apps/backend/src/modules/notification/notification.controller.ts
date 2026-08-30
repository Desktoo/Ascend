// src/modules/notification/notification.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationPreferenceDto } from './dto/notification.dto';
import {
  type AuthenticatedRequest,
  AuthGaurd,
} from 'src/common/gaurds/auth.gaurds';
import { CreateWebPushSubscriptionDto } from './dto/web-push.dto';

// Assuming you have some sort of AuthGuard to populate req.user
// @UseGuards(JwtAuthGuard)
@Controller('notifications')
@UseGuards(AuthGaurd)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * 1. GET IN-APP NOTIFICATIONS (Offline Recovery)
   * The frontend calls this when the user opens the app or clicks the Bell icon.
   * It fetches the buffered notifications from MongoDB.
   */
  @Get('in-app')
  async getInAppNotifications(@Req() req: AuthenticatedRequest) {
    const data = await this.notificationService.getOfflineNotifications(
      req.user.userId,
    );
    return { success: true, data };
  }

  /**
   * 2. SAVE WEB PUSH SUBSCRIPTION
   * The frontend calls this after asking the browser for permission.
   */
  @Post('push/subscribe')
  async subscribeToWebPush(
    @Req() req: AuthenticatedRequest,
    @Body() subscriptionData: CreateWebPushSubscriptionDto,
  ) {
    await this.notificationService.saveWebPushSubscription(
      req.user.userId,
      subscriptionData,
    );
    return { success: true, message: 'Push subscription saved successfully!' };
  }

  /**
   * 3. UPDATE USER PREFERENCES
   * The frontend calls this when the user toggles settings on their Profile page.
   */
  @Patch('preferences')
  async updatePreferences(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    const userId = req.user.userId;

    const updatedPrefs = await this.notificationService.updatePreference(
      userId,
      dto,
    );

    return {
      success: true,
      data: updatedPrefs,
    };
  }
}
