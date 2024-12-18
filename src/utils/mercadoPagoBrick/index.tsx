import React, { useEffect } from 'react';
import { Payment } from '@mercadopago/sdk-react';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    paymentBrickController?: {
      unmount: () => void;
    };
  }
}

const MercadoPagoBrick: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'es-AR';

  const initialization = {
    amount: 10000, // Monto total a pagar
    payer: {
      firstName: "John",
      lastName: "Doe",
      email: "test_user@test.com",
    },
  };

  const customization = {
    paymentMethods: {
      atm: "all",
      ticket: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: ["all"],
    },
  };

  const onSubmit = async ({ formData }: any) => {
    return new Promise((resolve, reject) => {
      fetch("/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(() => {
          resolve(void 0);
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    });
  };

  const onError = async (error: any) => {
    console.log(error);
  };

  const onReady = async () => {
    console.log('Brick is ready');
  };

  useEffect(() => {
    return () => {
      if (window.paymentBrickController) {
        window.paymentBrickController.unmount();
      }
    };
  }, []);

  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={onReady}
      onError={onError}
      locale={locale}
    />
  );
};

export default MercadoPagoBrick;