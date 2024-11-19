import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

interface RentalEvent {
    date: string;
    title: string;
    description: string;
}

const rentalSteps: RentalEvent[] = [
    {
        date: '01 Ene, 2024',
        title: 'Renta Realizada',
        description: 'El cliente realizó el proceso de renta y recogió el vehículo. Se registraron los datos y se generó el contrato.',
    },
    {
        date: '03 Ene, 2024',
        title: 'Perdió el Casco',
        description: 'El cliente notificó la pérdida del casco. Se generó un cobro adicional por el equipo perdido.',
    },
    {
        date: '05 Ene, 2024',
        title: 'Choque',
        description: 'El vehículo sufrió un accidente leve. Se activó el seguro y se documentaron los daños.',
    },
    {
        date: '06 Ene, 2024',
        title: 'Devolución y Lavado',
        description: 'El cliente devolvió el vehículo en condiciones limpias. Se realizó la inspección final y se cerró el contrato.',
    },
];

export default function RentalProcess() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOpen = () => {
        onOpen();
    };

    return (
        <>
            <Button onPress={handleOpen}>Abrir Proceso de Renta</Button>
            <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 bg-black text-white">
                                Proceso de Renta
                            </ModalHeader>
                            <ModalBody className="bg-black text-white overflow-y-auto max-h-[70vh] scroll-container">
                                <div className="container mx-auto w-full h-full">
                                    <div className="relative wrap overflow-hidden p-10 h-full">
                                        <div
                                            className="absolute h-full"
                                            style={{
                                                right: '50%',
                                                border: '2px solid #42ec97',
                                                borderRadius: '1%',
                                            }}
                                        ></div>
                                        <div
                                            className="absolute h-full"
                                            style={{
                                                left: '50%',
                                                border: '2px solid #42ec97',
                                                borderRadius: '1%',
                                            }}
                                        ></div>

                                        {rentalSteps.map((step, index) => (
                                            <div
                                                key={index}
                                                className={`mb-8 flex justify-between ${index % 2 === 0
                                                    ? 'flex-row-reverse left-timeline'
                                                    : 'right-timeline'
                                                    } items-center w-full`}
                                            >
                                                <div className="order-1 w-5/12"></div>
                                                <div
                                                    className={`order-1 w-5/12 px-1 py-4 ${index % 2 === 0 ? 'text-right' : 'text-left'
                                                        }`}
                                                >
                                                    <p className="mb-3 text-base" style={{ color: '#42ec97' }}>
                                                        {step.date}
                                                    </p>
                                                    <h4 className="mb-3 font-bold text-lg md:text-2xl">{step.title}</h4>
                                                    <p className="text-sm md:text-base leading-snug text-gray-50 text-opacity-100">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <img
                                        className="mx-auto -mt-36 md:-mt-36"
                                        src="https://user-images.githubusercontent.com/54521023/116968861-ef21a000-acd2-11eb-95ac-a34b5b490265.png"
                                        alt="Decoración"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter className="bg-black text-white">
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
