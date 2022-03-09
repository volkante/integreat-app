import moment from 'moment'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ShelterModel } from 'api-client'

import accessibleIcon from '../assets/shelter/accessible.svg'
import bathroomIcon from '../assets/shelter/bathroom.svg'
import bedIcon from '../assets/shelter/bed.svg'
import calendarIcon from '../assets/shelter/calendar.svg'
import houseIcon from '../assets/shelter/house.svg'
import lgbtqiIcon from '../assets/shelter/lgbtqi.svg'
import petIcon from '../assets/shelter/pet.svg'
import timerIcon from '../assets/shelter/timer.svg'
import { uppercaseFirstLetter } from '../utils/stringUtils'
import Caption from './Caption'
import ShelterInformationSection from './ShelterInformationSection'
import Tooltip from './Tooltip'

const Container = styled.article`
  flex: 1;
  margin: 12px;
  padding: 16px;
  background-color: #f8f8f8;
  flex-direction: column;
`

const Detail = styled.span`
  padding: 0 10px;
  flex-direction: row;
  width: 220px;
`

type IconWithTooltipProps = {
  tooltip: string
  icon: string
}

const IconWithTooltip = ({ tooltip, icon }: IconWithTooltipProps): ReactElement => (
  <Tooltip text={tooltip} flow='right'>
    <img alt={tooltip} src={icon} />
  </Tooltip>
)

type Props = {
  shelter: ShelterModel
  extended?: boolean
}

const ShelterInformation = ({ shelter, extended = false }: Props): ReactElement => {
  const { beds, city, id, accommodationType, period, startDate, info, rooms, occupants, name } = shelter
  const { zipcode, hostType, languages, email, phone } = shelter
  const free = true
  const { t } = useTranslation('shelter')

  const quarter = shelter.quarter && shelter.quarter !== 'andere' ? uppercaseFirstLetter(shelter.quarter) : null
  const location = quarter ?? city
  const bedsText = beds === 1 ? t('bed') : t('beds', { beds })
  const titleText = t('shelterTitle', { beds: bedsText, location })
  const titleHint = `#(${id})`
  const startDateText = moment(startDate, 'DD.MM.YYYY').isSameOrBefore(moment.now())
    ? t('now')
    : `${t('starting')} ${startDate}`

  const petsAllowed = info.some(it => ['haustier-katze', 'haustier-hund', 'haustier'].includes(it))

  return (
    <>
      {extended && <Caption title={`${titleText} (#${id})`} />}
      <Container>
        <ShelterInformationSection
          extended={extended}
          title={extended ? t('shelterInformation') : titleText}
          titleHint={extended ? undefined : titleHint}
          label={free ? t('free') : undefined}
          information={[
            { text: t(accommodationType), icon: houseIcon },
            { text: bedsText, icon: bedIcon },
            { text: startDateText, icon: calendarIcon },
            { text: t(period), icon: timerIcon }
          ]}>
          <Detail>
            {info.includes('bad') && <IconWithTooltip tooltip={t('bathroom')} icon={bathroomIcon} />}
            {info.includes('lgbtiq') && <IconWithTooltip tooltip={t('lgbtiq')} icon={lgbtqiIcon} />}
            {info.includes('barrierefrei') && <IconWithTooltip tooltip={t('accessible')} icon={accessibleIcon} />}
            {petsAllowed && <IconWithTooltip tooltip={t('petsAllowed')} icon={petIcon} />}
          </Detail>
        </ShelterInformationSection>
        {extended && (
          <>
            <ShelterInformationSection
              extended={extended}
              title={t('additionalInformation')}
              separationLine
              information={[
                { text: t('rooms'), rightText: rooms?.toString() ?? t('notSpecified') },
                { text: t('occupants'), rightText: occupants?.toString() ?? t('notSpecified') }
              ]}
            />
            <ShelterInformationSection
              extended={extended}
              title={t('hostInformation')}
              separationLine
              information={[
                { text: t('name'), rightText: name },
                { text: t('zipcode'), rightText: zipcode },
                { text: t('city'), rightText: city },
                ...(quarter ? [{ text: t('quarter'), rightText: occupants?.toString() ?? t('notSpecified') }] : []),
                { text: t('hostType'), rightText: hostType ? t(hostType) : t('notSpecified') },
                { text: t('languages'), rightText: languages.map(it => t(it)).join(', ') }
              ]}
            />
          </>
        )}
      </Container>
    </>
  )
}

export default ShelterInformation
