module.exports = {
    create: {
        user_id: 'number',
        name: { type: 'string' },
        npwp: { type: 'string' },
        address: { type: 'string' },
        leader_name: { type: 'string' },
        leader_title: { type: 'string' },
        pkp: { type: 'string' },
        business_type: { type: 'string' },
        acc_name: { type: 'string' },
        acc_telp: { type: 'string' }
    },
    update: {
        name: { optional: true, type: 'string' },
        npwp: { optional: true, type: 'string' },
        address: { optional: true, type: 'string' },
        leader_name: { optional: true, type: 'string' },
        leader_title: { optional: true, type: 'string' },
        pkp: { optional: true, type: 'string' },
        business_type: { optional: true, type: 'string' },
        acc_name: { optional: true, type: 'string' },
        acc_telp: { optional: true, type: 'string' }
    }
};