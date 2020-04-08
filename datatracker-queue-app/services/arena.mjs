import Arena from 'bull-arena';
import express from 'express';

const router = express.Router();

const arena = Arena({
  queues: [
    {
      name: 'chats',
      hostId: 'BeeServer',
      type: 'bee',
      host: process.env.REDIS_HOST,
    },
    {
      name: 'chatsStatistics',
      hostId: 'BeeServer',
      type: 'bee',
      host: process.env.REDIS_HOST,
    },
  ],
},
{
  basePath: '/',
  disableListen: true
});

router.use('/', arena);

export default router;
