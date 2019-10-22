import { ApolloServer } from "apollo-server";

import { schema } from "./schema";
import { setupSubscriptionFeed } from "./subscriptionFeed";

let server = new ApolloServer({ schema });

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
  setupSubscriptionFeed();
});
