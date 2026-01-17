import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

/**
 * Application-level encryption for sensitive metadata (Field-Level Encryption)
 * This ensures that even if the DB is compromised, specific IP metadata remains secret.
 */

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'default_secure_key_change_in_production';
const SALT = process.env.ENCRYPTION_SALT || 'creator_asset_salt';

const key = scryptSync(SECRET_KEY, SALT, 32);

export function encryptMetadata(text: string): { encryptedData: string; iv: string; authTag: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag,
  };
}

export function decryptMetadata(encryptedData: string, iv: string, authTag: string): string {
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}