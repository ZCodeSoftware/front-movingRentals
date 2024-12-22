import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { IBranchSelectProps } from '../models/branch-select-props';
import { fetchAllBranches } from '../../../services/branches/GET/branches.get.service';
import { IBranches } from '../../../services/branches/models/branches.interface';
import mapIcon from '../../../assets/SVG/map-icon.svg';
import { FaMapMarkerAlt } from 'react-icons/fa';

const BranchSelector: React.FC<IBranchSelectProps> = ({ branch, onBranchChange, setLoading }) => {
  const [data, setData] = useState<IBranches[]>([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { t } = useTranslation();

  const getData = async () => {
    setLoading(prev => ({ ...prev, branches: true }));
    const result = await fetchAllBranches();
    setData(result);
    setLoading(prev => ({ ...prev, branches: false }));

    if (result.length === 1) {
      const selectedBranch = result[0];
      setCoordinates({
        lat: 20.19867,
        lng: -87.47218
      });
      onBranchChange(selectedBranch._id);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const selectedBranchName = data.find(b => b._id === branch)?.name || '';

  return (
    <div className='w-full flex flex-row items-center justify-center gap-2'>
      <div className='flex-1 h-14 flex justify-between items-center bg-[#D4EDFF] rounded-full px-4 z-10'>
        <FaMapMarkerAlt className='mr-2' />
        <span className='flex-1 text-center truncate font-semibold'>{selectedBranchName}</span>
      </div>
      {coordinates && branch && (
        <Button className='h-14 bg-buttonPrimary rounded-xl jumping-text' size='sm' onPress={() => setIsMapModalOpen(true)}>
          <img src={mapIcon} alt={t('HomeRental.map')} />
        </Button>
      )}
      <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} className='md:w-3/4 h-auto absolute z-50'>
        <ModalContent>
          <ModalBody className='flex justify-center items-center mt-8'>
            {coordinates && branch && (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.4529888191732!2d-87.4721474!3d20.198488899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4fd7b93dc31b11%3A0x2a117cf83d1748ae!2sMoving%2FLa%20Veleta%20Tulum%20store-Atv%20rental%2C%20Atv%20tours%2C%20Scooter%20rental%20and%20Bikes*21!5e0!3m2!1ses!2sar!4v1734896103773!5m2!1ses!2sar"
                width="100%"
                height="500"
                style={{ border: '1px solid gray', borderRadius: '10px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsMapModalOpen(false)}> {t('HomeRental.close')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BranchSelector;