import graphQLClient from 'graphql-request';
import { API_URL, API_TOKEN } from '../../config';

const graphQLApi = new graphQLClient.GraphQLClient(API_URL, {
  credentials: 'include',
  mode: 'cors',
  headers: {
    authorization: API_TOKEN,
  },
});

export const updateChatMutation = `
mutation updateChat($id: Float!, $input: ChatUpdateInput!) {
  updateChat(id: $id, input: $input) {
    title
    description
    members_count
  }
}
`;

export const notUpdatedChatsQuery = `
query notUpdatedChats($days: Int!, $limit: Int!) {
  notUpdatedChats(days: $days, limit: $limit) {
    id
    photo {
      big_file_id
    }
  }
}
`;

export const createPreviousStatistics = `
mutation createPreviousStatistics($id: Float!, $date: Date!) {
  createPreviousStatistics(id: $id, date: $date)
}
`;

export const createDailyStatistics = `
mutation createDailyStatistics($id: Float!, $date: Date!) {
  createDailyStatistics(chat: $id, date: $date)
}
`;

export default graphQLApi;
