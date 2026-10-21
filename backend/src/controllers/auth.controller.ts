import { Request, Response } from 'express';
import { requireUser } from '../middleware/auth';
import { auditService } from '../services/audit.service';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/api-response';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body);
    await auditService.record({
      userId: result.user.id,
      action: 'REGISTER',
      resource: 'user',
      resourceId: result.user.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, result, 'Registration successful', 201);
  },

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body.email, req.body.password);
    await auditService.record({
      userId: result.user.id,
      action: 'LOGIN',
      resource: 'user',
      resourceId: result.user.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, result, 'Login successful');
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const result = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, result, 'Token refreshed');
  },

  async logout(req: Request, res: Response): Promise<void> {
    await authService.logout(req.body.refreshToken);
    sendSuccess(res, null, 'Logged out');
  },

  async me(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await userService.getById(requireUser(req).id));
  },
};
