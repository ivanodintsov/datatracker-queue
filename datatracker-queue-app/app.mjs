import server from './server';
import './services/cron';

server.listen(3000, async () => {
  console.log('Started on port 3000');
});
