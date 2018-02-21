import React from 'react'
import { mount, shallow } from 'enzyme'
import ScrollingSearchBox from '../ScrollingSearchBox'
import SearchInput from '../SearchInput'
import { animateScroll } from 'react-scroll'

describe('ScrollingSearchBox', () => {
  const MockNode = () => <div />

  test('should render', () => {
    const component = (
      <ScrollingSearchBox filterText={'Test'}
                          onFilterTextChange={() => {}}>
        <MockNode />
      </ScrollingSearchBox>)
    expect(shallow(component)).toMatchSnapshot()
  })

  test('should space search', () => {
    expect(shallow(<ScrollingSearchBox filterText={'Test'}
                                       onFilterTextChange={() => {}}
                                       spaceSearch><MockNode /></ScrollingSearchBox>)).toMatchSnapshot()
  })

  test('should pass onFilterTextChange and call scroll()', () => {
    const outerFilterTextChange = jest.fn()
    const component = mount(
      <ScrollingSearchBox filterText={'Test'}
                          onFilterTextChange={outerFilterTextChange}>
        <MockNode />
      </ScrollingSearchBox>)
    component.instance().scroll = jest.fn()

    component.find(SearchInput).prop('onFilterTextChange')('test')

    expect(outerFilterTextChange).toHaveBeenCalledWith('test')
    expect(component.instance().scroll).toHaveBeenCalled()
  })

  test('should set correct reference', () => {
    const component = mount(
      <ScrollingSearchBox filterText={'Test'} onFilterTextChange={() => {}}>
        <MockNode />
      </ScrollingSearchBox>)
    const node = component.instance()._node
    expect(node).toMatchSnapshot()
  })

  test('shouldnt call scroll() if user is already below searchInput onClick', () => {
    const component = mount(
      <ScrollingSearchBox filterText={'Test'} onFilterTextChange={() => {}}>
        <MockNode />
      </ScrollingSearchBox>)

    component.instance().scroll = jest.fn()
    component.instance()._node = {offsetTop: 15}
    document.documentElement.scrollTop = 15

    component.find(SearchInput).prop('onClickInput')()
    expect(component.instance().scroll).toHaveLength(0)
  })

  test('should call scroll() if user is above searchInput onClick', () => {
    const component = mount(
      <ScrollingSearchBox filterText={'Test'} onFilterTextChange={() => {}}>
        <MockNode />
      </ScrollingSearchBox>)

    component.instance().scroll = jest.fn()
    component.instance()._node = {offsetTop: 15}
    document.documentElement.scrollTop = 0

    component.find(SearchInput).prop('onClickInput')()
    expect(component.instance().scroll).toHaveBeenCalled()
  })

  test('should call animateScroll on scroll()', () => {
    const component = mount(
      <ScrollingSearchBox filterText={'Test'} onFilterTextChange={() => {}}>
        <MockNode />
      </ScrollingSearchBox>)

    component.instance()._node = {offsetTop: 15}
    component.instance().scroll()

    expect(animateScroll.scrollTo).toHaveBeenCalledWith(15, {duration: 500})
  })
})
