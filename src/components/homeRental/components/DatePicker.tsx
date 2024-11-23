import { NextUIProvider, DateRangePicker } from '@nextui-org/react'
import { getLocalTimeZone, now } from '@internationalized/date'
import { useTranslation } from 'react-i18next'
import { IDatePickerSectionProps } from '../models/date-picker-props'

const DatePickerSection: React.FC<IDatePickerSectionProps> = ({ selectData, setSelectData, setIsSubmitDisable }) => {
  const { t, i18n } = useTranslation()

  return (
    <div className='flex'>
      <NextUIProvider locale={i18n.language}>
        <DateRangePicker
          hourCycle={24}
          className='w-full'
          hideTimeZone
          onChange={e =>
            setSelectData((prev: any) => ({
              ...prev,
              dates: {
                start: e.start,
                end: e.end
              }
            }))
          }
          validate={(value: any) => {
            if (value.start.day === value.end.day) {
              const hoursDiff = value.end.hour - value.start.hour
              if (hoursDiff < 4) {
                setIsSubmitDisable(true)
                return t('HomeRental.date_picker.min_hours_valid')
              } else {
                setIsSubmitDisable(false)
              }
            }
            if (value.start.day < now(getLocalTimeZone()).day || value.end.day < now(getLocalTimeZone()).day) {
              setIsSubmitDisable(true)
              return t('HomeRental.date_picker.previous_day_valid')
            } else {
              setIsSubmitDisable(false)
            }
            return true
          }}
          defaultValue={selectData.dates}
          label={t('HomeRental.date_picker.title')}
          calendarProps={{ className: 'uppercase' }}
        />
      </NextUIProvider>
    </div>
  )
}

export default DatePickerSection
