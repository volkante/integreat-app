import { DateTime } from 'luxon'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'react-native'
import { Calendar } from 'react-native-calendars'
import styled, { useTheme } from 'styled-components/native'

import { getMarkedDates } from '../utils/calendarRangeUtils'
import Caption from './Caption'
import TextButton from './base/TextButton'

const DatePickerWrapper = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  border-radius: 20px;
  position: absolute;
  width: 90%;
  top: 228px;
  align-self: center;
`
const StyledView = styled.View`
  gap: 8px;
  flex-direction: ${props => (props.theme.contentDirection === 'ltr' ? 'row' : 'row-reverse')};
  justify-content: flex-start;
  padding: 5px 10px;
`
const StyledTextButton = styled(TextButton)`
  background-color: transparent;
  transform: scale(0.8);
`
const StyledPressable = styled.Pressable`
  flex: 1;
`

export type CalendarViewerProps = {
  modalVisible: boolean
  closeModal: () => void
  fromDate: DateTime | null
  toDate: DateTime | null
  setFromDate: (fromDate: DateTime) => void
  setToDate: (toDate: DateTime) => void
}

const CalendarRangeModal = ({
  modalVisible,
  closeModal,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: CalendarViewerProps): ReactElement => {
  const [tempFromDate, setTempFromDate] = useState<DateTime | null>(fromDate)
  const [tempToDate, setTempToDate] = useState<DateTime | null>(toDate)
  const { t } = useTranslation('events')
  const theme = useTheme()

  useEffect(() => {
    setTempFromDate(fromDate)
    setTempToDate(toDate)
  }, [fromDate, toDate])

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = DateTime.fromISO(day.dateString)

    if (!tempFromDate || tempToDate) {
      setTempFromDate(selectedDate)
      setTempToDate(null)
    } else {
      setTempToDate(selectedDate)
    }
  }

  return (
    <Modal style={{ margin: 0 }} animationType='slide' transparent visible={modalVisible} onRequestClose={closeModal}>
      <StyledPressable onPress={closeModal} />
      <DatePickerWrapper>
        <Caption title={t('selectRange')} />
        <Calendar
          markingType='period'
          markedDates={getMarkedDates(tempFromDate, tempToDate, theme)}
          onDayPress={handleDayPress}
          theme={{
            calendarBackground: theme.colors.textDecorationColor,
            dayTextColor: theme.colors.textColor,
            textDisabledColor: theme.colors.textSecondaryColor,
            todayTextColor: theme.colors.backgroundColor,
            textSectionTitleColor: theme.colors.textColor,
            arrowColor: theme.colors.textColor,
          }}
        />
        <StyledView>
          <StyledTextButton
            onPress={() => {
              setTempFromDate(fromDate)
              setTempToDate(toDate)
              closeModal()
            }}
            text={t('layout:cancel')}
            type='clear'
          />
          <StyledTextButton
            onPress={() => {
              if (tempFromDate && tempToDate) {
                setFromDate(tempFromDate)
                setToDate(tempToDate)
              }
              closeModal()
            }}
            text={t('common:ok')}
            type='clear'
          />
        </StyledView>
      </DatePickerWrapper>
    </Modal>
  )
}

export default CalendarRangeModal
