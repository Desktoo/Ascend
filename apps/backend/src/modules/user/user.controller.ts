import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  Body,
  UseGuards,
  Post,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AuthGaurd,
  type AuthenticatedRequest,
} from 'src/common/gaurds/auth.gaurds';
import { UserService } from './user.service';
import { UpdateTimeZoneDto } from './dto/timeZone.dto';
import { SelfReflectionService } from './self-reflection/self-reflection.service';
import { SubmitSelfReflectionDto } from './dto/submit-reflection.dto';
import { UserActivityService } from './repos/user-activity.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';

@Controller('user')
@UseGuards(AuthGaurd)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly selfReflectionService: SelfReflectionService,
    private readonly activityService: UserActivityService,
  ) {}

  @Get('profile')
  async getUserProfile(@Req() req: AuthenticatedRequest) {
    const profile = await this.userService.getUserProfile(req.user.userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  @Patch('timezone')
  @HttpCode(HttpStatus.OK)
  async updateTimeZone(
    @Body() dto: UpdateTimeZoneDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.userService.updateUserTimeZone(req.user.userId, dto.timeZone);

    return {
      success: true,
      message: 'Timezone synchronized successfully.',
    };
  }

  @Post('self-reflection')
  @HttpCode(HttpStatus.OK)
  async submitDailySelfReflection(
    @Body() dto: SubmitSelfReflectionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.selfReflectionService.submitReflection(dto, req.user.userId);
    return {
      success: true,
      message: 'Self reflection recorded successfully.',
    };
  }

  @Post('active')
  @HttpCode(HttpStatus.OK)
  async recordUserActivity(@Req() req: AuthenticatedRequest) {
    await this.activityService.recordActivity(req.user.userId);
    return {
      success: true,
    };
  }

  @Patch('update-profile')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Extract authenticated user ID from request context (e.g. JWT payload)
    const userId = req.user.userId;

    return await this.userService.updateProfile(userId, dto || {}, file);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;

    await this.userService.changePassword(userId, dto);

    return {
      message: 'Password updated successfully.',
    };
  }

  @Patch('onboarding')
  async completeOnboarding(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CompleteOnboardingDto,
  ) {
    const user = await this.userService.completeOnboarding(
      req.user.userId,
      dto,
    );
    return {
      success: true,
      data: user,
    };
  }
}
