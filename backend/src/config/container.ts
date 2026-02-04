import {
  AreaRepository,
  IAreaRepository,
} from "@/repositories/area.repository";
import { BinRepository, IBinRepository } from "@/repositories/bin.repository";
import {
  CitizenReportRepository,
  ICitizenReportRepository,
} from "@/repositories/citizenReport.repository";
import {
  CollectionPointRepository,
  ICollectionPointRepository,
} from "@/repositories/collectionPoint.repository";
import {
  CollectionTaskRepository,
  ICollectionTaskRepository,
} from "@/repositories/collectionTask.repository";
import {
  CollectionScheduleRepository,
  ICollectionScheduleRepository,
} from "@/repositories/collectionSchedule.repository";
import { IOtpRepository, OtpRepository } from "@/repositories/otp.repository";
import {
  IRefreshTokenRepository,
  RefreshTokenRepository,
} from "@/repositories/refreshToken.repository";
import {
  IShiftRepository,
  ShiftRepository,
} from "@/repositories/shift.repository";
import {
  IUserRepository,
  UserRepository,
} from "@/repositories/user.repository";
import {
  IVehicleRepository,
  VehicleRepository,
} from "@/repositories/vehicle.repository";
import { AreaService, IAreaService } from "@/services/area.service";
import { AuthService, IAuthService } from "@/services/auth.service";
import { BinService, IBinService } from "@/services/bin.service";
import {
  CitizenReportService,
  ICitizenReportService,
} from "@/services/citizenReport.service";
import {
  CollectionPointService,
  ICollectionPointService,
} from "@/services/collectionPoint.service";
import {
  CollectionTaskService,
  ICollectionTaskService,
} from "@/services/collectionTask.service";
import {
  CollectionScheduleService,
  ICollectionScheduleService,
} from "@/services/collectionSchedule.service";
import { EmailService, IEmailService } from "@/services/email.service";
import { IOtpService, OtpService } from "@/services/otp.service";
import { IShiftService, ShiftService } from "@/services/shift.service";
import { SocketService } from "@/services/socket.service";
import { IUserService, UserService } from "@/services/user.service";
import { IVehicleService, VehicleService } from "@/services/vehicle.service";

// ==================== INITIALIZE REPOSITORIES ====================

const userRepository: IUserRepository = new UserRepository();
const refreshTokenRepository: IRefreshTokenRepository =
  new RefreshTokenRepository();
const otpRepository: IOtpRepository = new OtpRepository();
const binRepository: IBinRepository = new BinRepository();
const areaRepository: IAreaRepository = new AreaRepository();
const collectionPointRepository: ICollectionPointRepository =
  new CollectionPointRepository();
const vehicleRepository: IVehicleRepository = new VehicleRepository();
const citizenReportRepository: ICitizenReportRepository =
  new CitizenReportRepository();
const collectionScheduleRepository: ICollectionScheduleRepository =
  new CollectionScheduleRepository();
const shiftRepository: IShiftRepository = new ShiftRepository();
const collectionTaskRepository: ICollectionTaskRepository =
  new CollectionTaskRepository();

// ==================== INITIALIZE SERVICES ====================

export const socketService = new SocketService();

export const authService: IAuthService = new AuthService(
  userRepository,
  refreshTokenRepository,
  otpRepository,
);

export const userService: IUserService = new UserService(userRepository);

export const otpService: IOtpService = new OtpService(
  otpRepository,
  userRepository,
);

export const emailService: IEmailService = new EmailService();

export const binService: IBinService = new BinService(
  binRepository,
  socketService,
);

export const areaService: IAreaService = new AreaService(areaRepository);

export const collectionPointService: ICollectionPointService =
  new CollectionPointService(collectionPointRepository);

export const vehicleService: IVehicleService = new VehicleService(
  vehicleRepository,
  socketService,
);

export const citizenReportService: ICitizenReportService =
  new CitizenReportService(citizenReportRepository);

export const collectionScheduleService: ICollectionScheduleService =
  new CollectionScheduleService(collectionScheduleRepository);
export const shiftService: IShiftService = new ShiftService(
  shiftRepository,
  vehicleRepository,
  socketService,
);

export const collectionTaskService: ICollectionTaskService =
  new CollectionTaskService(collectionTaskRepository);
