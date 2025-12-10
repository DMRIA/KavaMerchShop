export const Marketing = {
    saveEmail(email) {
        const emails = JSON.parse(localStorage.getItem('kava-marketing-emails') || '[]');
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem('kava-marketing-emails', JSON.stringify(emails));
            return { success: true, message: 'Email saved successfully!' };
        }
        return { success: true, message: 'Email already subscribed!' };
    },

    savePreorder(preorder) {
        const preorders = JSON.parse(localStorage.getItem('kava-preorders') || '[]');
        const newOrder = {
            id: 'PRE-' + Date.now(),
            timestamp: new Date().toISOString(),
            ...preorder
        };
        preorders.push(newOrder);
        localStorage.setItem('kava-preorders', JSON.stringify(preorders));
        return { success: true, message: 'Preorder placed successfully!', orderId: newOrder.id };
    },

    getPreorders() {
        return JSON.parse(localStorage.getItem('kava-preorders') || '[]');
    }
};
