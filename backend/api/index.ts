import { app } from '../src/index.js';
import { configure } from '@vendia/serverless-express';

const handler = configure({ app });

export default handler;