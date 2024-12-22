import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service';
import CryptoJS from 'crypto-js';
import { AppApiGateWay } from '../../services/app.api.gateway';
import { Spinner } from '@nextui-org/react';
import { getLocalStorage } from '../../utils/local-storage/getLocalStorage';
import { removeLocalStorage } from '../../utils/local-storage/removeLocalStorage';

const SuccessPaymentComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const successPayment = searchParams.get('successPayment') === 'true';
    const token = searchParams.get('token');
    const [counter, setCounter] = useState(3);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

    const fetchUserAndCart = async () => {
        try {
            const userResponse = await fetchUserDetail();
            setUserData(userResponse);
        } catch (error: any) {
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const response = await AppApiGateWay.get('/cat-payment-method');
            setPaymentMethods(response.data);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const createBooking = async () => {
        try {
            if (!userData || !userData.cart) {
                console.error('User data or cart is null');
                return;
            }

            const decryptedToken = CryptoJS.AES.decrypt(token!, 'secret-key').toString(CryptoJS.enc.Utf8);
            const storedToken = getLocalStorage('paymentToken');

            if (decryptedToken && storedToken === token) {
                const paymentMethod = paymentMethods.find(method => method.name === 'MercadoPago');
                if (!paymentMethod) {
                    console.error('Payment method not found');
                    return;
                }

                const bookingData = {
                    cart: userData.cart,
                    paymentMethod: paymentMethod.id
                };

                await AppApiGateWay.post('/bookings', bookingData);
                removeLocalStorage('paymentToken');
            } else {
                console.error('Token verification failed');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    useEffect(() => {
        fetchUserAndCart();
        fetchPaymentMethods();

        if (successPayment && token) {
            createBooking();
        }

        const timer = setInterval(() => {
            setCounter((prevCounter) => prevCounter - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [successPayment, token]);

    useEffect(() => {
        if (counter === 0) {
            navigate('/');
        }
    }, [counter, navigate]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
            {successPayment ? (
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <FaCheckCircle className="text-green-500 text-6xl mb-4" />
                    <h1 className="text-2xl font-bold mb-2">{t('payment.successMessage')}</h1>
                    <p className="text-gray-600">{t('payment.redirectMessage')}</p>
                    <p className="text-gray-600">{t('payment.redirectCountdown', { seconds: counter })}</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <FaTimesCircle className="text-red-500 text-6xl mb-4" />
                    <h1 className="text-2xl font-bold mb-2">{t('payment.errorMessage')}</h1>
                    <p className="text-gray-600">{t('payment.redirectMessage')}</p>
                    <p className="text-gray-600">{t('payment.redirectCountdown', { seconds: counter })}</p>
                </div>
            )}
        </div>
    );
};

export default SuccessPaymentComponent;