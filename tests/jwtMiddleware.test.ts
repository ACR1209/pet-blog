import { authenticateJWT } from '../src/utils/jwt-middleware';
import jwt from 'jsonwebtoken';
import { getUserById } from '../src/data-access/users';
import { Request, Response } from 'express';
import { expect } from '@jest/globals';

jest.mock('jsonwebtoken');
jest.mock('../src/data-access/users');

describe('authenticateJWT Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      cookies: {}
    };
    res = {};
    next = jest.fn();
  });

  it('should call next and set req.user to undefined if no token is provided', async () => {
    await authenticateJWT(req as Request, res as Response, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should call next and set req.user to undefined if token verification fails', async () => {
    req.cookies = req.cookies || {};
    req.cookies.authToken = 'invalidToken';
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

    await authenticateJWT(req as Request, res as Response, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should call next and set req.user to undefined if payload is a string', async () => {
    req.cookies = req.cookies || {};
    req.cookies.authToken = 'validToken';
    (jwt.verify as jest.Mock).mockReturnValue('stringPayload');

    await authenticateJWT(req as Request, res as Response, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should call next and set req.user to undefined if user is not found', async () => {
    req.cookies = req.cookies || {};
    req.cookies.authToken = 'validToken';
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'userId' });
    (getUserById as jest.Mock).mockResolvedValue(null);

    await authenticateJWT(req as Request, res as Response, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should call next and set req.user if user is found', async () => {
    const user = { id: 'userId', name: 'Test User' };
    req.cookies = req.cookies || {};
    req.cookies.authToken = 'validToken';
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'userId' });
    (getUserById as jest.Mock).mockResolvedValue(user);

    await authenticateJWT(req as Request, res as Response, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});