// components/Layout.tsx
import React from 'react';
import NavbarComponent from '../components/navbar';
import Footer from '../components/footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarComponent />
            <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;