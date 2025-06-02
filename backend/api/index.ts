import app from '../dist/index.js';
import serverlessExpress from '@vendia/serverless-express';

export const handler = serverlessExpress({ app });
export default handler;
