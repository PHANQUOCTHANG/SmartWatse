import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import AppError from '@/utils/appError';

/**
 * Chuyển ValidationError (kể cả nested) thành mảng message phẳng
 */
const flattenValidationErrors = (errors: ValidationError[]): string[] =>
  errors.flatMap(error => [
    ...Object.values(error.constraints || {}),
    ...(error.children?.length
      ? flattenValidationErrors(error.children)
      : []),
  ]);

/**
 * Middleware validate DTO
 * @param Dto Class DTO cần validate
 * @param skipMissingProperties dùng cho PATCH (mặc định là false)
 */
const validationMiddleware = (
  Dto: ClassConstructor<any>, 
  skipMissingProperties = false
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Chuyển plain object từ req.body sang Instance của Class DTO
    // Bỏ 'excludeExtraneousValues: true' để tránh việc phải thêm @Expose() cho mọi field
    const dto = plainToInstance(Dto, req.body);

    // 2. Tiến hành validate
    const errors = await validate(dto, {
      whitelist: true,               // Tự động loại bỏ các field thừa không khai báo trong DTO
      forbidNonWhitelisted: true,    // Báo lỗi nếu body chứa field không có trong DTO
      skipMissingProperties,         // Cho phép thiếu field (dùng khi Update/Patch)
    });

    // 3. Xử lý nếu có lỗi validation
    if (errors.length > 0) {
      const errorMessages = flattenValidationErrors(errors);
      
      return next(
        new AppError('Dữ liệu không hợp lệ', 422, true, {
          details: errorMessages,
        })
      );
    }

    // 4. Gán lại req.body bằng DTO đã được "làm sạch" (đã lọc qua whitelist)
    req.body = dto;
    next();
  };
};

export default validationMiddleware;