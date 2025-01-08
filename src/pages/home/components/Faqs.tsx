import { Accordion, AccordionItem } from "@nextui-org/react";
import minusIcon from '../../../assets/SVG/minus.svg'
import plusIcon from '../../../assets/SVG/plus-sign.svg'
import { faqsEsContent } from "../../../mocks/FaqsEs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { faqsEnContent } from "../../../mocks/FaqsEn";

const Faqs = () => {
    const [faqs, setFaqs] = useState<any[]>([]);
    const {i18n, t} = useTranslation()
    useEffect (() => {      
        if (i18n.language === 'es-ES' || i18n.language === 'es') {
            setFaqs(faqsEsContent)
        }
        if (i18n.language === 'en' || i18n.language === 'en-US') {
            setFaqs(faqsEnContent)}
    },[i18n.language])

 return (
    <div className="mt-32 md:mt-0 p-4">
      <h3 className="p-4">{t('faqs.title')}</h3> 
    <Accordion className='md:w-[40%]' isCompact variant="splitted">
      {faqs.map((category, index) => (
        <AccordionItem isCompact key={index} aria-label={category.category} title={category.category} indicator={({ isOpen }) => (
            isOpen ? <img src={minusIcon} alt="Expand Icon" /> : <img src={plusIcon} alt="Collapse Icon"/>
          )}>
          <Accordion isCompact variant="splitted">
            {category.questions.map((faq:any, qIndex:number) => (
              <AccordionItem isCompact className='whitespace-pre-line' key={qIndex} aria-label={faq.question} title={faq.question}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionItem>
      ))}
    </Accordion>
    <p className="p-4">{t('faqs.contact')}</p>
    </div>
  );
};

export default Faqs;