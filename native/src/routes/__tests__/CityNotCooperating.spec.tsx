import { render, fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { lightTheme } from 'build-configs/integreat/theme'

import wrapWithTheme from '../../testing/wrapWithTheme'
import CityNotCooperating from '../CityNotCooperating'

jest.mock('react-i18next')
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  useTheme: () => lightTheme
}))

describe('CityNotCooperating', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const renderCityNotCooperating = (): RenderAPI => render(<CityNotCooperating />, { wrapper: wrapWithTheme })

  it('should render correctly', () => {
    const { getByText, queryByText } = renderCityNotCooperating()
    expect(getByText('callToAction')).toBeDefined()
    expect(getByText('explanation')).toBeDefined()
    expect(getByText('whatToDo')).toBeDefined()
    expect(getByText('findOutMail')).toBeDefined()
    expect(getByText('sendText')).toBeDefined()
    expect(getByText('copyText')).toBeDefined()
    expect(queryByText('textCopied')).toBeNull()
  })

  it('should change button text on button click', () => {
    const { getByText, queryByText } = renderCityNotCooperating()
    expect(queryByText('textCopied')).toBeNull()
    const button = getByText('copyText')
    fireEvent.press(button)
    expect(getByText('textCopied')).toBeDefined()
    expect(queryByText('copyText')).toBeNull()
  })
})
