import jwt from "jsonwebtoken";
import { getUserById } from "../data-access/users";
import {  Request, Response } from "express";

export const authenticateJWT = async (req: Request, res: Response, next: Function) => {
    const token = req.cookies?.authToken;

    if (!token) {
      req.user = undefined; 
      return next();          
    }
  
    let payload;
    try {
        payload = jwt.verify(token, process.env.TOKEN_SECRET!);
    } catch (error) {
        req.user = undefined;
        return next();
    }

    if (!payload || typeof payload === "string") {
      req.user = undefined;
      return next();
    }

    const user = await getUserById(payload.id);

    if (!user) {
        req.user = undefined;
        return next();
    }

    req.user = user;
    
    next();
};
  