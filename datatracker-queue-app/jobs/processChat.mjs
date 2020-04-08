import * as R from 'ramda';
import moment from 'moment-timezone';
import Transformer from 'class-transformer';
import telegram from '../services/telegram';
import { uploadToChatAlbum } from '../services/imgur';
import api, { updateChatMutation, createDailyStatistics } from '../services/api';
import { Chat } from '../services/api/requests';
import { assocIsNotNill } from '../helpers/ramda';

const uploadChatPhoto = async (fileId) => {
  try {
    const image = await telegram.getFileLink(fileId);
    return await uploadToChatAlbum(image);
  } catch (err) {
    return;
  }
};

const getChatMembersCount = async (id) => {
  try {
    return await telegram.getChatMembersCount(id);
  } catch (err) {
    return;
  }
};

const updateChangedPhoto = async (oldChat, chat) => {
  const fileIdOld = R.path(['photo', 'big_file_id'], oldChat);
  const fileId = R.path(['photo', 'big_file_id'], chat);
  const photoIds = R.path(['photo'], chat);

  if (fileId && fileId !== fileIdOld) {
    const photos = await uploadChatPhoto(fileId);

    if (photos) {
      return R.merge(photoIds, photos);
    }
  }
};

const processChatPhoto = async (job) => {
  const { data } = job;

  try {
    const [ chatResponse, membersCount ] = await Promise.all([
      telegram.getChat(data.id),
      getChatMembersCount(data.id)
    ]);
    const today = moment().startOf('day').toISOString();
    const update = R.pipe(
      R.pick(['title', 'description']),
      R.assoc('cron_updated_at', today),
      assocIsNotNill('members_count', membersCount),
      assocIsNotNill('photo', await updateChangedPhoto(data, chatResponse)),
    )(chatResponse);

    const chat = Transformer.plainToClass(Chat, update);

    await Promise.all([
      api.request(createDailyStatistics, { id: data.id, date: today }),
      api.request(updateChatMutation, { id: data.id, input: chat }),
    ]);
    
    return Promise.resolve(job.id);
  } catch (err) {
    const update = {
      cron_updated_at: moment().startOf('day').toISOString(),
    };

    if (
      R.anyPass([
        R.pathEq(['response', 'description'], 'Bad Request: chat not found'),
        R.pathEq(['response', 'error_code'], 403),
      ])(err)
    ) {
      update.is_active = false; 
    }

    await api.request(updateChatMutation, { id: data.id, input: update });

    return Promise.reject(err);
  }
};

export default processChatPhoto;
