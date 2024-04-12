import { v4 } from 'uuid';

export function uuid(): string {
  return v4();
}

export function generateFileName(ext: string): string {
  return uuid() + '.' + ext;
}

export function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generatePassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = lowercase.toUpperCase();
  const numbers = '0123456789';

  let text = '';

  for (let i = 0; i < 4; i++) {
    text += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    text += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    text += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return text;
}

/**
 * generate random string
 * @param length
 */
export function generateRandomString(length: number): string {
  return Math.random()
    .toString(36)
    .replaceAll(/[^\dA-Za-z]+/g, '')
    .slice(0, Math.max(0, length));
}
