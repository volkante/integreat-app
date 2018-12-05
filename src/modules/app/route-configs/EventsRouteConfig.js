// @flow

import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import type { AllPayloadsType } from './RouteConfig'
import {
  Payload,
  EventModel,
  citiesEndpoint,
  eventsEndpoint,
  languagesEndpoint
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'

type EventsRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|events: Payload<Array<EventModel>>|}

export const EVENTS_ROUTE = 'EVENTS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const eventsRoute: Route = {
  path: '/:city/:language/events/:eventId?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await Promise.all([
      fetchData(citiesEndpoint, dispatch, state.cities),
      fetchData(eventsEndpoint, dispatch, state.events, {city, language}),
      fetchData(languagesEndpoint, dispatch, state.languages, {city, language})
    ])
  }
}
class EventsRouteConfig implements RouteConfig<EventsRouteParamsType, RequiredPayloadsType> {
  name = EVENTS_ROUTE
  route = eventsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({location, payloads, language}) => {
    const {city, eventId} = location.payload
    const events = payloads.events.data
    if (events && eventId) {
      const event = events.find(_event => _event.path === location.pathname)
      return (event && event.availableLanguages.get(language)) || null
    }
    return this.getRoutePath({city, language})
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({events: payloads.eventsPayload})

  getPageTitle = ({t, payloads, cityName, location}) => {
    const pathname = location.pathname
    const events = payloads.events.data
    const event = events && events.find(event => event.path === pathname)
    return `${event ? event.title : t('pageTitles.events')} - ${cityName}`
  }

  getRoutePath = ({city, language}: EventsRouteParamsType): string => `/${city}/${language}/events`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({payloads, location}) => {
    const events = payloads.events.data
    const event = events && events.find(event => event.id === location.payload.eventId)
    return event ? {id: event.id, title: event.title} : null
  }
}

export default EventsRouteConfig
