import { IOtp } from "@/interface/otp.interface";
import { IOtpDocument, Otp } from "@/models/otp.model";

export interface IOtpRepository {
  create(data: Partial<IOtp>): Promise<IOtpDocument>;
  findValidByEmail(email: string): Promise<IOtpDocument | null>;
  markVerified(id: string): Promise<void>;
  deleteByEmail(email: string): Promise<void>;
}

export class OtpRepository implements IOtpRepository {
  // Tạo OTP mới
  async create(data: Partial<IOtp>): Promise<IOtpDocument> {
    return Otp.create(data);
  }

  // Tìm OTP còn hiệu lực
  async findValidByEmail(email: string): Promise<IOtpDocument | null> {
    const otps = await Otp.find({ email, verified: false });
    console.log(otps);
    const record = await Otp.findOne({ email });
    console.log(record);
    return record;
  }

  // Đánh dấu OTP đã xác thực
  async markVerified(id: string): Promise<void> {
    await Otp.findByIdAndUpdate(id, { verified: true });
  }

  // Xóa OTP cũ của email
  async deleteByEmail(email: string): Promise<void> {
    await Otp.deleteMany({ email });
  }
}
