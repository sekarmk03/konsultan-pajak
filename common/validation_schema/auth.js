module.exports = {
    register: {
        name: 'string',
        email: 'email',
        password: 'string|min:8',
        role_id: { optional: true, type: 'number', enum: [1, 2, 3]},
        img_id: { optional: true, type: 'number' }
    },
    login: {
        email: 'email',
        password: 'string|min:8'
    }
};