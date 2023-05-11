module.exports = {
    register: {
        email: 'email',
        password: 'string|min:8',
        role_id: { optional: true, type: 'number', enum: ['Superadmin', 'Admin', 'Customer']},
        user_detail_id: { optional: true, type: 'number' },
    }
};