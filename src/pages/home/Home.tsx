import { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/categories/categoriesService';
import { ICategories } from '../../services/categories/models/categories.interface';
import { useTranslation } from 'react-i18next';
import ImageSlider from '../../components/imageSlider/ImageSlider';
import { images } from '../../mocks/imageSliderHome';
import RentalSearch from '../../components/rentalSearch/RentalSearch';
import HomeCards from './components/HomeCards';
import { motion } from 'framer-motion';

const Home = () => {
  const [data, setData] = useState<ICategories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      const result = await fetchCategories();
      setData(result);
      setLoading(false);
    };

    getData();
  }, []);

  const vehicles = data.filter(v => v._id != '6');
  const tours = data.filter(t => t._id === '6');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className='w-full'>
      <div
        className='absolute top-0 left-0 w-full h-96 object-cover bg-top'
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className='block md:sticky top-16 z-20'>
        <RentalSearch categoriesData={data} />
      </div>
      <motion.section
        className='flex flex-col md:items-center md:mt-24'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='p-6'>
          <h1 className='text-xl mb-2'>Vehicles</h1>
          <div className='flex w-full mx-auto overflow-x-auto'>
            <div className='flex space-x-4 md:space-x-6 w-max'>
              <HomeCards items={vehicles} />
            </div>
          </div>
        </div>
      </motion.section>
      <motion.section
        className='flex flex-col items-center'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className='p-6'>
          <h1 className='text-xl mb-2'>Tours</h1>
          <div className='flex space-x-4 md:space-x-6 w-max'>
            <HomeCards items={tours} />
          </div>
        </div>
      </motion.section>
      <motion.section
        className='flex justify-center flex-wrap p-6'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className='flex flex-col md:flex-row items-center justify-evenly w-full'>
          <div className='p-2'>
            <h1>{t('homePage.home')}</h1>
            <p>{t('homePage.home')}</p>
          </div>
          <div className='p-2'>
            <h1>{t('homePage.home')}</h1>
            <p>{t('homePage.home')}</p>
          </div>
          <div className='p-2'>
            <h1>{t('homePage.home')}</h1>
            <p>{t('homePage.home')}</p>
          </div>
        </div>
      </motion.section>
      <motion.section
        className='flex justify-center p-2 w-full h-auto'
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ImageSlider images={images} autoplay={false} />
      </motion.section>
    </main>
  );
};

export default Home;