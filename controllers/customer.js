const { Customer, User, Schedule, Consultation, ConsultType, Image, Notification, Admin } = require('../models');
const { Op } = require('sequelize');
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
                sort = "name", type = "DESC", search = "", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const customers = await Customer.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ],
                limit: limit,
                offset: start
            });

            let count = customers.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = customers.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const custResources = customers.rows.map((cust) => {
                const cRes = halson(cust.toJSON())
                .addLink('self', `${API_BASE_PATH}/customers/${cust.id}`)
                .addLink('user', `${API_BASE_PATH}/users/${cust.user_id}`)
                .addLink('notification', `${API_BASE_PATH}/customers/${cust.id}/notifications`)
                .addLink('consult-request', `${API_BASE_PATH}/customers/${cust.id}/requests`)
                .addLink('consult-ongoing', `${API_BASE_PATH}/customers/${cust.id}/consultations?status=ongoing`)
                .addLink('consult-done', `${API_BASE_PATH}/customers/${cust.id}/consultations?status=done`);

                return cRes;
            });

            const response = {
                status: 'OK',
                message: 'Get all customers success',
                pagination,
                data: custResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/customers` }
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    show: async (req, res, next) => {
        try {
            let customer;
            if (req.user.role_id == 1 || req.user.role_id == 2) {
                const { id } = req.params;
                customer = await Customer.findOne({
                    where: {id},
                    include: [
                        {
                            model: User,
                            as: 'user',
                            include: {
                                model: Image,
                                as: 'image',
                                attributes: ['file_name', 'imagekit_url']
                            }
                        }
                    ]
                });
            } else {
                const { id } = req.user;
                customer = await Customer.findOne({
                    include: [
                        {
                            model: User,
                            as: 'user',
                            where: {
                                id: id
                            },
                            include: {
                                model: Image,
                                as: 'image',
                                attributes: ['file_name', 'imagekit_url']
                            }
                        }
                    ]
                });
            }
            
            if (!customer) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Customer didn't exist`,
                    data: null
                });
            }

            const custResource = halson(customer.toJSON())
            .addLink('self', `${API_BASE_PATH}/customers/${customer.id}`)
            .addLink('user', `${API_BASE_PATH}/users/${customer.user_id}`)
            .addLink('notification', `${API_BASE_PATH}/customers/${customer.id}/notifications`)
            .addLink('consult-request', `${API_BASE_PATH}/customers/${customer.id}/requests`)
            .addLink('consult-ongoing', `${API_BASE_PATH}/customers/${customer.id}/consultations?status=ongoing`)
            .addLink('consult-done', `${API_BASE_PATH}/customers/${customer.id}/consultations?status=done`);

            const response = {
                status: 'OK',
                message: 'Get customer success',
                data: custResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/customers` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            let { user_id, name, npwp, address, leader_name, leader_title, pkp, business_type, acc_name, acc_telp } = req.body;
            user_id = parseInt(user_id);

            const body = req.body;
            const val = v.validate(body, schema.customer.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const customer = await Customer.findOne({where: {npwp}});

            if (customer) {
                return res.status(409).json({
                    status: 'CONFLICT',
                    message: 'Data already exist',
                    data: null
                });
            }

            const created = await Customer.create({
                user_id,
                name,
                npwp,
                address,
                leader_name,
                leader_title,
                pkp,
                business_type,
                acc_name,
                acc_telp
            });

            const custResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/customers/${created.id}`)
            .addLink('user', `${API_BASE_PATH}/users/${created.user_id}`);

            const response = {
                status: 'CREATED',
                message: 'New customer created',
                data: custResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/customers`},
                    created: { href: `${API_BASE_PATH}/customers/${created.id}`}
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
            let { name, npwp, address, leader_name, leader_title, pkp, business_type, acc_name, acc_telp } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.customer.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const customer = await Customer.findOne({where: {id}});
            if (!customer) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Customer didn't exist`,
                    data: null
                });
            }

            const custNpwp = await Customer.findOne({where: {npwp}});

            if (custNpwp) {
                return res.status(409).json({
                    status: 'CONFLICT',
                    message: 'NPWP already used',
                    data: null
                });
            }

            if (!name) name = customer.name;
            if (!npwp) npwp = customer.npwp;
            if (!address) address = customer.address;
            if (!leader_name) leader_name = customer.leader_name;
            if (!leader_title) leader_title = customer.leader_title;
            if (!pkp) pkp = customer.pkp;
            if (!business_type) business_type = customer.business_type;
            if (!acc_name) acc_name = customer.acc_name;
            if (!acc_telp) acc_telp = customer.acc_telp;

            await customer.update({
                name,
                npwp,
                address,
                leader_name,
                leader_title,
                pkp,
                business_type,
                acc_name,
                acc_telp
            });

            await Notification.create({
                receiver_id: customer.id,
                sender_id: 0,
                topic: 'Account',
                title: 'Your profile has been updated!',
                message: 'Keep your profile always updated and dont forget to periodically reset your email.'
            });

            const custResource = halson(customer.toJSON())
            .addLink('self', `${API_BASE_PATH}/customers/${customer.id}`)
            .addLink('user', `${API_BASE_PATH}/users/${customer.user_id}`);

            const response = {
                status: 'OK',
                message: 'Update customer success',
                data: custResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/customers` },
                    updated: { href: `${API_BASE_PATH}/customers/${customer.id}` }
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

            const customer = await Customer.findOne({ where: {id} });

            if (!customer) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Customer didn't exist`,
                    data: null
                });
            }

            await customer.destroy();

            const response = {
                status: 'OK',
                message: 'Delete customer success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/customers` },
                    deleted: { href: `${API_BASE_PATH}/customers/${customer.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    consultRequest: async (req, res, next) => {
        try {
            let {
                sort = "createdAt", type = "DESC", date = "", page = "1", limit = "10"
            } = req.query;
            const { id } = req.params;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            // const now = new Date();
            // const startTime = new Date(`${date ? date : '2023-01-02'} 12:00:00`);
            // const endTime = new Date(date ? date + ' 23:59:59' : now);

            const schedules = await Schedule.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    cust_id: id,
                    // date: {
                    //     [Op.between]: [startTime, endTime]
                    // }
                },
                include: [
                    {
                        model: ConsultType,
                        as: 'type',
                        attributes: ['type']
                    },
                    {
                        model: Consultation,
                        as: 'consultation',
                        attributes: ['date_start', 'date_end', 'cost']
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
                .addLink('self', `${API_BASE_PATH}/schedules/${sch.id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: `Get customer's consultation requests success`,
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

    consultations: async (req, res, next) => {
        try {
            let {
                sort = "createdAt", type = "DESC", date = "", page = "1", limit = "10", status = 'ongoing'
            } = req.query;
            const { id } = req.params;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            // const now = new Date();
            // const startTime = new Date(`${date ? date : '2023-01-02'} 12:00:00`);
            // const endTime = new Date(date ? date + ' 23:59:59' : now);

            const schedules = await Schedule.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    cust_id: id,
                    // date: {
                    //     [Op.between]: [startTime, endTime]
                    // },
                },
                include: [
                    {
                        model: ConsultType,
                        as: 'type',
                        attributes: ['type']
                    },
                    {
                        model: Consultation,
                        as: 'consultation',
                        where: {
                            status: {
                                [Op.iLike]: `%${status}%`
                            }
                        },
                        attributes: ['id', 'date_start', 'date_end', 'cost']
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
                .addLink('self', `${API_BASE_PATH}/schedules/${sch.id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: `Get customer's consultations success`,
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

    notification: async (req, res, next) => {
        try {
            let {
                sort = "createdAt", type = "DESC"
            } = req.query;
            const { id } = req.params;

            const notifications = await Notification.findAll({
                order: [
                    [sort, type]
                ],
                include: [
                    {
                        model: Admin,
                        as: 'sender',
                        attributes: ['name']
                    },
                    {
                        model: Customer,
                        as: 'receiver',
                        where: { id },
                        attributes: ['name']
                    }
                ]
            });

            const notifResources = notifications.map((notification) => {
                const resource = halson(notification.toJSON())
                .addLink('self', `${API_BASE_PATH}/notifications/${notification.id}`)
                .addLink('read', `${API_BASE_PATH}/notifications/${notification.id}/read`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all notifications success',
                data: notifResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/notifications` },
                    readAll: { href: `${API_BASE_PATH}/notifications/read` }
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}