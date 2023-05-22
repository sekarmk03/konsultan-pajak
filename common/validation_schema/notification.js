module.exports = {
    create: {
        receiver_id: { optional: true, type: 'number' },
        sender_id: { optional: true, type: 'number' },
        topic: { optional: true, type: 'string' },
        title: { optional: true, type: 'string' }
    },
    update: {
        receiver_id: { optional: true, type: 'number' },
        sender_id: { optional: true, type: 'number' },
        topic: { optional: true, type: 'string' },
        title: { optional: true, type: 'string' }
    }
};