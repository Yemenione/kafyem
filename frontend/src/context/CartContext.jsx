import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, variant = null) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item =>
                item.id === product.id &&
                item.variant?.id === variant?.id
            );

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prevItems, {
                    ...product,
                    quantity,
                    variant
                }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, variantId = null) => {
        setCartItems(prevItems =>
            prevItems.filter(item =>
                !(item.id === productId && item.variant?.id === variantId)
            )
        );
    };

    const updateQuantity = (productId, variantId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                (item.id === productId && item.variant?.id === variantId)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.variant ? item.variant.price : item.price;
            return total + (Number(price) * item.quantity);
        }, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isCartOpen,
        setIsCartOpen
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
