module.exports = {
    create: {
        cust_id: { type: 'number' },
        type_id: { type: 'number' },
        place_type: { type: 'string' },
        address: { type: 'string' },
        gmap_link: { type: 'string' },
    },
    update: {
        type_id: { optional: true, type: 'number' },
        place_type: { optional: true, type: 'string' },
        address: { optional: true, type: 'string' },
        gmap_link: { optional: true, type: 'string' },
    }
};