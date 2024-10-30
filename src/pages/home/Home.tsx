import { useState, useEffect } from "react";
import { fetchCategories } from "../../services/categories/dataService";
import { ICategories } from "../../services/categories/models/categories.interface";
import { useTranslation } from 'react-i18next';
import { Card, CardFooter, Image } from "@nextui-org/react";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import { images } from "../../mocks/imageSliderHome";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <section className="flex flex-wrap">
        {data.map(c => (
          <div className="p-2 w-full sm:w-1/2 md:w-1/3" key={c.id}>
            <Card radius="none" className="h-full" isPressable>
              <Image
                alt="Test"
                className=" h-[300px] md:h-[600px] object-cover"
                radius="none"
                src={c.image}
                width="100%"
              />
              <CardFooter className="justify-center before:bg-white/10 bg-gray-400 bg-opacity-30 border-white/80 border-1 overflow-hidden absolute before:rounded-xl bottom-0 w-full shadow-small z-10">
                <p className="text-white/80 font-black">{c.name}</p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </section>
      <section className="flex justify-center flex-wrap p-6">
  <div className="flex flex-col md:flex-row items-center justify-evenly w-full">
    <div className="p-2">
      <h1>{t('home')}</h1>
      <p>{t('home')}</p>
    </div>
    <div className="p-2">
      <h1>{t('home')}</h1>
      <p>{t('home')}</p>
    </div>
    <div className="p-2">
      <h1>{t('home')}</h1>
      <p>{t('home')}</p>
    </div>
  </div>
</section>
<section className="flex justify-center p-2 w-full">
  <ImageSlider images={images}/>
</section>
    </main>
  );
}

export default Home;
