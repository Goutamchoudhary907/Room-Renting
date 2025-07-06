// import { app } from '../src/index.js';
// import { VercelRequest, VercelResponse } from '@vercel/node';

// export default async (req: VercelRequest, res: VercelResponse) => {
//   const expressReq = {
//     method: req.method,
//     url: req.url,
//     originalUrl: req.url,
//     path: req.url,
//     headers: req.headers || {},
//     query: req.query || {},
//     body: req.body || {},
//     get: (name: string) => req.headers[name.toLowerCase()],
//     header: (name: string) => req.headers[name.toLowerCase()],
//   } as any;

//   const expressRes: any = {
//     _headers: {},
//     statusCode: 200,
    
//     status(code: number) {
//       this.statusCode = code;
//       return this;
//     },
    
//     setHeader(name: string, value: string) {
//       this._headers[name.toLowerCase()] = value;
//       res.setHeader(name, value);
//       return this;
//     },
    
//     getHeader(name: string) {
//       return this._headers[name.toLowerCase()];
//     },
    
//     json(data: any) {
//       res.status(this.statusCode).json(data);
//       return this;
//     },
    
//     send(data: any) {
//       res.status(this.statusCode).send(data);
//       return this;
//     },
    
//     end() {
//       res.end();
//       return this;
//     }
//   };

//   try {
//     await app(expressReq, expressRes);
//   } catch (error) {
//     console.error('Request handling failed:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };