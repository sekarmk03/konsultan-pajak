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
            const ctypes = await ConsultType.findAll();

            const typeResources = ctypes.map((ctype) => {
                const resource = halson(ctype.toJSON())
                .addLink('self', `${API_BASE_PATH}/ctypes/${ctype.id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all ctypes success',
                pagination,
                data: typeResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/ctypes` }
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
            const ctype = await ConsultType.findOne({
                where: {id}
            });

            if (!ctype) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `ConsultType didn't exist`,
                    data: null
                });
            }

            const roleResource = halson(ctype.toJSON())
            .addLink('self', `${API_BASE_PATH}/ctypes/${ctype.id}`);

            const response = {
                status: 'OK',
                message: 'Get ctype success',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/ctypes` }
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
            const val = v.validate(body, schema.ctype.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const created = await ConsultType.create({
                name,
                desc
            });

            const roleResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/ctypes/${created.id}`);

            const response = {
                status: 'CREATED',
                message: 'New ctype created',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/ctypes`},
                    created: { href: `${API_BASE_PATH}/ctypes/${created.id}`}
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
            const val = v.validate(body, schema.ctype.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const ctype = await ConsultType.findOne({where: {id}});
            if (!ctype) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `ConsultType didn't exist`,
                    data: null
                });
            }

            if (!name) name = ctype.name;
            if (!desc) desc = ctype.desc;

            await ctype.update({
                name,
                desc
            });

            const roleResource = halson(ctype.toJSON())
            .addLink('self', `${API_BASE_PATH}/ctypes/${ctype.id}`);

            const response = {
                status: 'OK',
                message: 'Update ctype success',
                data: roleResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/ctypes` },
                    updated: { href: `${API_BASE_PATH}/ctypes/${ctype.id}` }
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

            const ctype = await ConsultType.findOne({ where: {id} });

            if (!ctype) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `ConsultType didn't exist`,
                    data: null
                });
            }

            await ctype.destroy();

            const response = {
                status: 'OK',
                message: 'Delete ctype success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/ctypes` },
                    deleted: { href: `${API_BASE_PATH}/ctypes/${ctype.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}