import Queue from 'bee-queue';
import processChat from '../jobs/processChat';
import processChatStatistics from '../jobs/processChatStatistics';

export const chatsQueue = new Queue('chats', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

export const chatsStatisticsQueue = new Queue('chatsStatistics', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

chatsQueue.process(2, processChat);
chatsStatisticsQueue.process(2, processChatStatistics);
