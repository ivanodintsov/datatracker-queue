import axios from 'axios';
import * as R from 'ramda';
import { imgurConfig } from '../config.mjs';

const imgurApi = axios.create({
  baseURL: 'https://api.imgur.com/3/',
  headers: {
    Authorization: `Client-ID ${imgurConfig.clientId}`
  },
});

export const getResizedUrl = (url, size = 't') => url.replace(/(\.\w+)$/, `${size}$1`);
export const uploadToChatAlbum = async (image) => {
  const response = await imgurApi.post('/image/', {
    album: imgurConfig.albums.chats.deletehash,
    image
  });

  const link = R.path(['data', 'data', 'link'], response);
  return {
    small_file: getResizedUrl(link),
    big_file: link,
  };
};

export default imgurApi;
