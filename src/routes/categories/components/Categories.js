// @flow

import * as React from 'react'

import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import Page from 'modules/common/components/Page'

import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from './CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import CityModel from '../../../modules/endpoint/models/CityModel'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import type { ThemeType } from 'modules/theme/constants/theme'
import { URL_PREFIX } from '../../../modules/platform/constants/webview'

type PropsType = {|
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  path: string,
  city: string,
  onTilePress: (tile: TileModel) => void,
  onItemPress: (item: { id: number, title: string, thumbnail: string, path: string }) => void,
  language: string,
  fileCache: { [url: string]: string },
  theme: ThemeType
|}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
export class Categories extends React.Component<PropsType> {
  getTileModels (categories: Array<CategoryModel>): Array<TileModel> {
    return categories.map(category => {
      let cachedThumbnail = this.props.fileCache[category.thumbnail]
      if (cachedThumbnail) {
        cachedThumbnail = URL_PREFIX + cachedThumbnail
      }

      return new TileModel({
        id: String(category.id),
        title: category.title,
        path: category.path,
        thumbnail: cachedThumbnail || category.thumbnail,
        isExternalUrl: false
      })
    })
  }

  getListModel (category: CategoryModel): { id: number, title: string, thumbnail: string, path: string } {
    let cachedThumbnail = this.props.fileCache[category.thumbnail]
    if (cachedThumbnail) {
      cachedThumbnail = URL_PREFIX + cachedThumbnail
    }

    return {
      id: category.id,
      title: category.title,
      path: category.path,
      thumbnail: cachedThumbnail || category.thumbnail
    }
  }

  getListModels (categories: Array<CategoryModel>): Array<{ id: number, title: string, thumbnail: string, path: string }> {
    return categories.map(category => this.getListModel(category))
  }

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @param category The current category
   * @return {*} The content to be displayed
   */
  getContent (category: CategoryModel): React.Node {
    const {categories, cities} = this.props
    const children = categories.getChildren(category)

    if (category.isLeaf(categories)) {
      // last level, our category is a simple page
      return <React.Fragment>
        <Page title={category.title}
              content={category.content}
              theme={this.props.theme}
              files={this.props.fileCache} />
      </React.Fragment>
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories
      return <Tiles tiles={this.getTileModels(children)}
                    title={CityModel.findCityName(cities, category.title)}
                    onTilePress={this.props.onTilePress} />
    }
    // some level between, we want to display a list
    return <CategoryList
      categories={children.map((model: CategoryModel) => ({model: this.getListModel(model), subCategories: this.getListModels(categories.getChildren(model))}))}
      title={category.title}
      content={category.content}
      onItemPress={this.props.onItemPress}
      theme={this.props.theme} />
  }

  render () {
    const {categories, path, city, language} = this.props
    const categoryModel = categories.findCategoryByPath(path)

    if (categoryModel) {
      return this.getContent(categoryModel)
    } else {
      const error = new ContentNotFoundError({type: 'category', id: this.props.path, city: city, language})
      return <FailureSwitcher error={error} />
    }
  }
}

export default Categories
