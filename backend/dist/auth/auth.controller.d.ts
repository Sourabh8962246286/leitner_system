import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(req: any): Promise<{
        access_token: string;
    }>;
}
