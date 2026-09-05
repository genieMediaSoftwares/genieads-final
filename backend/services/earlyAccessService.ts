import { EarlyAccessSubmission } from '../models/earlyAccess';
import { logger } from '../utils/logger';
import { adminService } from './adminService';

// In-memory store for early access requests during landing phase
const submissions: EarlyAccessSubmission[] = [];

export class EarlyAccessService {
  public static async register(data: Omit<EarlyAccessSubmission, 'id' | 'createdAt'>): Promise<EarlyAccessSubmission> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Please enter a valid full name (minimum 2 characters).');
    }
    if (!data.workEmail || !emailRegex.test(data.workEmail.trim())) {
      throw new Error('Please provide a valid work email address.');
    }
    if (!data.companyBrand || data.companyBrand.trim().length < 2) {
      throw new Error('Please provide your company or brand name.');
    }

    const validInterests = ['Social Intelligence', 'Growth Intelligence', 'Managed Growth', 'Not sure yet'];
    const interest = validInterests.includes(data.interest) ? data.interest : 'Social Intelligence';

    const newSubmission: EarlyAccessSubmission = {
      id: 'ea_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      name: data.name.trim(),
      workEmail: data.workEmail.trim().toLowerCase(),
      companyBrand: data.companyBrand.trim(),
      url: data.url ? data.url.trim() : undefined,
      interest: interest as EarlyAccessSubmission['interest'],
      createdAt: new Date().toISOString(),
    };

    submissions.push(newSubmission);
    logger.info(`New early access submission registered: ${newSubmission.workEmail} (${newSubmission.companyBrand})`);

    // Sync to admin custom form submissions
    try {
      adminService.addSubmission({
        name: newSubmission.name,
        workEmail: newSubmission.workEmail,
        companyBrand: newSubmission.companyBrand,
        phone: 'Lead from Early Access',
        planInterest: (newSubmission.interest === 'Managed Growth' 
          ? 'Zero → Hero Managed (Custom)' 
          : 'Custom Enterprise') as any,
        monthlyAdSpend: 'Custom',
        businessCategory: 'Early Access',
        websiteUrl: newSubmission.url,
        notes: 'Submitted via landing page early access form',
      });
    } catch (e) {
      logger.warn('Failed to mirror early access to adminService', e);
    }

    return newSubmission;
  }

  public static async listCount(): Promise<number> {
    return submissions.length;
  }
}
