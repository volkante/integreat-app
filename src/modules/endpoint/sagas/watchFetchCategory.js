// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import DatabaseContext from '../DatabaseContext'

function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const {city, language, path, depth, key, criterion} = action.params
  try {
    const loadCriterion = new ContentLoadCriterion(criterion)
    const allContentLoaded = yield call(loadCityContent, dataContainer, city, language, loadCriterion)

    if (allContentLoaded) {
      const context = new DatabaseContext(city, language)
      const [categoriesMap, resourceCache, languages] = yield all([
        call(dataContainer.getCategoriesMap, context),
        call(dataContainer.getResourceCache, context),
        call(dataContainer.getLanguages, context)
      ])

      const push: PushCategoryActionType = {
        type: `PUSH_CATEGORY`,
        params: {
          categoriesMap,
          resourceCache,
          path,
          languages,
          depth,
          key,
          city,
          language,
          peek: loadCriterion.peek()
        }
      }
      yield put(push)
    }
  } catch (e) {
    console.error(e)
    const failed: FetchCategoryFailedActionType = {
      type: `FETCH_CATEGORY_FAILED`,
      params: {
        message: `Error in fetchCategory: ${e.message}`
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, fetchCategory, dataContainer)
}
