const { Schedule, Consultation, ConsultType, Customer } = require('../models');
const { Op } = require('sequelize');
const state = require('../common/constant/status');
const schema = require('../common/validation_schema');
const Validator = require('fastest-validator');
const v = new Validator;
const halson = require('halson');
const {
    API_BASE_PATH,
} = process.env;

module.exports = {
    index: async (req, res, next) => {
        try {
            let {
                sort = "date", type = "ASC", date = "", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const now = new Date();
            const startTime = new Date(`${date ? date : '2023-01-02'} 00:00:00`);
            const endTime = new Date(date ? date + ' 23:59:59' : now);

            const schedules = await Schedule.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    date: {
                        [Op.between]: [startTime, endTime]
                    },
                },
                include: [
                    {
                        model: ConsultType,
                        as: 'type',
                        attributes: ['type']
                    },
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['name']
                    }
                ],
                limit: limit,
                offset: start
            });

            let count = schedules.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = schedules.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const schResources = schedules.rows.map((sch) => {
                const resource = halson(sch.toJSON())
                .addLink('self', `${API_BASE_PATH}/schedules/${sch.id}`)
                .addLink('customer', `${API_BASE_PATH}/customers/${sch.cust_id}`)
                .addLink('type', `${API_BASE_PATH}/consulttypes/${sch.type_id}`)
                .addLink('accept', `${API_BASE_PATH}/schedules/${sch.id}/accept`)
                .addLink('decline', `${API_BASE_PATH}/schedules/${sch.id}/decline`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all schedules success',
                pagination,
                data: schResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/schedules` }
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        try {
            const { id } = req.params;
            const schedule = await Schedule.findOne({
                where: {id},
                include: [
                    {
                        model: ConsultType,
                        as: 'type',
                        attributes: ['type']
                    },
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['name']
                    }
                ]
            });

            if (!schedule) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Schedule didn't exist`,
                    data: null
                });
            }

            const schResource = halson(schedule.toJSON())
            .addLink('self', `${API_BASE_PATH}/schedules/${schedule.id}`)
            .addLink('customer', `${API_BASE_PATH}/customers/${schedule.cust_id}`)
            .addLink('type', `${API_BASE_PATH}/consulttypes/${schedule.type_id}`)
            .addLink('accept', `${API_BASE_PATH}/schedules/${schedule.id}/accept`)
            .addLink('decline', `${API_BASE_PATH}/schedules/${schedule.id}/decline`);

            const response = {
                status: 'OK',
                message: 'Get schedule success',
                data: schResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/schedules` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { cust_id, type_id, place_type, address, gmap_link } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.schedule.create);
            if (val.length) return res.status(400).json(val);

            const created = await Schedule.create({
                cust_id,
                type_id,
                date: new Date(),
                place_type,
                address,
                gmap_link,
                status: state.REQUESTED
            });

            const schResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/schedules/${created.id}`)
            .addLink('customer', `${API_BASE_PATH}/customers/${created.cust_id}`)
            .addLink('type', `${API_BASE_PATH}/consulttypes/${created.type_id}`)
            .addLink('accept', `${API_BASE_PATH}/schedules/${created.id}/accept`)
            .addLink('decline', `${API_BASE_PATH}/schedules/${created.id}/decline`);

            const response = {
                status: 'CREATED',
                message: 'New schedule created',
                data: schResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/schedules`},
                    created: { href: `${API_BASE_PATH}/schedules/${created.id}`}
                }
            };

            return res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            let { type_id, place_type, address, gmap_link } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.schedule.update);
            if (val.length) return res.status(400).json(val);

            const schedule = await Schedule.findOne({where: {id}});
            if (!schedule) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Schedule didn't exist`,
                    data: null
                });
            }

            if (!type_id) type_id = schedule.type_id;
            if (!place_type) place_type = schedule.place_type;
            if (!address) address = schedule.address;
            if (!gmap_link) gmap_link = schedule.gmap_link;

            await schedule.update({
                type_id,
                place_type,
                address,
                gmap_link
            });

            const schResource = halson(schedule.toJSON())
            .addLink('self', `${API_BASE_PATH}/schedules/${schedule.id}`)
            .addLink('customer', `${API_BASE_PATH}/customers/${schedule.cust_id}`)
            .addLink('type', `${API_BASE_PATH}/consulttypes/${schedule.type_id}`)
            .addLink('accept', `${API_BASE_PATH}/schedules/${schedule.id}/accept`)
            .addLink('decline', `${API_BASE_PATH}/schedules/${schedule.id}/decline`);

            const response = {
                status: 'OK',
                message: 'Update schedule success',
                data: schResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/schedules` },
                    updated: { href: `${API_BASE_PATH}/schedules/${schedule.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;

            const schedule = await Schedule.findOne({ where: {id} });

            if (!schedule) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Schedule didn't exist`,
                    data: null
                });
            }

            await schedule.destroy();

            const response = {
                status: 'OK',
                message: 'Delete schedule success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/schedules` },
                    deleted: { href: `${API_BASE_PATH}/schedules/${schedule.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}