import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const { status: _, ...errObj } = err
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errObj)
}