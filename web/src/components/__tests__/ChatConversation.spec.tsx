import { act } from '@testing-library/react'
import React from 'react'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import { renderWithRouterAndTheme } from '../../testing/render'
import ChatConversation from '../ChatConversation'

jest.mock('react-i18next')
jest.mock('react-inlinesvg')

window.HTMLElement.prototype.scrollIntoView = jest.fn()
jest.useFakeTimers()

const render = (messages: ChatMessageModel[], hasError: boolean) =>
  renderWithRouterAndTheme(<ChatConversation messages={messages} hasError={hasError} />)

describe('ChatConversation', () => {
  const testMessages: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      body: '<b>Meine Frage lautet</b>, warum bei Integreat eigentlich alles gelb ist. <a rel="noopener" class="link-external" target="_blank" href="https://www.google.com" >Weitere Infos</a>',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 2,
      body: 'Willkommen in der Integreat Chat Testumgebung auf Deutsch. Unser Team antwortet werktags, während unser Chatbot zusammenfassende Antworten aus verlinkten Artikeln liefert, die Sie zur Überprüfung wichtiger Informationen lesen sollten.',
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 3,
      body: 'Informationen zu Ihrer Frage finden Sie auf folgenden Seiten:',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 4,
      body: 'Wie kann ich mein Deutsch verbessern?',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
  ]
  const testMessages2: ChatMessageModel[] = [
    new ChatMessageModel({
      id: 1,
      body: 'Human Message 1',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 2,
      body: 'Bot Message 1',
      userIsAuthor: false,
      automaticAnswer: true,
    }),
    new ChatMessageModel({
      id: 3,
      body: 'Author Message 1',
      userIsAuthor: true,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 4,
      body: 'Human Message 2',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
    new ChatMessageModel({
      id: 5,
      body: 'Human Message 3',
      userIsAuthor: false,
      automaticAnswer: false,
    }),
  ]

  it('should display welcome text if conversation has not started', () => {
    const { getByText } = render([], false)
    expect(getByText('chat:conversationTitle')).toBeTruthy()
    expect(getByText('chat:conversationText')).toBeTruthy()
  })

  it('should display messages if conversation has started and the initial message', () => {
    const { getByText, getByTestId } = render(testMessages, false)
    expect(getByText('chat:initialMessage')).toBeTruthy()
    expect(getByTestId(testMessages[0]!.id)).toBeTruthy()
    expect(getByTestId(testMessages[2]!.id)).toBeTruthy()
  })

  it('should display typing indicator before the initial automatic answer and after for 60 seconds', () => {
    const { getByText, queryByText, getByTestId } = render(testMessages, false)
    expect(getByTestId(testMessages[0]!.id)).toBeTruthy()
    expect(getByText('...')).toBeTruthy()
    expect(getByTestId(testMessages[1]!.id)).toBeTruthy()
    expect(getByText('chat:humanIcon')).toBeTruthy()
    expect(getByText('...')).toBeTruthy()

    act(() => jest.runAllTimers())
    expect(queryByText('...')).toBeNull()
  })

  it('should display typing indicator after opening the chatbot with existing conversation for unanswered user message', () => {
    const { queryByText, getByTestId } = render(testMessages, false)
    expect(getByTestId(testMessages[3]!.id)).toBeTruthy()
    act(() => jest.runAllTimers())
    expect(queryByText('...')).toBeNull()
  })

  it('should display error messages if error occurs', () => {
    const { getByText } = render([], true)
    expect(getByText('chat:errorMessage')).toBeTruthy()
  })

  it('should display icon after isAutomaticAnswer changes', () => {
    const { getAllByRole } = render(testMessages2, false)

    const icons = getAllByRole('img')
    expect(icons).toHaveLength(4)
    const parents: (HTMLElement | null | undefined)[] = []
    const grandparents: (HTMLElement | null | undefined)[] = []
    icons.forEach((icon, index) => {
      parents[index] = icon.parentElement
      grandparents[index] = icon.parentElement?.parentElement
    })

    expect(icons[0]?.textContent).toMatch(/humanIcon/)
    expect(grandparents[0]).not.toBeNull()
    expect(grandparents[0]?.textContent).toMatch(/Human Message 1/)
    expect(parents[0]).toHaveStyle(`opacity: 1`)

    expect(icons[1]?.textContent).toMatch(/botIcon/)
    expect(grandparents[1]).not.toBeNull()
    expect(grandparents[1]?.textContent).toMatch(/Bot Message 1/)
    expect(parents[1]).toHaveStyle(`opacity: 1`)

    expect(icons[2]?.textContent).toMatch(/humanIcon/)
    expect(grandparents[2]).not.toBeNull()
    expect(grandparents[2]?.textContent).toMatch(/Human Message 2/)
    expect(parents[2]).toHaveStyle(`opacity: 1`)

    expect(icons[3]?.textContent).toMatch(/humanIcon/)
    expect(grandparents[3]).not.toBeNull()
    expect(grandparents[3]?.textContent).toMatch(/Human Message 3/)
    expect(parents[3]).toHaveStyle(`opacity: 0`)
  })
})
