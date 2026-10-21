import { Router } from 'express';
import { auditController, healthController } from '../controllers/audit-health.controller';
import { authController } from '../controllers/auth.controller';
import { resourceController } from '../controllers/resource.controller';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/error-handler';
import { authRateLimiter } from '../middleware/rate-limit';
import { validate } from '../middleware/validate';
import {
  createResourceSchema,
  createUserSchema,
  idParamsSchema,
  listAuditQuerySchema,
  listResourcesQuerySchema,
  listUsersQuerySchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  updateResourceSchema,
  updateUserSchema,
} from '../schemas';

const authRouter = Router();
authRouter.post('/register', authRateLimiter, validate({ body: registerSchema }), asyncHandler(authController.register));
authRouter.post('/login', authRateLimiter, validate({ body: loginSchema }), asyncHandler(authController.login));
authRouter.post('/refresh', authRateLimiter, validate({ body: refreshSchema }), asyncHandler(authController.refresh));
authRouter.post('/logout', validate({ body: refreshSchema }), asyncHandler(authController.logout));
authRouter.get('/me', authenticate, asyncHandler(authController.me));

const userRouter = Router();
userRouter.use(authenticate);
userRouter.get('/', authorize('admin'), validate({ query: listUsersQuerySchema }), asyncHandler(userController.list));
userRouter.post('/', authorize('admin'), validate({ body: createUserSchema }), asyncHandler(userController.create));
userRouter.get('/:id', validate({ params: idParamsSchema }), asyncHandler(userController.getById));
userRouter.patch(
  '/:id',
  validate({ params: idParamsSchema, body: updateUserSchema }),
  asyncHandler(userController.update),
);
userRouter.delete('/:id', authorize('admin'), validate({ params: idParamsSchema }), asyncHandler(userController.remove));

const resourceRouter = Router();
resourceRouter.use(authenticate);
resourceRouter.get('/', validate({ query: listResourcesQuerySchema }), asyncHandler(resourceController.list));
resourceRouter.post('/', validate({ body: createResourceSchema }), asyncHandler(resourceController.create));
resourceRouter.get('/:id', validate({ params: idParamsSchema }), asyncHandler(resourceController.getById));
resourceRouter.patch(
  '/:id',
  validate({ params: idParamsSchema, body: updateResourceSchema }),
  asyncHandler(resourceController.update),
);
resourceRouter.delete('/:id', validate({ params: idParamsSchema }), asyncHandler(resourceController.remove));

const auditRouter = Router();
auditRouter.get(
  '/',
  authenticate,
  authorize('admin'),
  validate({ query: listAuditQuerySchema }),
  asyncHandler(auditController.list),
);

const healthRouter = Router();
healthRouter.get('/', asyncHandler(healthController.check));
healthRouter.get('/live', healthController.live);

export const apiRouter = Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/resources', resourceRouter);
apiRouter.use('/audit', auditRouter);
apiRouter.use('/health', healthRouter);
