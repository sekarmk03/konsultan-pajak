module.exports = {
    create: {
        name: { type: 'string' },
        desc: { optional: true, type: 'string' },
    },
    update: {
        name: { optional: true, type: 'string' },
        desc: { optional: true, type: 'string' },
    }
};