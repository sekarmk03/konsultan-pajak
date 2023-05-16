module.exports = {
    create: {
        user_id: { type: 'number' },
        name: { type: 'string' },
        age: { type: 'number' },
        telp: { type: 'string' },
        gender: { type: 'string' }
    },
    update: {
        name: { optional: true, type: 'string' },
        age: { optional: true, type: 'number' },
        telp: { optional: true, type: 'string' },
        gender: { optional: true, type: 'string' }
    }
};