import { useState, useEffect } from 'react'
import { NextUIProvider, DateRangePicker, Button } from '@nextui-org/react'
import { getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date'
import { useTranslation } from 'react-i18next'
import { IDatePickerSectionProps } from '../models/date-picker-props'
import { ISelectData, ISelectItems } from '../models/Select-data'

const DatePickerSection: React.FC<IDatePickerSectionProps> = ({
  selectData,
  setSelectData,
  setIsSubmitDisable,
  vehicle
}) => {
  const { t, i18n } = useTranslation()

  const [selectedDates, setSelectedDates] = useState<{ start: ZonedDateTime; end: ZonedDateTime }>({
    start: now(getLocalTimeZone()),
    end: now(getLocalTimeZone()).add({ hours: 4 })
  })

  const isVehicleAlreadySelected = selectData.selectedItem.some(
    (item: ISelectItems) => item.vehicle._id === vehicle._id
  )

  useEffect(() => {
    const currentDate = now(getLocalTimeZone())

    if (currentDate.hour > 20) {
      const start = currentDate.add({ days: 1 })
      const end = currentDate.add({days: 1, hours: 4 })

      setSelectedDates({
        start,
        end
      })
    }
  }, [])

  const handleSave = () => {
    if (selectedDates.start && selectedDates.end) {
      setSelectData((prev: ISelectData) => {
        const existingItemIndex = prev.selectedItem.findIndex(item => item.vehicle._id === vehicle._id)

        const newItem = {
          dates: { start: selectedDates.start, end: selectedDates.end },
          vehicle: vehicle
        }

        if (existingItemIndex > -1) {
          const updatedSelectedItem = [...prev.selectedItem]
          updatedSelectedItem[existingItemIndex] = newItem
          return {
            ...prev,
            selectedItem: updatedSelectedItem
          }
        }

        return {
          ...prev,
          selectedItem: [...prev.selectedItem, newItem]
        }
      })
    }
  }

  const handleRemove = () => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      selectedItem: prev.selectedItem.filter(item => item.vehicle._id !== vehicle._id)
    }))
  }

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
          onChange={(e: any) =>
            setSelectedDates({
              start: e.start,
              end: e.end
            })
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
          defaultValue={selectedDates}
          label={t('HomeRental.date_picker.title')}
          calendarProps={{ className: 'uppercase' }}
        />
      </NextUIProvider>
      {!isVehicleAlreadySelected ? (
        <Button className='h-full ml-2' onPress={handleSave}>
          Agregar
        </Button>
      ) : (
        <Button className='h-full ml-2' color='danger' variant='flat' onPress={handleRemove}>
          Eliminar
        </Button>
      )}
    </div>
  )
}

export default DatePickerSection
