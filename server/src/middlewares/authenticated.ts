import { NextFunction, Request, Response } from "express";

export function authenticated(req: Request, res: Response, next: NextFunction) {
    return req.session.userId ? next() : res.sendStatus(401);
}
