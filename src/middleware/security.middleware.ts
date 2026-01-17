import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Hardened Security Headers using Helmet
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'trusted-scripts.com'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.s3.amazonaws.com"], // Only allow S3 buckets
      connectSrc: ["'self'", "https://api.creator-asset-ai.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'same-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
});

/**
 * Rate Limiting to prevent brute-force and DoS on IP-heavy endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

/**
 * IP Access Logger - Specifically for IP Protection Audit Trail
 */
export const auditIpAccess = (req: Request, res: Response, next: NextFunction) => {
  const assetId = req.params.id;
  if (assetId) {
    console.info(`[AUDIT] IP_ACCESS: User ${req.user?.id} requested Asset ${assetId} at ${new Date().toISOString()} from IP ${req.ip}`);
  }
  next();
};