import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export function getHealth(req: Request, res: Response) {
  return sendSuccess(res, {
    status: 'operational',
    service: 'GenieAds Backend API',
    phase: 'LANDING_PAGE_STAGE',
    timestamp: new Date().toISOString(),
    supportedChannels: ['Instagram', 'Facebook', 'Meta Ads', 'Google Ads', 'Website', 'Leads'],
  });
}
