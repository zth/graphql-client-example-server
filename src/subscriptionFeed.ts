/**
 * Sets up random updates to the various site statistics, and triggers
 * the appropriate subscriptions.
 */

import { siteStatistics } from './db';
import { pubsub } from './subscriptions';
import { SITE_STATISTICS_UPDATED } from './subscriptionTopics';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

function randomizeVisitorCount() {
  if (Math.random() > 0.25) {
    siteStatistics.currentVisitorsOnline += randomInt(0, 50);
  } else {
    siteStatistics.currentVisitorsOnline -= randomInt(0, 50);
  }

  pubsub.publish(SITE_STATISTICS_UPDATED, {
    siteStatisticsUpdated: siteStatistics
  });
}

function setupSiteStatisticsRandomizer() {
  setTimeout(() => {
    randomizeVisitorCount();
    setupSiteStatisticsRandomizer();
  }, randomInt(5000, 10000));
}

export function setupSubscriptionFeed() {
  setupSiteStatisticsRandomizer();
}
