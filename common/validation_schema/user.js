module.exports = {
    register: {
        email: 'email',
        password: 'string|min:8',
        role_id: { optional: true, type: 'number', enum: [1, 2, 3]},
        img_id: {optional: true, type: 'number'}
    },
    update: {
        email: { optional: true, type: 'email' },
        role_id: { optional: true, type: 'number', enum: [1, 2, 3]},
        img_id: {optional: true, type: 'number'}
    }
};