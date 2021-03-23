// @flow

import { connect } from 'react-redux'
import { type StackHeaderProps } from '@react-navigation/stack'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import Header, { type PropsType as HeaderPropsType } from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { StateType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import {
  CityModel,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  OFFERS_ROUTE,
  DISCLAIMER_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  NEWS_ROUTE
} from 'api-client'
import isPeekingRoute from '../../endpoint/selectors/isPeekingRoute'
import { urlFromRouteInformation } from '../../navigation/url'
import type { RouteInformationType } from 'api-client'

type OwnPropsType = {|
  ...StackHeaderProps,
  t: TFunction
|}

type StatePropsType = {|
  language: string,
  goToLanguageChange?: () => void,
  peeking: boolean,
  categoriesAvailable: boolean,
  routeCityModel?: CityModel,
  shareUrl: ?string
|}

type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.scene.route.key
  const cityCode = ownProps.scene.route.params?.cityCode || state.cityContent?.city

  const route = state.cityContent?.routeMapping[routeKey]

  const simpleRoutes = [OFFERS_ROUTE, DISCLAIMER_ROUTE, SPRUNGBRETT_OFFER_ROUTE]
  const routeName = ownProps.scene.route.name
  const simpleRouteShareUrl =
    typeof cityCode === 'string' && simpleRoutes.includes(routeName)
      ? // $FlowFixMe Flow does not understand life and just hates the whole world :/
        urlFromRouteInformation({ cityCode, languageCode: state.contentLanguage, route: routeName })
      : null

  const languages = state.cityContent?.languages

  // prevent re-rendering when city is there.
  const cities = state.cities.models || []
  const categoriesAvailable = state.cityContent?.searchRoute !== null

  const routeCityModel = route ? cities.find(city => city.code === route.city) : undefined

  if (
    !route ||
    route.status !== 'ready' ||
    state.cities.status !== 'ready' ||
    !state.cityContent ||
    !languages ||
    languages.status !== 'ready' ||
    !cityCode
  ) {
    // Route does not exist yet. In this case it is not really defined whether we are peek or not because
    // we do not yet know the city of the route.
    return {
      language: state.contentLanguage,
      routeCityModel,
      peeking: false,
      categoriesAvailable: false,
      shareUrl: simpleRouteShareUrl
    }
  }

  const goToLanguageChange = () => {
    ownProps.navigation.navigate({
      name: CHANGE_LANGUAGE_MODAL_ROUTE,
      params: {
        currentLanguage: route.language,
        languages: languages.models,
        cityCode,
        availableLanguages: Array.from(route.allAvailableLanguages.keys()),
        previousKey: routeKey
      }
    })
  }

  const peeking = isPeekingRoute(state, { routeCity: route.city })
  const { routeType, language, city } = route

  const routeInformation: RouteInformationType =
    routeType === NEWS_ROUTE
      ? // $FlowFixMe Flow does not get anything and hates the whole world :/ I am already checking the routeType!
        { route: NEWS_ROUTE, languageCode: language, cityCode: city, newsType: route.type, newsId: route.newsId }
      : // $FlowFixMe Flow does not understand life and just hates the whole world :/
        { route: routeType, languageCode: language, cityCode: city, cityContentPath: route.path || undefined }

  const shareUrl = urlFromRouteInformation(routeInformation)

  return { peeking, routeCityModel, language, goToLanguageChange, categoriesAvailable, shareUrl }
}

export default withTranslation<OwnPropsType>('layout')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(withTheme<HeaderPropsType>(Header))
)
