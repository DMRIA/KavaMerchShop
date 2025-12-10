export const Auth = {
    login(email, password) {
        // Mock login
        if (email && password) {
            const user = {
                id: 'user_123',
                name: email.split('@')[0],
                email: email,
                joinedDate: new Date().toISOString()
            };
            localStorage.setItem('kava-user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    register(name, email, password) {
        // Mock registration
        if (name && email && password) {
            const user = {
                id: 'user_' + Date.now(),
                name: name,
                email: email,
                joinedDate: new Date().toISOString()
            };
            localStorage.setItem('kava-user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Please fill in all fields' };
    },

    logout() {
        localStorage.removeItem('kava-user');
        window.location.hash = 'login';
        window.location.reload();
    },

    getUser() {
        return JSON.parse(localStorage.getItem('kava-user'));
    },

    getOrders() {
        const storedOrders = JSON.parse(localStorage.getItem('kava-orders') || '[]');
        // Combine with mock data if empty for demo purposes, or just use stored
        if (storedOrders.length === 0) {
            return [
                {
                    id: 'ORD-7782',
                    date: '2025-10-15',
                    total: 89.98,
                    status: 'Delivered',
                    items: [
                        {
                            name: 'Kava Co. Island Roots Grey Graphic T-Shirt',
                            image: '/product_mockups (3)/Gemini_Generated_Image_zb26bzb26bzb26bz/Gemini_Generated_Image_zb26bzb26bzb26bz_hanging.jpg'
                        },
                        {
                            name: 'Kava Co. Olive Green Full-Zip Lightweight Jacket',
                            image: '/product_mockups (3)/Gemini_Generated_Image_oiroweoiroweoiro/Gemini_Generated_Image_oiroweoiroweoiro_folded.jpg'
                        }
                    ]
                },
                {
                    id: 'ORD-9921',
                    date: '2025-11-02',
                    total: 44.99,
                    status: 'Processing',
                    items: [
                        {
                            name: 'Kava Blend Island Roots Graphic Sweatshirt',
                            image: '/product_mockups (3)/Gemini_Generated_Image_fohbi8fohbi8fohb/Gemini_Generated_Image_fohbi8fohbi8fohb_folded.jpg'
                        }
                    ]
                }
            ];
        }
        return storedOrders;
    },

    addOrder(order) {
        const orders = this.getOrders();
        orders.unshift(order); // Add new order to the beginning
        localStorage.setItem('kava-orders', JSON.stringify(orders));
    }
};
