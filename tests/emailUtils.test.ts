import { validateEmail } from '../src/utils/email';
import { expect } from '@jest/globals';

describe('Email Utils', () => {
  describe('#validateEmail', () => {
    it('should return true for a valid email', () => {
      const email = 'test@example.com';
      const result = validateEmail(email);
      expect(result).toBe(true);
    });

    it('should return false for an email without "@" symbol', () => {
      const email = 'testexample.com';
      const result = validateEmail(email);
      expect(result).toBe(false);
    });

    it('should return false for an email without domain', () => {
      const email = 'test@';
      const result = validateEmail(email);
      expect(result).toBe(false);
    });

    it('should return false for an email without username', () => {
      const email = '@example.com';
      const result = validateEmail(email);
      expect(result).toBe(false);
    });

    it('should return false for an email with spaces', () => {
      const email = 'test @example.com';
      const result = validateEmail(email);
      expect(result).toBe(false);
    });

    it('should return false for an email with multiple "@" symbols', () => {
      const email = 'test@@example.com';
      const result = validateEmail(email);
      expect(result).toBe(false);
    });

    it('should return false for an email with invalid characters', () => {
      const email = 'test@exa!mple.com';
      const result = validateEmail(email);
      expect(result).toBe(false);
    });
  });
});