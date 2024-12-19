import { useState } from 'react'
import { Select, SelectItem, Skeleton, Button, Modal, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { IBranchSelectProps } from '../models/branch-select-props'
import { fetchAllBranches } from '../../../services/branches/GET/branches.get.service'
import { IBranches } from '../../../services/branches/models/branches.interface'
import mapIcon from '../../../assets/SVG/map-icon.svg'

const BranchSelector: React.FC<IBranchSelectProps> = ({ branch, onBranchChange, loading, setLoading }) => {
  const [data, setData] = useState<IBranches[]>([])
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const { t } = useTranslation()

  const getData = async () => {
    setLoading(prev => ({ ...prev, branches: true }))
    const result = await fetchAllBranches()
    setData(result)
    setLoading(prev => ({ ...prev, branches: false }))
  }

  const handleBranchChange = (branchId: string) => {
    const selectedBranch = data.find(branch => String(branch._id) === branchId)
    if (selectedBranch) {
      setCoordinates({
        lat: selectedBranch.address.coords.lat,
        lng: selectedBranch.address.coords.lon
      })
    }
    onBranchChange(branchId)
  }

  return (
    <div className='w-full flex items-center justify-center'>
      <Select
        value={branch}
        className='min-w-44'
        style={{ backgroundColor: '#D4EDFF', borderRadius: '50' }}
        label={t('HomeRental.branch')}
        onChange={e => handleBranchChange(e.target.value)}
        onOpenChange={async isOpen => {
          if (isOpen) {
            await getData()
          }
        }}
      >
        {loading.branches ? (
          <SelectItem key='skeleton-1' isDisabled>
            <Skeleton className='w-full h-2 rounded-lg mb-2'></Skeleton>
            <Skeleton className='w-[80%] h-2 rounded-lg mb-2'></Skeleton>
            <Skeleton className='w-[60%] h-2 rounded-lg'></Skeleton>
          </SelectItem>
        ) : data?.length > 0 ? (
          data.map(t => <SelectItem key={t._id}>{t.name}</SelectItem>)
        ) : (
          <SelectItem key='no-products' className='text-gray-500 text-center'>
            {t('HomeRental.no_products_available')}
          </SelectItem>
        )}
      </Select>
      {coordinates && branch && (
        <Button className='h-14 ml-2 bg-buttonPrimary rounded-xl' size='sm' onPress={() => setIsMapModalOpen(true)}>
          <img src={mapIcon} alt={t('HomeRental.map')} />
        </Button>
      )}
      <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} className='md:w-2/4 h-auto absolute z-50'>
        <ModalContent>
          <ModalBody className='flex justify-center items-center mt-8'>
            {coordinates && branch && (
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.001}%2C${
                  coordinates.lat - 0.001
                }%2C${coordinates.lng + 0.001}%2C${coordinates.lat + 0.001}&layer=mapnik&marker=${coordinates.lat}%2C${
                  coordinates.lng
                }`}
                width='100%'
                height='400'
                frameBorder='0'
                style={{ border: '1px solid black' }}
                allowFullScreen
                title='OpenStreetMap'
              ></iframe>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsMapModalOpen(false)}> {t('HomeRental.close')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default BranchSelector
