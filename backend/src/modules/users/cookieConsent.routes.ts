import express from 'express';
import CookieConsent from './cookieConsent.model';
import { CURRENT_POLICY_VERSION } from '../../config/security';
import { Types } from 'mongoose';
import { requireAuth, optionalAuth, AuthRequest } from '../../middlewares/auth.middleware';

const router = express.Router();

// Input validation helper
function validateConsentInput(body: any) {
  if (typeof body.consentGiven !== 'boolean') return false;
  if (!body.consentCategories || typeof body.consentCategories.necessary !== 'boolean') return false;
  if (typeof body.consentCategories.analytics !== 'boolean') return false;
  if (typeof body.consentCategories.marketing !== 'boolean') return false;
  return true;
}

// POST /api/cookie-consent
router.post('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    if (!validateConsentInput(req.body)) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    const userId = req.user?.id ? new Types.ObjectId(req.user.id) : undefined;
    const consent = new CookieConsent({
      userId,
      consentGiven: req.body.consentGiven,
      consentCategories: req.body.consentCategories,
      policyVersion: CURRENT_POLICY_VERSION,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    await consent.save();
    return res.json({ success: true, consent });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err });
  }
});

// GET /api/cookie-consent
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    let filter: any = { };
    if (req.user?.id) {
      filter.userId = req.user.id;
    } else {
      filter.ipAddress = req.ip;
    }
    const consent = await CookieConsent.findOne(filter).sort({ createdAt: -1 });
    return res.json({ success: true, consent });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err });
  }
});

// PUT /api/cookie-consent
router.put('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    if (!validateConsentInput(req.body)) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    const userId = req.user?.id ? new Types.ObjectId(req.user.id) : undefined;
    const consent = new CookieConsent({
      userId,
      consentGiven: req.body.consentGiven,
      consentCategories: req.body.consentCategories,
      policyVersion: CURRENT_POLICY_VERSION,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    await consent.save(); // Audit trail: new record
    return res.json({ success: true, consent });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err });
  }
});

export default router;
