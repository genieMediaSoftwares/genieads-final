import { Request, Response } from 'express';
import { EarlyAccessService } from '../services/earlyAccessService';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export async function submitEarlyAccess(req: Request, res: Response) {
  try {
    const { name, workEmail, companyBrand, url, interest } = req.body;
    const submission = await EarlyAccessService.register({
      name,
      workEmail,
      companyBrand,
      url,
      interest,
    });

    return sendSuccess(
      res,
      { id: submission.id, email: submission.workEmail },
      "You're on the list. We'll be in touch soon.",
      201
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process early access request.';
    logger.error('Error submitting early access', err);
    return sendError(res, message, 400);
  }
}

export async function getEarlyAccessStats(req: Request, res: Response) {
  try {
    const count = await EarlyAccessService.listCount();
    return sendSuccess(res, { waitlistCount: count });
  } catch (err: unknown) {
    logger.error('Error getting stats', err);
    return sendError(res, 'Failed to fetch waitlist statistics', 500);
  }
}
