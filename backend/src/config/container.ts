import { UserRepository } from "@/repositories/user.repository";
import { UserService } from "@/services/user.service";


const userRepository = new UserRepository();
export const userService = new UserService(userRepository);