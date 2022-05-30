import { createServer } from '@graphql-yoga/node';
import relayDeferPlugin from 'envelop-plugin-relay-defer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { schema } from './schema';
import { setupSubscriptionFeed } from './subscriptionFeed';
// @ts-ignore
import pkgJson from '../package.json';

async function start() {
  const yogaApp = createServer({
    schema,
    port: parseInt(process.env.PORT || '4000'),
    plugins: [relayDeferPlugin()]
  });

  const httpServer = await yogaApp.start();
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: yogaApp.getAddressInfo().endpoint
  });

  useServer(
    {
      execute: (args: any) => args.rootValue.execute(args),
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yogaApp.getEnveloped(ctx);
        const args = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe
          }
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      }
    },
    wsServer
  );

  setupSubscriptionFeed();
  console.log(
    `Running "graphql-client-example-server" version ${pkgJson.version}.`
  );
}

start().catch(e => {
  console.error(e);
  process.exit(1);
});
