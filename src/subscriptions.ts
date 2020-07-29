import { GraphQLObjectType } from 'graphql';
import { PubSub } from 'apollo-server';
import { siteStatisticsType } from './graphqlTypes';
import { SITE_STATISTICS_UPDATED } from './subscriptionTopics';

export let pubsub = new PubSub();

export let subscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    siteStatisticsUpdated: {
      type: siteStatisticsType,
      subscribe: () => pubsub.asyncIterator(SITE_STATISTICS_UPDATED)
    }
  })
});
