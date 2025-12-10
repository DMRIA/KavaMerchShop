export const Cart = {
    get() {
        const cart = JSON.parse(localStorage.getItem('kava-cart')) || [];
        // Ensure all items have a unique cartItemId for backward compatibility
        let modified = false;
        cart.forEach(item => {
            if (!item.cartItemId) {
                item.cartItemId = item.id + '-' + (item.size || 'default') + '-' + Date.now() + Math.random().toString(36).substr(2, 9);
                modified = true;
            }
        });
        if (modified) {
            localStorage.setItem('kava-cart', JSON.stringify(cart));
        }
        return cart;
    },

    getSaved() {
        return JSON.parse(localStorage.getItem('kava-saved')) || [];
    },

    add(product) {
        const cart = this.get();
        // Check if item with same ID AND Size exists
        const existingItem = cart.find(item => item.id === product.id && item.size === product.size);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
                cartItemId: product.id + '-' + (product.size || 'default') + '-' + Date.now() + Math.random().toString(36).substr(2, 9)
            });
        }

        localStorage.setItem('kava-cart', JSON.stringify(cart));
        this.updateHeader();
    },

    remove(cartItemId) {
        const cart = this.get().filter(item => item.cartItemId !== cartItemId);
        localStorage.setItem('kava-cart', JSON.stringify(cart));
        this.updateHeader();
    },

    saveForLater(cartItemId) {
        const cart = this.get();
        const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

        if (itemIndex > -1) {
            const item = cart[itemIndex];
            cart.splice(itemIndex, 1);

            const saved = this.getSaved();
            // For saved items, we also want to avoid duplicates if possible, or just push.
            // Let's just push for now, or check if same ID+Size exists.
            // If we save, we might want to keep the cartItemId or generate new one?
            // Let's keep it.
            saved.push(item);

            localStorage.setItem('kava-cart', JSON.stringify(cart));
            localStorage.setItem('kava-saved', JSON.stringify(saved));
            this.updateHeader();
        }
    },

    moveToCart(cartItemId) {
        const saved = this.getSaved();
        const itemIndex = saved.findIndex(item => item.cartItemId === cartItemId);

        if (itemIndex > -1) {
            const item = saved[itemIndex];
            saved.splice(itemIndex, 1);

            // Add to cart logic
            const cart = this.get();
            const existingCartItem = cart.find(c => c.id === item.id && c.size === item.size);

            if (existingCartItem) {
                existingCartItem.quantity += item.quantity;
            } else {
                cart.push(item);
            }

            localStorage.setItem('kava-saved', JSON.stringify(saved));
            localStorage.setItem('kava-cart', JSON.stringify(cart));
            this.updateHeader();
        }
    },

    removeSaved(cartItemId) {
        const saved = this.getSaved().filter(item => item.cartItemId !== cartItemId);
        localStorage.setItem('kava-saved', JSON.stringify(saved));
    },

    updateQuantity(cartItemId, quantity) {
        const cart = this.get();
        const item = cart.find(item => item.cartItemId === cartItemId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.remove(cartItemId);
                return;
            }
        }
        localStorage.setItem('kava-cart', JSON.stringify(cart));
        this.updateHeader();
    },

    clear() {
        localStorage.removeItem('kava-cart');
        this.updateHeader();
    },

    count() {
        return this.get().reduce((total, item) => total + item.quantity, 0);
    },

    total() {
        return this.get().reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateHeader() {
        const count = this.count();
        const cartLink = document.querySelector('.cart-icon a');
        if (cartLink) {
            cartLink.textContent = `Cart (${count})`;
        }

        // Dispatch a custom event so the UI can react if it wants to
        window.dispatchEvent(new Event('cart-updated'));
    }
};
