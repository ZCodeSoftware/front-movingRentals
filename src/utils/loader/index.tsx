import './LoaderComponent.css'; // Asegúrate de importar el archivo CSS

const LoaderComponent = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#D4EDFF] bg-opacity-10 backdrop-blur-sm z-50">
            <div className="loader"></div>
        </div>
    );
};

export default LoaderComponent;