const { Admin, User } = require('../models');
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

            const admins = await Admin.findAndCountAll({
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

            let count = admins.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = admins.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const admResources = admins.rows.map((adm) => {
                const resource = halson(adm.toJSON())
                .addLink('self', `${API_BASE_PATH}/admins/${adm.id}`)
                .addLink('user', `${API_BASE_PATH}/users/${adm.user_id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all admins success',
                pagination,
                data: admResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/admins` }
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
            const admin = await Admin.findOne({
                where: {id},
                include: [
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            });

            if (!admin) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Admin didn't exist`,
                    data: null
                });
            }

            const admResource = halson(admin.toJSON())
            .addLink('self', `${API_BASE_PATH}/admins/${admin.id}`)
            .addLink('user', `${API_BASE_PATH}/users/${admin.user_id}`);

            const response = {
                status: 'OK',
                message: 'Get admin success',
                data: admResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/admins` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            let { user_id, name, age, telp, gender } = req.body;
            user_id = parseInt(user_id);
            age = parseInt(age);

            const body = req.body;
            const val = v.validate(body, schema.admin.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const created = await Admin.create({
                user_id,
                name,
                age,
                telp,
                gender
            });

            const admResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/admins/${created.id}`)
            .addLink('user', `${API_BASE_PATH}/users/${created.user_id}`);

            const response = {
                status: 'CREATED',
                message: 'New admin created',
                data: admResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/admins`},
                    created: { href: `${API_BASE_PATH}/admins/${created.id}`}
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
            let { name, age, telp, gender } = req.body;
            age = parseInt(age);

            const body = req.body;
            const val = v.validate(body, schema.admin.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const admin = await Admin.findOne({where: {id}});
            if (!admin) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Admin didn't exist`,
                    data: null
                });
            }

            if (!name) name = admin.name;
            if (!age) age = admin.age;
            if (!telp) telp = admin.telp;
            if (!gender) gender = admin.gender;

            await admin.update({
                name,
                age,
                telp,
                gender
            });

            const admResource = halson(admin.toJSON())
            .addLink('self', `${API_BASE_PATH}/admins/${admin.id}`)
            .addLink('user', `${API_BASE_PATH}/users/${admin.user_id}`);

            const response = {
                status: 'OK',
                message: 'Update admin success',
                data: admResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/admins` },
                    updated: { href: `${API_BASE_PATH}/admins/${admin.id}` }
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

            const admin = await Admin.findOne({ where: {id} });

            if (!admin) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Admin didn't exist`,
                    data: null
                });
            }

            await admin.destroy();

            const response = {
                status: 'OK',
                message: 'Delete admin success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/admins` },
                    deleted: { href: `${API_BASE_PATH}/admins/${admin.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}