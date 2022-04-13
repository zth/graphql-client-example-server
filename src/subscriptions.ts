import { GraphQLObjectType } from 'graphql';
import { createPubSub } from '@graphql-yoga/node';
import { siteStatisticsType } from './graphqlTypes';
import { SITE_STATISTICS_UPDATED } from './subscriptionTopics';

export let pubsub = createPubSub();

export let subscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    siteStatisticsUpdated: {
      type: siteStatisticsType,
      subscribe: () => pubsub.subscribe(SITE_STATISTICS_UPDATED)
    }
  })
});
