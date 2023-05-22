const { Role } = require('../models');
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
            const roles = await Role.findAll();

            const roleResources = roles.map((role) => {
                const resource = halson(role.toJSON())
                .addLink('self', `${API_BASE_PATH}/roles/${role.id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all roles success',
                data: roleResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/roles` }
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
            const role = await Role.findOne({
                where: {id}
            });

            if (!role) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Role didn't exist`,
                    data: null
                });
            }

            const roleResource = halson(role.toJSON())
            .addLink('self', `${API_BASE_PATH}/roles/${role.id}`);

            const response = {
                status: 'OK',
                message: 'Get role success',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/roles` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { name, desc } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.role.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const created = await Role.create({
                name,
                desc
            });

            const roleResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/roles/${created.id}`);

            const response = {
                status: 'CREATED',
                message: 'New role created',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/roles`},
                    created: { href: `${API_BASE_PATH}/roles/${created.id}`}
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
            let { name, desc } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.role.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const role = await Role.findOne({where: {id}});
            if (!role) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Role didn't exist`,
                    data: null
                });
            }

            if (!name) name = role.name;
            if (!desc) desc = role.desc;

            await role.update({
                name,
                desc
            });

            const roleResource = halson(role.toJSON())
            .addLink('self', `${API_BASE_PATH}/roles/${role.id}`);

            const response = {
                status: 'OK',
                message: 'Update role success',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/roles` },
                    updated: { href: `${API_BASE_PATH}/roles/${role.id}` }
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

            const role = await Role.findOne({ where: {id} });

            if (!role) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Role didn't exist`,
                    data: null
                });
            }

            await role.destroy();

            const response = {
                status: 'OK',
                message: 'Delete role success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/roles` },
                    deleted: { href: `${API_BASE_PATH}/roles/${role.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}