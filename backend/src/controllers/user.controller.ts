import { Request, Response } from 'express';
import { requireUser } from '../middleware/auth';
import { auditService } from '../services/audit.service';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/api-response';
import { AppError } from '../utils/errors';

function assertSelfOrAdmin(req: Request, targetId: string): void {
  const actor = requireUser(req);
  if (actor.role !== 'admin' && actor.id !== targetId) {
    throw AppError.forbidden();
  }
}

export const userController = {
  async list(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await userService.list(req.query as never), 'Users retrieved');
  },

  async getById(req: Request, res: Response): Promise<void> {
    assertSelfOrAdmin(req, req.params.id);
    sendSuccess(res, await userService.getById(req.params.id), 'User retrieved');
  },

  async create(req: Request, res: Response): Promise<void> {
    const user = await userService.create(req.body);
    await auditService.record({
      userId: requireUser(req).id,
      action: 'CREATE',
      resource: 'user',
      resourceId: user.id,
      details: `Created user ${user.email}`,
      ipAddress: req.ip,
    });
    sendSuccess(res, user, 'User created', 201);
  },

  async update(req: Request, res: Response): Promise<void> {
    const actor = requireUser(req);
    assertSelfOrAdmin(req, req.params.id);
    if (actor.role !== 'admin' && (req.body.role !== undefined || req.body.status !== undefined)) {
      throw AppError.forbidden('Only administrators can change role or status');
    }
    const user = await userService.update(req.params.id, req.body);
    await auditService.record({
      userId: actor.id,
      action: 'UPDATE',
      resource: 'user',
      resourceId: user.id,
      details: `Updated fields: ${Object.keys(req.body).join(', ')}`,
      ipAddress: req.ip,
    });
    sendSuccess(res, user, 'User updated');
  },

  async remove(req: Request, res: Response): Promise<void> {
    const actor = requireUser(req);
    if (actor.id === req.params.id) {
      throw AppError.badRequest('You cannot delete your own account');
    }
    await userService.remove(req.params.id);
    await auditService.record({
      userId: actor.id,
      action: 'DELETE',
      resource: 'user',
      resourceId: req.params.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, null, 'User deleted');
  },
};
