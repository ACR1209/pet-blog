import { hashPassword, comparePassword } from '../src/utils/passwords';
import bcrypt from 'bcrypt';
import { expect } from '@jest/globals';

jest.mock('bcrypt');

describe('Password Utilities', () => {
  const password = 'testPassword';
  const hash = 'hashedPassword';

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(hash);

      const result = await hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hash);
    });
  });

  describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});