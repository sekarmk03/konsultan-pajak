const { ConsultType } = require('../models');
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
            const consulttypes = await ConsultType.findAll();

            const typeResources = consulttypes.map((consulttype) => {
                const resource = halson(consulttype.toJSON())
                .addLink('self', `${API_BASE_PATH}/consulttypes/${consulttype.id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all consult types success',
                data: typeResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consulttypes` }
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
            const consulttype = await ConsultType.findOne({
                where: {id}
            });

            if (!consulttype) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consult type didn't exist`,
                    data: null
                });
            }

            const roleResource = halson(consulttype.toJSON())
            .addLink('self', `${API_BASE_PATH}/consulttypes/${consulttype.id}`);

            const response = {
                status: 'OK',
                message: 'Get consult type success',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consulttypes` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { type, desc } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.consulttype.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const created = await ConsultType.create({
                type,
                desc
            });

            const roleResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/consulttypes/${created.id}`);

            const response = {
                status: 'CREATED',
                message: 'New consult type created',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consulttypes`},
                    created: { href: `${API_BASE_PATH}/consulttypes/${created.id}`}
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
            let { type, desc } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.consulttype.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const consulttype = await ConsultType.findOne({where: {id}});
            if (!consulttype) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consult type didn't exist`,
                    data: null
                });
            }

            if (!type) type = consulttype.type;
            if (!desc) desc = consulttype.desc;

            await consulttype.update({
                type,
                desc
            });

            const roleResource = halson(consulttype.toJSON())
            .addLink('self', `${API_BASE_PATH}/consulttypes/${consulttype.id}`);

            const response = {
                status: 'OK',
                message: 'Update consult type success',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consulttypes` },
                    updated: { href: `${API_BASE_PATH}/consulttypes/${consulttype.id}` }
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

            const consulttype = await ConsultType.findOne({ where: {id} });

            if (!consulttype) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Consult type didn't exist`,
                    data: null
                });
            }

            await consulttype.destroy();

            const response = {
                status: 'OK',
                message: 'Delete consult type success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/consulttypes` },
                    deleted: { href: `${API_BASE_PATH}/consulttypes/${consulttype.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}