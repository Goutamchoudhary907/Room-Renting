import app from '../src/index';
import serverlessExpress from '@vendia/serverless-express';

export const handler = serverlessExpress({ app });
export default handler;
