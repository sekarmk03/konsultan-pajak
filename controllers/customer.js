const { Customer, User } = require('../models');
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
                sort = "name", type = "ASC", search = "", page = "1", limit = "10"
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
                .addLink('user', `${API_BASE_PATH}/users/${cust.user_id}`);

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
            const { id } = req.params;
            const customer = await Customer.findOne({
                where: {id},
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            });

            if (!customer) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Customer didn't exist`,
                    data: null
                });
            }

            const custResource = halson(customer.toJSON())
            .addLink('self', `${API_BASE_PATH}/customers/${customer.id}`)
            .addLink('user', `${API_BASE_PATH}/users/${customer.user_id}`);

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
            const { user_id, name, npwp, address, leader_name, leader_title, pkp, business_type, acc_name, acc_telp } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.customer.create);
            if (val.length) return res.status(400).json(val);

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
            nest(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            let { name, npwp, address, leader_name, leader_title, pkp, business_type, acc_name, acc_telp } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.customer.update);
            if (val.length) return res.status(400).json(val);

            const customer = await Customer.findOne({where: id});
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
    }
}