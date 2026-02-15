import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validate = (schema: z.ZodTypeAny, source: 'body' | 'params' | 'query') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const t = (req as Request & { t?: (key: string, options?: { defaultValue?: string }) => string }).t;
      return res.status(400).json({
        success: false,
        message: t ? t('errors.validationFailed') : 'Validation failed',
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    req[source] = result.data;
    return next();
  };
