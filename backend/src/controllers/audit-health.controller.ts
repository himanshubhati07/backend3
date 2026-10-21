import { Request, Response } from 'express';
import { auditService } from '../services/audit.service';
import { healthService } from '../services/health.service';
import { sendSuccess } from '../utils/api-response';

export const auditController = {
  async list(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await auditService.list(req.query as never), 'Audit logs retrieved');
  },
};

export const healthController = {
  async check(_req: Request, res: Response): Promise<void> {
    const report = await healthService.check();
    if (report.status === 'up') {
      sendSuccess(res, report, 'Service is healthy');
      return;
    }
    res.status(503).json({ success: false, message: 'Service is unavailable', errors: [], data: report });
  },

  live(_req: Request, res: Response): void {
    sendSuccess(res, { status: 'up' }, 'Alive');
  },
};
