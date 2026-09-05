import { Router } from 'express';
import { submitEarlyAccess, getEarlyAccessStats } from '../controllers/earlyAccessController';
import { getHealth } from '../controllers/healthController';
import { getArchitectureContract } from '../controllers/previewController';
import { fetchMetaProfile } from '../controllers/metaController';
import { 
  getAdminMetrics, 
  getAdminUsers, 
  getCustomSubmissions, 
  submitCustomForm, 
  updateSubmissionStatus, 
  getAdminPayments, 
  recordPaymentTransaction, 
  syncUserAccount, 
  updatePaymentSettlementStatus 
} from '../controllers/adminController';

export const apiRouter = Router();

// Health & Status
apiRouter.get('/health', getHealth);
apiRouter.get('/architecture', getArchitectureContract);

// Early Access Lead Registration
apiRouter.post('/early-access', submitEarlyAccess);
apiRouter.get('/early-access/stats', getEarlyAccessStats);

// Real Meta Graph API Profile & Followers Integration
apiRouter.post('/meta/fetch-profile', fetchMetaProfile);

// Admin Control Center Routes (Real Live Telemetry, Users, Subscriptions, Payments & Custom Form Submissions)
apiRouter.get('/admin/metrics', getAdminMetrics);
apiRouter.get('/admin/users', getAdminUsers);
apiRouter.post('/admin/users/sync', syncUserAccount);

apiRouter.get('/admin/submissions', getCustomSubmissions);
apiRouter.post('/admin/submissions', submitCustomForm);
apiRouter.post('/custom-form', submitCustomForm);
apiRouter.patch('/admin/submissions/:id/status', updateSubmissionStatus);

apiRouter.get('/admin/payments', getAdminPayments);
apiRouter.post('/admin/payments/record', recordPaymentTransaction);
apiRouter.patch('/admin/payments/:id/settlement', updatePaymentSettlementStatus);

// Future API Stubs (returns clean structured status)
apiRouter.get('/integrations/status', (req, res) => {
  res.json({
    status: 'coming_soon',
    message: 'Integrations will be enabled in Phase 2 for Meta Ads, Instagram & Google Ads.',
  });
});
