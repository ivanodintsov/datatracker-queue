import Telegram from 'telegraf/telegram';
import { TG_BOT_TOKEN } from '../config';

const telegram = new Telegram(TG_BOT_TOKEN);

export default telegram;
