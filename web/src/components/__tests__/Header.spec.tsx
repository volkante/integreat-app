import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithRouter } from '../../testing/render'
import { Header } from '../Header'
import HeaderActionItemLink from '../HeaderActionItemLink'
import HeaderNavigationItem from '../HeaderNavigationItem'
import KebabActionItemLink from '../KebabActionItemLink'

describe('Header', () => {
  it('should render KebabMenu with elements on small viewport', () => {
    const { getByTestId } = renderWithRouter(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Locaction' iconSrc='icon.jpg' />
        ]}
        viewportSmall
        direction='ltr'
      />,
      { wrapWithTheme: true }
    )
    expect(getByTestId('kebab-menu-checkbox')).toBeInTheDocument()
    fireEvent.click(getByTestId('kebab-menu-checkbox'))
    expect(getByTestId('kebab-action-item')).toHaveProperty('href', 'http://localhost/kebab_route')
  })
  it('should not render KebabMenu on large viewport', () => {
    const { queryByTestId } = renderWithRouter(
      <Header
        logoHref='/random_route'
        actionItems={[<HeaderActionItemLink key={0} href='/random_route' text='random route' iconSrc='/icon.jpg' />]}
        navigationItems={[<HeaderNavigationItem key={0} href='/another_route' text='text1' icon='icon.jpg' active />]}
        kebabItems={[
          <KebabActionItemLink key='location' href='/kebab_route' text='Change Locaction' iconSrc='icon.jpg' />
        ]}
        viewportSmall={false}
        direction='ltr'
      />,
      { wrapWithTheme: true }
    )
    expect(queryByTestId('kebab-menu-checkbox')).not.toBeInTheDocument()
  })
})
