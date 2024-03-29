const { User, Role, Image, Admin, Customer } = require('../models');
const { Op } = require('sequelize');
const roles = require('../common/constant/roles');
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
                sort = "email", type = "DESC", search = "", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const users = await User.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    email: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                include: [
                    {
                        model: Role,
                        as: 'role',
                        attributes: ['name']
                    },
                    {
                        model: Image,
                        as: 'image',
                        attributes: ['file_name', 'imagekit_url']
                    },
                    {
                        model: Admin,
                        as: 'admin'
                    },
                    {
                        model: Customer,
                        as: 'customer'
                    }
                ],
                limit: limit,
                offset: start
            });

            let count = users.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = users.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const userResources = users.rows.map((user) => {
                const uRes = halson(user.toJSON())
                .addLink('self', `${API_BASE_PATH}/users/${user.id}`)
                .addLink('role', `${API_BASE_PATH}/roles/${user.role_id}`)
                .addLink('image', `${API_BASE_PATH}/images/${user.img_id}`);

                return uRes;
            })

            const response = {
                status: 'OK',
                message: 'Get all users success',
                pagination,
                data: userResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/users`}
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
            const user = await User.findOne({
                where: {id: id},
                include: [
                    {
                        model: Role,
                        as: 'role',
                        attributes: ['name']
                    },
                    {
                        model: Image,
                        as: 'image',
                        attributes: ['file_name', 'imagekit_url']
                    },
                    {
                        model: Admin,
                        as: 'admin'
                    },
                    {
                        model: Customer,
                        as: 'customer'
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `User didn't exist`,
                    data: null
                });
            }

            const userResource = halson(user.toJSON())
            .addLink('self', `${API_BASE_PATH}/users/${user.id}`)
            .addLink('role', `${API_BASE_PATH}/roles/${user.role_id}`)
            .addLink('image', `${API_BASE_PATH}/images/${user.img_id}`);

            const response = {
                status: 'OK',
                message: 'Get user success',
                data: userResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/users` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            let { name, email, password, role_id = roles.CUSTOMER, img_id = 1 } = req.body;
            img_id = parseInt(img_id);
            role_id = parseInt(role_id);

            const body = req.body;
            const val = v.validate(body, schema.user.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const user = await User.findOne({where: {email}});

            if (user) {
                return res.status(409).json({
                    status: 'CONFLICT',
                    message: 'Data already exist',
                    data: null
                });
            }

            const created = await User.create({
                email,
                password,
                role_id,
                img_id
            });

            let detail;
            if (role_id == 2) {
                detail = await Admin.create({
                    user_id: created.id,
                    name,
                    age: 0,
                    telp: '',
                    gender: ''
                });
            } else if (role_id == 3) {
                detail = await Customer.create({
                    user_id: created.id,
                    name,
                    npwp: '',
                    address: '',
                    leader_name: '',
                    leader_title: '',
                    pkp: '',
                    business_type: '',
                    acc_name: '',
                    acc_telp: ''
                });
            }

            const userResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/users/${created.id}`)
            .addLink('role', `${API_BASE_PATH}/roles/${created.role_id}`)
            .addLink('image', `${API_BASE_PATH}/images/${created.img_id}`);

            const response = {
                status: 'CREATED',
                message: 'New user created',
                data: userResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/users` },
                    created: { href: `${API_BASE_PATH}/users/${created.id}` }
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
            let { email, role_id, img_id } = req.body;
            role_id = parseInt(role_id);

            const body = req.body;
            const val = v.validate(body, schema.user.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `User didn't exist`,
                    data: null
                });
            }

            const userEmail = await User.findOne({where: {email}});

            if (userEmail) {
                return res.status(409).json({
                    status: 'CONFLICT',
                    message: 'Email already used',
                    data: null
                });
            }

            if (!email) email = user.email;
            if (!role_id) role_id = user.role_id;

            await user.update({
                email,
                role_id,
                img_id
            });

            const userResource = halson(user.toJSON())
            .addLink('self', `${API_BASE_PATH}/users/${user.id}`)
            .addLink('role', `${API_BASE_PATH}/roles/${user.role_id}`)
            .addLink('image', `${API_BASE_PATH}/images/${user.img_id}`)

            const response = {
                status: 'OK',
                message: 'Update user success',
                data: userResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/users` },
                    updated: { href: `${API_BASE_PATH}/users/${user.id}` }
                }
            }

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await User.findOne({ where: {id} });

            if (!user) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `User didn't exist`,
                    data: null
                });
            }

            await user.destroy();

            const response = {
                status: 'OK',
                message: 'Delete user success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/users` },
                    deleted: { href: `${API_BASE_PATH}/users/${user.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}