import { createServer } from '@graphql-yoga/node';
import relayDeferPlugin from 'envelop-plugin-relay-defer';

import { schema } from './schema';
import { setupSubscriptionFeed } from './subscriptionFeed';

let server = createServer({
  schema,
  port: parseInt(process.env.PORT || '4000'),
  plugins: [relayDeferPlugin()]
});

server.start().then(() => {
  setupSubscriptionFeed();
});
