import { create } from 'zustand';

// Define la interfaz del estado global
interface UsuarioState {
    cartItems: number;
    setCartItems: (cartItems: number) => void;
}

// Crea y exporta el store
const useCartStore = create<UsuarioState>((set) => ({
    cartItems: 0,
    setCartItems: (cartItems) => set({ cartItems: cartItems }),
}));

export default useCartStore;
