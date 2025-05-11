import { Request as ExpressRequest } from 'express';

export interface AuthenticatedRequest extends ExpressRequest {
    user: JwtDto;
}

export class JwtDto {
    sub: string;
    role: string;
    email: string;
}
