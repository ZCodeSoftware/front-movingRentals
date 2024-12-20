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

  const handleSave = () => {
    if (selectedDates.start && selectedDates.end) {
      setSelectData((prev: ISelectData) => {
        const existingItemIndex = prev.selectedItems.findIndex(item => item.vehicle._id === vehicle._id)

        const newItem = {
          dates: { start: selectedDates.start, end: selectedDates.end },
          vehicle: vehicle
        }

        if (existingItemIndex > -1) {
          const updatedSelectedItem = [...prev.selectedItems]
          updatedSelectedItem[existingItemIndex] = newItem
          return {
            ...prev,
            selectedItem: updatedSelectedItem
          }
        }

        return {
          ...prev,
          selectedItems: [...prev.selectedItems, newItem]
        }
      })
    }
  }

  const handleRemove = () => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter(item => item.vehicle._id !== vehicle._id)
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
      {!existingVehicleDateItem ? (
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
