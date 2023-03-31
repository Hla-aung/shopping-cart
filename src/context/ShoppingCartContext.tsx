import { ReactNode, createContext, useContext, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import useLocaleStorage from "../hooks/useLocaleStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type ShoppingCartContext = {
    openCart: () => void;
    closeCart: () => void;
    cartQty: number;
    cartItems: CartItem[];
    getItemQuantity: (id:number) => number;
    increaseCartQuantity: (id:number) => void;
    decreaseCartQuantity: (id:number) => void;
    removeFromCart: (id:number) => void;
}

type CartItem = {
    id: number;
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({children}: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useLocaleStorage<CartItem[]>("shopping-cart", []);
    const [isOpen, setIsOpen] = useState(false)

    const cartQty = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const openCart = () => setIsOpen(true)

    const closeCart = () => setIsOpen(false)

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id: number) {
        setCartItems(curItems => {
            if (curItems.find(item =>  item.id === id) == null) {
                return [...curItems, {id, quantity: 1}]
            } else {
                return curItems.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number) {
        setCartItems(curItems => {
            if (curItems.find(item =>  item.id === id)?.quantity ==+ 1) {
                return curItems.filter(item => item.id !== id)
            } else {
                return curItems.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(curItems => {
            return curItems.filter(item => item.id !== id)
        })
    }



    return (
        <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity,
        removeFromCart, cartQty, openCart, closeCart, cartItems}}>
            {children}
            <ShoppingCart isOpen ={isOpen}/>
        </ShoppingCartContext.Provider>
    )
}