import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

/**
 * Preview API controller:
 * In accordance with Phase 1 instructions, these endpoints honestly return schema contracts
 * and status indicators without pretending live OAuth connections exist.
 */
export function getArchitectureContract(req: Request, res: Response) {
  return sendSuccess(res, {
    version: '1.0.0',
    roadmap: [
      { step: '01_CONNECT', status: 'ready_for_oauth_integration', channels: ['Meta Graph API', 'Google Ads API'] },
      { step: '02_UNDERSTAND', status: 'pattern_detection_engine', model: 'genie-growth-v1' },
      { step: '03_DISCOVER', status: 'content_dna_clustering' },
      { step: '04_ACT', status: 'growth_decision_matrix' },
    ],
  });
}
