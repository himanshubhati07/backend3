import { Request, Response } from 'express';
import { requireUser } from '../middleware/auth';
import { auditService } from '../services/audit.service';
import { resourceService } from '../services/resource.service';
import { sendSuccess } from '../utils/api-response';

export const resourceController = {
  async list(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await resourceService.list(req.query as never, requireUser(req)), 'Resources retrieved');
  },

  async getById(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await resourceService.getById(req.params.id, requireUser(req)), 'Resource retrieved');
  },

  async create(req: Request, res: Response): Promise<void> {
    const actor = requireUser(req);
    const resource = await resourceService.create(req.body, actor);
    await auditService.record({
      userId: actor.id,
      action: 'CREATE',
      resource: 'resource',
      resourceId: resource.id,
      details: `Created resource ${resource.name}`,
      ipAddress: req.ip,
    });
    sendSuccess(res, resource, 'Resource created', 201);
  },

  async update(req: Request, res: Response): Promise<void> {
    const actor = requireUser(req);
    const resource = await resourceService.update(req.params.id, req.body, actor);
    await auditService.record({
      userId: actor.id,
      action: 'UPDATE',
      resource: 'resource',
      resourceId: resource.id,
      details: `Updated fields: ${Object.keys(req.body).join(', ')}`,
      ipAddress: req.ip,
    });
    sendSuccess(res, resource, 'Resource updated');
  },

  async remove(req: Request, res: Response): Promise<void> {
    const actor = requireUser(req);
    await resourceService.remove(req.params.id, actor);
    await auditService.record({
      userId: actor.id,
      action: 'DELETE',
      resource: 'resource',
      resourceId: req.params.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, null, 'Resource deleted');
  },
};
