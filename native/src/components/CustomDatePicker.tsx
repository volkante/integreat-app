import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { CalendarEventsIcon } from '../assets'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const DateContainer = styled.View`
  width: fit-content;
  position: relative;
`
const Input = styled.TextInput`
  padding: 8px;
`
const StyledInputWrapper = styled.View`
  min-width: 316px;
  height: 56px;
  padding: 0 16px;
  border-radius: 8px;
  border-color: ${props => props.theme.colors.themeColorLight};
  border-width: 3px;
  border-style: solid;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const StyledIconButton = styled(IconButton)<{ $isModalOpen: boolean }>`
  transform: scale(2);
  width: 20px;
  height: 20px;
  background-color: ${props => (props.$isModalOpen ? props.theme.colors.themeColorLight : '#e9e8e9')};
`
const StyledTitle = styled.Text`
  background-color: ${props => props.theme.colors.backgroundColor};
  position: absolute;
  top: -12px;
  left: ${props => (props.theme.contentDirection === 'rtl' ? 'auto' : '10px')};
  right: ${props => (props.theme.contentDirection === 'rtl' ? '12px' : 'auto')};
  padding: 2px 5px;
  font-size: 12px;
  font-weight: 400;
  z-index: 1;
`
const StyledError = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.invalidInput};
`
type CustomDatePickerProps = {
  title: string
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  error?: string
  modalState: boolean
  setModalState: React.Dispatch<React.SetStateAction<boolean>>
}
const safeDate = (value: string, dateformat: 0 | 1) => {
  try {
    if (dateformat) {
      return DateTime.fromFormat(value, 'dd/MM/yyyy').toFormat('yyyy-MM-dd')
    }
    return DateTime.fromISO(value).toFormat('dd/MM/yyyy')
  } catch (e) {
    return value
  }
}
const CustomDatePicker = ({
  title,
  value,
  setValue,
  error,
  modalState,
  setModalState,
}: CustomDatePickerProps): ReactElement => (
  <DateContainer>
    <StyledTitle>{title}</StyledTitle>
    <StyledInputWrapper>
      <Input
        testID='DatePicker-input'
        keyboardType='numeric'
        onChangeText={event => setValue(safeDate(event, 1))}
        value={safeDate(value, 0)}
      />
      <StyledIconButton
        $isModalOpen={modalState}
        icon={<Icon Icon={CalendarEventsIcon} />}
        accessibilityLabel='calenderEventsIcon'
        onPress={() => {
          setModalState(true)
        }}
      />
    </StyledInputWrapper>
    {!!error && <StyledError>{error}</StyledError>}
  </DateContainer>
)

export default CustomDatePicker
