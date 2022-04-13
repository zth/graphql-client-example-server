import { createServer } from '@graphql-yoga/node';

import { schema } from './schema';
import { setupSubscriptionFeed } from './subscriptionFeed';

let server = createServer({
  schema,
  port: parseInt(process.env.PORT || '4000')
});

server.start().then(() => {
  setupSubscriptionFeed();
});
