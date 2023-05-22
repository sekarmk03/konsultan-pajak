const { Notification, Admin, Customer } = require('../models');
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
                sort = "createdAt", type = "DESC", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const notifications = await Notification.findAndCountAll({
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
                        attributes: ['name']
                    }
                ],
                limit: limit,
                offset: start
            });

            let count = notifications.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = notifications.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const notifResources = notifications.rows.map((notification) => {
                const resource = halson(notification.toJSON())
                .addLink('self', `${API_BASE_PATH}/notifications/${notification.id}`)
                .addLink('read', `${API_BASE_PATH}/notifications/${notification.id}/read`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all notifications success',
                pagination,
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
    },

    show: async (req, res, next) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findOne({
                where: {id},
                include: [
                    {
                        model: Admin,
                        as: 'sender',
                        attributes: ['name']
                    },
                    {
                        model: Customer,
                        as: 'receiver',
                        attributes: ['name']
                    }
                ],
            });

            if (!notification) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Notification didn't exist`,
                    data: null
                });
            }

            const notifResource = halson(notification.toJSON())
            .addLink('self', `${API_BASE_PATH}/notifications/${notification.id}`)
            .addLink('read', `${API_BASE_PATH}/notifications/${notification.id}/read`);

            const response = {
                status: 'OK',
                message: 'Get notification success',
                data: notifResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/notifications` },
                    readAll: { href: `${API_BASE_PATH}/notifications/read` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const { receiver_id, sender_id, topic, title, message } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.notification.create);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const created = await Notification.create({
                receiver_id,
                sender_id,
                topic,
                title,
                message,
                is_read: false
            });

            const notifResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/notifications/${created.id}`)
            .addLink('read', `${API_BASE_PATH}/notifications/${created.id}/read`);

            const response = {
                status: 'CREATED',
                message: 'New notification created',
                data: notifResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/notifications`},
                    created: { href: `${API_BASE_PATH}/notifications/${created.id}`},
                    readAll: { href: `${API_BASE_PATH}/notifications/read` }
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
            let { receiver_id, sender_id, topic, title, message, is_read } = req.body;

            const body = req.body;
            const val = v.validate(body, schema.notification.update);
            if (val.length) return res.status(400).json({
                status: 'BAD_REQUEST',
                message: val[0].message,
                data: null
            });

            const notification = await Notification.findOne({where: {id}});
            if (!notification) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Notification didn't exist`,
                    data: null
                });
            }

            if (!receiver_id) receiver_id = notification.receiver_id;
            if (!sender_id) sender_id = notification.sender_id;
            if (!topic) topic = notification.topic;
            if (!title) title = notification.title;
            if (!message) message = notification.message;
            if (!is_read) is_read = notification.is_read;

            await notification.update({
                receiver_id,
                sender_id,
                topic,
                title,
                message,
                is_read
            });

            const notifResource = halson(notification.toJSON())
            .addLink('self', `${API_BASE_PATH}/notifications/${notification.id}`)
            .addLink('read', `${API_BASE_PATH}/notifications/${notification.id}/read`);

            const response = {
                status: 'OK',
                message: 'Update notification success',
                data: notifResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/notifications` },
                    updated: { href: `${API_BASE_PATH}/notifications/${notification.id}` },
                    readAll: { href: `${API_BASE_PATH}/notifications/read` }
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

            const notification = await Notification.findOne({ where: {id} });

            if (!notification) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Notification didn't exist`,
                    data: null
                });
            }

            await notification.destroy();

            const response = {
                status: 'OK',
                message: 'Delete notification success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/notifications` },
                    deleted: { href: `${API_BASE_PATH}/notifications/${notification.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    read: async (req, res, next) => {
        try {
            const { id } = req.params;
            let notification = await Notification.findOne({
                where: {id},
            });

            if (!notification) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Notification didn't exist`,
                    data: null
                });
            }

            await notification.update({
                is_read: true
            });

            const response = {
                status: 'OK',
                message: 'Read notification success',
                data: notification,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/notifications` },
                    readAll: { href: `${API_BASE_PATH}/notifications/read` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

}