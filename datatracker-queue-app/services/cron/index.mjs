import cron from 'cron';
import * as R from 'ramda';
import { chatsQueue, chatsStatisticsQueue } from '../bee';
import api, { notUpdatedChatsQuery } from '../api';

const { CronJob } = cron;

export const updateChats = async () => {
  const { notUpdatedChats } = await api.request(notUpdatedChatsQuery, { days: 1, limit: 1 });

  R.forEach(chat => {
    const job = chatsQueue.createJob(chat);
    const onDone = afterUpdateChat.bind(null, chat);

    job
      .timeout(3000)
      .retries(3)
      .save();

    job.on('succeeded', onDone);
    job.on('failed', onDone);
  }, notUpdatedChats);
};

const afterUpdateChat = (chat) => {
  const job = chatsStatisticsQueue.createJob(chat);

  job
    .timeout(3000)
    .retries(3)
    .save();

  updateChats();
};

new CronJob('0 0 0 * * *', updateChats, null, true, 'UTC');
