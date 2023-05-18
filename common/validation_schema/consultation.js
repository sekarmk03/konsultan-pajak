module.exports = {
    create: {
        schedule_id: { type: 'number' },
        admin_id: { type: 'number' },
        cost: { type: 'number' },
    },
    update: {
        admin_id: { optional: true, type: 'number' },
        date_start: { optional: true, type: 'string', nullable: true },
        date_end: { optional: true, type: 'string', nullable: true },
        cost: { optional: true, type: 'number' },
    }
};