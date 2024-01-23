import {
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  CONSENT_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  LOCAL_NEWS_TYPE,
  MAIN_DISCLAIMER_ROUTE,
  MALTE_HELP_FORM_OFFER_ROUTE,
  NEWS_ROUTE,
  NOT_FOUND_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  TU_NEWS_TYPE,
} from 'api-client'

export const LOCAL_NEWS_ROUTE = LOCAL_NEWS_TYPE
export const TU_NEWS_ROUTE = TU_NEWS_TYPE
export const TU_NEWS_DETAIL_ROUTE = `${TU_NEWS_ROUTE}-detail` as const

export const cityContentPattern = `/:cityCode/:languageCode/*`
export const RoutePatterns = {
  [LANDING_ROUTE]: `/${LANDING_ROUTE}/:languageCode`,
  [CITY_NOT_COOPERATING_ROUTE]: `/${CITY_NOT_COOPERATING_ROUTE}/:languageCode`,
  [MAIN_DISCLAIMER_ROUTE]: `/${MAIN_DISCLAIMER_ROUTE}`,
  [JPAL_TRACKING_ROUTE]: `/${JPAL_TRACKING_ROUTE}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}`,
  [LICENSES_ROUTE]: `/${LICENSES_ROUTE}`,
  [CONSENT_ROUTE]: `/${CONSENT_ROUTE}`,

  // City content routes, relative to /:cityCode/:languageCode
  [EVENTS_ROUTE]: EVENTS_ROUTE,
  [MALTE_HELP_FORM_OFFER_ROUTE]: `${OFFERS_ROUTE}/${MALTE_HELP_FORM_OFFER_ROUTE}`,
  [SPRUNGBRETT_OFFER_ROUTE]: `${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}`,
  [OFFERS_ROUTE]: OFFERS_ROUTE,
  [POIS_ROUTE]: POIS_ROUTE,
  [LOCAL_NEWS_ROUTE]: `${NEWS_ROUTE}/${LOCAL_NEWS_ROUTE}`,
  [TU_NEWS_ROUTE]: `${NEWS_ROUTE}/${TU_NEWS_ROUTE}`,
  [TU_NEWS_DETAIL_ROUTE]: `${NEWS_ROUTE}/${TU_NEWS_ROUTE}/:newsId`,
  [SEARCH_ROUTE]: SEARCH_ROUTE,
  [DISCLAIMER_ROUTE]: DISCLAIMER_ROUTE,
  [CATEGORIES_ROUTE]: '*',
} as const

export type RouteType = keyof typeof RoutePatterns
