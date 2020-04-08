import express from 'express';
import arena from './services/arena';

const app = express();

app.use('/', arena);

export default app;
