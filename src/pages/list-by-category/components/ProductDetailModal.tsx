import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { HOME_CARDS_CONSTANTS } from '../../home/constants/home.constants'
import VehicleDetailComponent from './VehicleDetailComponent'
import TourDetailComponent from './TourDetailComponent'

const ProductDetailModal = ({ product, setOpenModal }: any) => {
  return (
    <Modal
      isOpen={!!product}
      onClose={() => setOpenModal(false)}
      size='5xl'
      placement='center'
      scrollBehavior='inside'
      className={`${
        product.hasOwnProperty(HOME_CARDS_CONSTANTS.ITINERARY) ? 'md:w-2/4' : 'md:w-2/6'
      } h-auto absolute z-50`}
    >
      <ModalContent>
        <ModalBody>
          {product.hasOwnProperty(HOME_CARDS_CONSTANTS.ITINERARY) ? (
            <TourDetailComponent product={product} setOpenModal={setOpenModal} />
          ) : (
            <VehicleDetailComponent product={product} setOpenModal={setOpenModal} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ProductDetailModal
