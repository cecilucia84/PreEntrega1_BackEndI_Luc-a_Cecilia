import fs from 'fs/promises';
import path from 'path';

const cartsFilePath = path.resolve("data", "carrito.json");

export default class CartManager {
    constructor() {
        this.carts = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(cartsFilePath, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }

    saveToFile() {
        fs.writeFile(cartsFilePath, JSON.stringify(this.carts, null, 2));
    }

    createCart() {
        const newCart = {
            id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
            products: []
        };
        this.carts.push(newCart);
        this.saveToFile();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, agrégalo con cantidad 1
            cart.products.push({ id: productId, quantity: 1 });
        }

        this.saveToFile();
        return cart;
    }
}
