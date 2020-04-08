import api, { createPreviousStatistics } from '../services/api';

const processChatStatistics = async (job) => {
  try {
    const { data } = job;
    await api.request(createPreviousStatistics, { id: data.id, date: new Date() });
    Promise.resolve(job.id);
  } catch (err) {
    return Promise.reject(err);
  }
};

export default processChatStatistics;
