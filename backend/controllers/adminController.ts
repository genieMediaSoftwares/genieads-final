import { Request, Response } from 'express';
import { adminService } from '../services/adminService';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export async function getAdminMetrics(req: Request, res: Response) {
  try {
    const metrics = adminService.getMetrics();
    return sendSuccess(res, metrics, 'Admin metrics retrieved successfully');
  } catch (err: unknown) {
    logger.error('Error fetching admin metrics', err);
    return sendError(res, 'Failed to fetch admin metrics', 500);
  }
}

export async function getAdminUsers(req: Request, res: Response) {
  try {
    const users = adminService.getUsers();
    return sendSuccess(res, users, 'Users retrieved successfully');
  } catch (err: unknown) {
    logger.error('Error fetching users', err);
    return sendError(res, 'Failed to fetch users', 500);
  }
}

export async function getCustomSubmissions(req: Request, res: Response) {
  try {
    const submissions = adminService.getSubmissions();
    return sendSuccess(res, submissions, 'Custom submissions retrieved successfully');
  } catch (err: unknown) {
    logger.error('Error fetching custom submissions', err);
    return sendError(res, 'Failed to fetch submissions', 500);
  }
}

export async function submitCustomForm(req: Request, res: Response) {
  try {
    const { name, workEmail, phone, companyBrand, websiteUrl, monthlyAdSpend, businessCategory, planInterest, notes } = req.body;
    if (!name || !workEmail || !phone || !companyBrand) {
      return sendError(res, 'Name, work email, phone, and company brand are required.', 400);
    }
    const submission = adminService.addSubmission({
      name,
      workEmail,
      phone,
      companyBrand,
      websiteUrl,
      monthlyAdSpend,
      businessCategory,
      planInterest,
      notes,
    });
    return sendSuccess(res, submission, 'Custom plan inquiry submitted successfully', 201);
  } catch (err: unknown) {
    logger.error('Error submitting custom form', err);
    return sendError(res, 'Failed to submit custom form', 500);
  }
}

export async function updateSubmissionStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = adminService.updateSubmissionStatus(id, status);
    if (!updated) {
      return sendError(res, 'Submission not found', 404);
    }
    return sendSuccess(res, updated, 'Status updated');
  } catch (err: unknown) {
    logger.error('Error updating submission status', err);
    return sendError(res, 'Failed to update status', 500);
  }
}

export async function getAdminPayments(req: Request, res: Response) {
  try {
    const payments = adminService.getPayments();
    return sendSuccess(res, payments, 'Payment ledger retrieved successfully');
  } catch (err: unknown) {
    logger.error('Error fetching payments', err);
    return sendError(res, 'Failed to fetch payments', 500);
  }
}

export async function recordPaymentTransaction(req: Request, res: Response) {
  try {
    const payment = adminService.addPayment(req.body);
    return sendSuccess(res, payment, 'Payment recorded successfully', 201);
  } catch (err: unknown) {
    logger.error('Error recording payment', err);
    return sendError(res, 'Failed to record payment', 500);
  }
}

export async function syncUserAccount(req: Request, res: Response) {
  try {
    if (Array.isArray(req.body)) {
      const synced = req.body.map((u) => adminService.syncRegisteredUser(u));
      return sendSuccess(res, synced, 'Batch users synced successfully');
    }
    const user = adminService.syncRegisteredUser(req.body);
    return sendSuccess(res, user, 'User synced successfully');
  } catch (err: unknown) {
    logger.error('Error syncing user', err);
    return sendError(res, 'Failed to sync user', 500);
  }
}

export async function updatePaymentSettlementStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = adminService.updatePaymentSettlement(id, status);
    if (!updated) {
      return sendError(res, 'Payment transaction not found', 404);
    }
    return sendSuccess(res, updated, 'Settlement status updated');
  } catch (err: unknown) {
    logger.error('Error updating settlement status', err);
    return sendError(res, 'Failed to update settlement status', 500);
  }
}
