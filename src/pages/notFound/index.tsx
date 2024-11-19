import React from "react";

const NotFoundPage: React.FC = () => {
    return (
        <div className="h-screen w-screen bg-gray-50 flex items-center overflow-hidden">
            <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
                {/* Texto del mensaje */}
                <div className="w-full lg:w-1/2 mx-8 text-center lg:text-left">
                    <h1 className="text-7xl text-green-500 font-extrabold mb-8">404</h1>
                    <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
                        Lo sentimos, no pudimos encontrar la página que estás buscando.
                    </p>
                    <a
                        href="/"
                        className="px-5 inline py-3 text-sm font-medium leading-5 shadow-xl text-white transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-green-600 active:bg-green-700 hover:bg-green-700"
                    >
                        Volver al inicio
                    </a>
                </div>

                {/* Imagen */}
                <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
                    <img
                        src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
                        alt="Página no encontrada"
                        className="max-w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
