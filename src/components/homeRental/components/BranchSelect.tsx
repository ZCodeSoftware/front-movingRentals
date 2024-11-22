import React from 'react'
import { Select, SelectItem } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { IBranchSelectProps } from '../models/branch-select-props'

const BranchSelector: React.FC<IBranchSelectProps> = ({ branch, onBranchChange }) => {
  const { t } = useTranslation()

  return (
    <Select
      value={branch}
      className='min-w-44'
      label={t('HomeRental.branch')}
      onChange={e => onBranchChange(e.target.value)}
    >
      <SelectItem hideSelectedIcon key='centro' value='Centro'>
        Centro
      </SelectItem>
      <SelectItem hideSelectedIcon key='las_veletas' value='Las Veletas'>
        Las Veletas
      </SelectItem>
    </Select>
  )
}

export default BranchSelector
