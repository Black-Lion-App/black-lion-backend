import './common/env';
import Server from './common/server';
import routes from './routes';
import { connectDB } from './common/database';

connectDB().then(
  () => {
    // Init the seed after the DB connected
    // TODO: Commenting it as it is taking too much memory in build

  },
  () => { }
);

const PORT = 9000;

export default new Server()
  .router(routes)
  .listen(PORT);
