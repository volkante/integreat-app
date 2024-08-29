import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon } from '../assets'
import dimensions from '../constants/dimensions'
import DatePicker from './DatePicker'
import FilterToggle from './FilterToggle'
import Button from './base/Button'
import Icon from './base/Icon'

const DateSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 0 5px 15px;
  justify-content: center;

  @media ${dimensions.smallViewport} {
    flex-direction: column;
    align-items: center;
  }
`
const StyledButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: bold;
  padding: 5px;
`
type ResetFilterTextProps = {
  fromDate: DateTime | null
  toDate: DateTime | null
  defaultFromDate: DateTime | null
  defaultToDate: DateTime | null
  t: TFunction<'events', undefined>
}

const ResetFilterText = ({ fromDate, toDate, defaultFromDate, defaultToDate, t }: ResetFilterTextProps) => {
  const title = `${t('resetFilter')} ${fromDate?.toFormat('dd/MM/yy') ?? defaultFromDate?.toFormat('dd/MM/yy')} - ${toDate?.toFormat('dd/MM/yy') ?? defaultToDate?.toFormat('dd/MM/yy')}`
  return <span>{title}</span>
}
type EventsDateFilterProps = {
  fromDate: DateTime | null
  setFromDate: (fromDate: DateTime | null) => void
  fromDateError: string | null
  toDate: DateTime | null
  setToDate: (toDate: DateTime | null) => void
  toDateError: string | null
}
const EventsDateFilter = ({
  fromDate,
  setFromDate,
  fromDateError,
  toDate,
  setToDate,
  toDateError,
}: EventsDateFilterProps): JSX.Element => {
  const defaultFromDate = DateTime.local().startOf('day')
  const defaultToDate = DateTime.local().plus({ day: 10 }).startOf('day')
  const [toggleDateFilter, setToggleDateFilter] = useState(true)
  const isReset = fromDate?.startOf('day').equals(defaultFromDate) && toDate?.startOf('day').equals(defaultToDate)
  const { t } = useTranslation('events')
  return (
    <>
      <DateSection>
        <FilterToggle toggle={toggleDateFilter} setToggleDateFilter={setToggleDateFilter} t={t} />
        {toggleDateFilter && (
          <>
            <DatePicker title={t('from')} value={fromDate} setValue={setFromDate} error={fromDateError || ''} />
            <DatePicker title={t('to')} value={toDate} setValue={setToDate} error={toDateError || ''} />
          </>
        )}
      </DateSection>
      {!isReset && toggleDateFilter && (
        <StyledButton
          label='resetDate'
          onClick={() => {
            setFromDate(defaultFromDate)
            setToDate(defaultToDate)
          }}>
          <Icon src={CloseIcon} />
          <ResetFilterText
            defaultFromDate={defaultFromDate}
            defaultToDate={defaultToDate}
            fromDate={fromDate}
            toDate={toDate}
            t={t}
          />
        </StyledButton>
      )}
    </>
  )
}
export default EventsDateFilter
