const { Consultation, Schedule, Admin, Customer, ConsultType, Document, Notification } = require('../models');
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
                sort = "updatedAt", type = "DESC", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const consultations = await Consultation.findAndCountAll({
                order: [
                    [sort, type]
                ],
                include: [
                    {
                        model: Schedule,
                        as: 'schedule',
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
                    },
                    {
                        model: Admin,
                        as: 'admin',
                        attributes: ['name']
                    },
                    {
                        model: Document,
                        as: 'documents',
                        attributes: ['file_name', 'imagekit_url']
                    }
                ],
                limit: limit,
                offset: start
            });

            let count = consultations.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = consultations.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const consResources = consultations.rows.map((cons) => {
                const resource = halson(cons.toJSON())
                .addLink('self', `${API_BASE_PATH}/consultations/${cons.id}`)
                .addLink('schedule', `${API_BASE_PATH}/schedules/${cons.schedule_id}`)
                .addLink('customer', `${API_BASE_PATH}/customers/${cons.schedule.cust_id}`)
                .addLink('admin', `${API_BASE_PATH}/admins/${cons.admin_id}`)
                .addLink('start', `${API_BASE_PATH}/consultations/${cons.id}/start`)
                .addLink('end', `${API_BASE_PATH}/consultations/${cons.id}/end`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all consultations success',
                pagination,
                data: consResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consultations` }
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
            const consultation = await Consultation.findOne({
                where: {id},
                include: [
                    {
                        model: Schedule,
                        as: 'schedule',
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
                    },
                    {
                        model: Admin,
                        as: 'admin',
                        attributes: ['name']
                    },
                    {
                        model: Document,
                        as: 'documents',
                        attributes: ['file_name', 'imagekit_url']
                    }
                ]
            });

            if (!consultation) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consultation didn't exist`,
                    data: null
                });
            }

            const consResource = halson(consultation.toJSON())
            .addLink('self', `${API_BASE_PATH}/consultations/${consultation.id}`)
            .addLink('schedule', `${API_BASE_PATH}/schedules/${consultation.schedule_id}`)
            .addLink('customer', `${API_BASE_PATH}/customers/${consultation.schedule.cust_id}`)
            .addLink('admin', `${API_BASE_PATH}/admins/${consultation.admin_id}`)
            .addLink('start', `${API_BASE_PATH}/consultations/${consultation.id}/start`)
            .addLink('end', `${API_BASE_PATH}/consultations/${consultation.id}/end`);

            const response = {
                status: 'OK',
                message: 'Get consultation success',
                data: consResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consultations` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            let { schedule_id, admin_id, cost = 0 } = req.body;
            schedule_id = parseInt(schedule_id);
            admin_id = parseInt(admin_id);
            cost = parseInt(cost);

            const body = req.body;
            const val = v.validate(body, schema.consultation.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const created = await Consultation.create({
                schedule_id,
                admin_id,
                date_start: null,
                date_end: null,
                status: state.NOT_STARTED,
                cost
            });

            const consResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/consultations/${created.id}`)
            .addLink('schedule', `${API_BASE_PATH}/schedules/${created.schedule_id}`)
            .addLink('admin', `${API_BASE_PATH}/admins/${created.admin_id}`)
            .addLink('start', `${API_BASE_PATH}/consultations/${created.id}/start`)
            .addLink('end', `${API_BASE_PATH}/consultations/${created.id}/end`);

            const response = {
                status: 'CREATED',
                message: 'New consultation created',
                data: consResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consultations`},
                    created: { href: `${API_BASE_PATH}/consultations/${created.id}`}
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
            let { admin_id, date_start, date_end, status, cost } = req.body;
            admin_id = parseInt(admin_id);
            cost = parseInt(cost);

            const body = req.body;
            const val = v.validate(body, schema.consultation.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const consultation = await Consultation.findOne({where: {id}});
            if (!consultation) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consultation didn't exist`,
                    data: null
                });
            }

            if (!admin_id) admin_id = consultation.admin_id;
            if (!date_start) date_start = consultation.date_start;
            if (!date_end) date_end = consultation.date_end;
            if (!status) status = consultation.status;
            if (!cost) cost = consultation.cost;

            await consultation.update({
                admin_id,
                date_start,
                date_end,
                status,
                cost
            });

            const consResource = halson(consultation.toJSON())
            .addLink('self', `${API_BASE_PATH}/consultations/${consultation.id}`)
            .addLink('schedule', `${API_BASE_PATH}/schedules/${consultation.schedule_id}`)
            .addLink('admin', `${API_BASE_PATH}/admins/${consultation.admin_id}`)
            .addLink('start', `${API_BASE_PATH}/consultations/${consultation.id}/start`)
            .addLink('end', `${API_BASE_PATH}/consultations/${consultation.id}/end`);

            const response = {
                status: 'OK',
                message: 'Update consultation success',
                data: consResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consultations` },
                    updated: { href: `${API_BASE_PATH}/consultations/${consultation.id}` }
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

            const consultation = await Consultation.findOne({ where: {id} });

            if (!consultation) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consultation didn't exist`,
                    data: null
                });
            }

            await consultation.destroy();

            const response = {
                status: 'OK',
                message: 'Delete consultation success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consultations` },
                    deleted: { href: `${API_BASE_PATH}/consultations/${consultation.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    start: async (req, res, next) => {
        try {
            const { id } = req.params;

            const consultation = await Consultation.findOne({
                where: {id},
                include: {
                    model: Schedule,
                    as: 'schedule'
                }
            });
            if (!consultation) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consultation didn't exist`,
                    data: null
                });
            }

            if (consultation.status != state.NOT_STARTED) {
                let message = '';
                switch (consultation.status) {
                    case state.ONGOING:
                        message = `Consultation is ongoing`;
                        break;
                    case state.DONE:
                        message = `Consultation already done`;
                        break;
                    default:
                        message = `Consultation status error`;
                        break;
                }
                return res.status(400).json({
                    status: 'BAD_REQUEST',
                    message: message,
                    data: null
                });
            }

            await consultation.update({
                status: state.ONGOING,
                date_start: new Date()
            });

            await Notification.create({
                receiver_id: consultation.schedule.cust_id,
                sender_id: consultation.admin_id,
                topic: 'Consultation',
                title: 'Your consultation has been started!',
                message: 'Meet our consultant at the appointed time and place. Contact our company contact if you have questions or complaints.'
            });

            const response = {
                status: 'OK',
                message: 'Start consultation success',
                data: consultation,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consultations` },
                    updated: { href: `${API_BASE_PATH}/consultations/${consultation.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    end: async (req, res, next) => {
        try {
            const { id } = req.params;

            const consultation = await Consultation.findOne({
                where: {id},
                include: {
                    model: Schedule,
                    as: 'schedule'
                }
            });

            if (!consultation) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consultation didn't exist`,
                    data: null
                });
            }

            if (consultation.status != state.ONGOING) {
                let message = '';
                switch (consultation.status) {
                    case state.NOT_STARTED:
                        message = `Consultation is not started yet`;
                        break;
                    case state.DONE:
                        message = `Consultation already done`;
                        break;
                    default:
                        message = `Consultation status error`;
                        break;
                }
                return res.status(400).json({
                    status: 'BAD_REQUEST',
                    message: message,
                    data: null
                });
            }

            await consultation.update({
                status: state.DONE,
                date_end: new Date()
            });

            await Notification.create({
                receiver_id: consultation.schedule.cust_id,
                sender_id: consultation.admin_id,
                topic: 'Consultation',
                title: 'Your consultation has been ended!',
                message: 'Thank you for using our consulting services. You will soon be able to see the results of your consultation document on the consultation detail page and we will also send it via your registered email.'
            });

            const response = {
                status: 'OK',
                message: 'End consultation success',
                data: consultation,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consultations` },
                    updated: { href: `${API_BASE_PATH}/consultations/${consultation.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}