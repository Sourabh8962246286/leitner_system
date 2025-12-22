"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user._id.toString() };
        const refreshSecret = this.configService.get('JWT_REFRESH_TOKEN_SECRET');
        const refreshExpiresIn = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
        if (!refreshSecret || !refreshExpiresIn) {
            throw new Error('JWT Refresh token configuration is missing in environment variables.');
        }
        const refreshOptions = {
            secret: refreshSecret,
            expiresIn: +refreshExpiresIn,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, refreshOptions),
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findOne(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const user = await this.usersService.create(registerDto);
        const { password, ...result } = user.toObject();
        return result;
    }
    async refreshTokens(userId, email) {
        const payload = { email, sub: userId };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            access_token: accessToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map