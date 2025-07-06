import { app } from '../src/index.js';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  const expressReq = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query,
    path: req.url,
    originalUrl: req.url
  } as any;

  const expressRes = {
    statusCode: 200,
    status: (code: number) => {
      expressRes.statusCode = code;
      return expressRes;
    },
    json: (data: any) => res.status(expressRes.statusCode).json(data),
    send: (data: any) => res.status(expressRes.statusCode).send(data),
    setHeader: (name: string, value: string) => res.setHeader(name, value)
  } as any;

  return app(expressReq, expressRes);
};