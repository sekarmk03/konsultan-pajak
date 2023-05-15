module.exports = {
    create: {
        user_id: 'number',
        name: { optional: true, type: 'string' },
        age: { optional: true, type: 'number' },
        telp: { optional: true, type: 'string' },
        gender: { optional: true, type: 'string' }
    },
    update: {
        name: { optional: true, type: 'string' },
        age: { optional: true, type: 'number' },
        telp: { optional: true, type: 'string' },
        gender: { optional: true, type: 'string' }
    }
};