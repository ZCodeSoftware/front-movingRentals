import { useState, useEffect } from 'react'
import { NextUIProvider, DateRangePicker } from '@nextui-org/react'
import { getLocalTimeZone, now, ZonedDateTime, parseZonedDateTime, Duration } from '@internationalized/date'
import { useTranslation } from 'react-i18next'
import { IDatePickerSectionProps } from '../models/date-picker-props'
import { ISelectItems } from '../models/Select-data'

const DatePickerSection: React.FC<IDatePickerSectionProps> = ({
  selectData,
  setIsSubmitDisable,
  vehicle
}) => {
  const { t, i18n } = useTranslation()

  const existingVehicleDateItem = selectData.selectedItems.find(
    (item: ISelectItems) => item.vehicle._id === vehicle._id
  )
  const [selectedDates, setSelectedDates] = useState<{ start: ZonedDateTime; end: ZonedDateTime }>({
    start: existingVehicleDateItem ? existingVehicleDateItem.dates.start : now(getLocalTimeZone()).add({ days: 1 }),
    end: existingVehicleDateItem
      ? existingVehicleDateItem.dates.end
      : now(getLocalTimeZone()).add({ days: 1, hours: 4 })
  })

  useEffect(() => {
    const currentDate = now(getLocalTimeZone())

    if (!existingVehicleDateItem) {
      if (currentDate.hour > 20) {
        const start = currentDate.add({ days: 1 })
        const end = currentDate.add({ days: 2, hours: 4 })

        setSelectedDates({
          start,
          end
        })
      }
    }
  }, [existingVehicleDateItem])

  const calculateDateDifference = (start: ZonedDateTime, end: ZonedDateTime) => {
    console.log('start:', start);
    console.log('end:', end);

    if (!(start instanceof ZonedDateTime) || !(end instanceof ZonedDateTime)) {
      throw new Error('start y end deben ser instancias de ZonedDateTime')
    }

    const duration = end.subtract(start)
    const totalHours = duration.total('hours')
    const day = Math.floor(totalHours / 24)
    const hour = totalHours % 24

    return { day, hour }
  }

  useEffect(() => {
    if (selectedDates.start && selectedDates.end) {
      try {
        const { day, hour } = calculateDateDifference(selectedDates.start, selectedDates.end)
        console.log(`Diferencia: ${day} días y ${hour} horas`)

        let cost = 0
        const totalHours = day * 24 + hour

        if (totalHours <= 4) {
          cost = vehicle.pricePer4
        } else if (totalHours <= 8) {
          cost = vehicle.pricePer8
        } else {
          cost = vehicle.pricePer24
        }

        console.log('Costo total:', cost)
      } catch (error) {
        console.error(error.message)
      }
    }
  }, [selectedDates, vehicle])

  return (
    <div className='flex'>
      <NextUIProvider locale={i18n.language}>
        <DateRangePicker
          hourCycle={24}
          className='w-full'
          classNames={{
            inputWrapper: 'bg-[#D4EDFF] hover:bg-[#D4EDFF] hover:focus-within:bg-[#D4EDFF]'
          }}
          hideTimeZone
          onChange={(e: any) => {
            const start = parseZonedDateTime(e.start.toString())
            const end = parseZonedDateTime(e.end.toString())
            setSelectedDates({ start, end })
          }}
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
          defaultValue={selectedDates}
          label={t('HomeRental.date_picker.title')}
          calendarProps={{ className: 'uppercase' }}
        />
      </NextUIProvider>     
    </div>
  )
}

export default DatePickerSection