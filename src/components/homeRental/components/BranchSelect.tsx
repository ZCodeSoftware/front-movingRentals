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
        lat: selectedBranch.address.coords.lat,
        lng: selectedBranch.address.coords.lon
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
        <span className='flex-1 text-center truncate'>{selectedBranchName}</span>
      </div>
      {coordinates && branch && (
        <Button className='h-14 bg-buttonPrimary rounded-xl jumping-text' size='sm' onPress={() => setIsMapModalOpen(true)}>
          <img src={mapIcon} alt={t('HomeRental.map')} />
        </Button>
      )}
      <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} className='md:w-2/4 h-auto absolute z-50'>
        <ModalContent>
          <ModalBody className='flex justify-center items-center mt-8'>
            {coordinates && branch && (
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.001}%2C${coordinates.lat - 0.001
                  }%2C${coordinates.lng + 0.001}%2C${coordinates.lat + 0.001}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng
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
  );
};

export default BranchSelector;