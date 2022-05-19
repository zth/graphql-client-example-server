import { createServer } from '@graphql-yoga/node';
import relayDeferPlugin from 'envelop-plugin-relay-defer';

import { schema } from './schema';
import { setupSubscriptionFeed } from './subscriptionFeed';
// @ts-ignore
import pkgJson from '../package.json';

let server = createServer({
  schema,
  port: parseInt(process.env.PORT || '4000'),
  plugins: [relayDeferPlugin()]
});

server.start().then(() => {
  console.log(
    `Running "graphql-client-example-server" version ${pkgJson.version}.`
  );
  setupSubscriptionFeed();
});
