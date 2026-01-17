# Security Protocols for Intellectual Property Protection

## 1. Data Encryption Strategy
*   **At Rest:** All assets in S3 are encrypted using AWS KMS with Customer Managed Keys (CMK). Database volumes (RDS) use AES-256 encryption.
*   **In Transit:** Mandatory TLS 1.3 for all API communication. Internal microservice communication uses mTLS.
*   **Field-Level:** Sensitive metadata (client names, project descriptions) is encrypted at the application layer before reaching the database.

## 2. Access Control (Zero Trust)
*   **Pre-Signed URLs:** Files are never served via public URLs. The backend generates short-lived (5-15 min) HMAC-signed URLs for viewing/downloading.
*   **RBAC & Scopes:** Access is governed by granular permissions. A "View" permission does not grant "Download" rights for high-resolution source files.
*   **Identity Provider:** Integration with OIDC/OAuth2 with mandatory MFA for all creator accounts.

## 3. Infrastructure Hardening
*   **WAF (Web Application Firewall):** Protection against SQLi, XSS, and automated scrapers trying to harvest IP.
*   **VPC Isolation:** Processing workers (CLIP/YOLO) run in private subnets without direct internet access.

## 4. Audit & Compliance
*   **IP Access Logs:** Every request to view or download a high-res asset is logged with user ID, timestamp, and IP address.
*   **Automated Scanning:** Snyk/Dependabot for dependency vulnerabilities and TruffleHog for secret detection in code.