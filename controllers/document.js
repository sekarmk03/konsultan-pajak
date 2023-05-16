const { Document } = require('../models');
const { Op } = require('sequelize');
const halson = require('halson');
const imagekit = require('../utils/imagekit');
const {
    API_BASE_PATH,
    IMAGEKIT_FOLDER
} = process.env;

module.exports = {
    index: async (req, res, next) => {
        try {
            let {
                sort = "file_name", type = "ASC", search = "", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const documents = await Document.findAndCountAll({
                order: [
                    [sort, type]
                ],
                where: {
                    file_name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                limit: limit,
                offset: start
            });

            let count = documents.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = documents.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const docResources = documents.rows.map((doc) => {
                const resource = halson(doc.toJSON())
                .addLink('self', `${API_BASE_PATH}/documents/${doc.id}`)
                .addLink('consultation', `${API_BASE_PATH}/consultations/${doc.consultation_id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all documents success',
                pagination,
                data: docResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/documents` }
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
            const document = await Document.findOne({
                where: {id}
            });

            if (!document) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Document didn't exist`,
                    data: null
                });
            }

            const docResource = halson(document.toJSON())
            .addLink('self', `${API_BASE_PATH}/documents/${document.id}`)
            .addLink('consultation', `${API_BASE_PATH}/consultations/${document.consultation_id}`);

            const response = {
                status: 'OK',
                message: 'Get document success',
                data: docResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/documents` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            let { consultation_id } = req.body;
            consultation_id = parseInt(consultation_id);
            const document = req.file.buffer.toString('base64');

            const uploadImg = await imagekit.upload({
                file: document,
                fileName: req.file.originalname,
                folder: IMAGEKIT_FOLDER
            });

            const created = await Document.create({
                consultation_id,
                file_name: uploadImg.name,
                imagekit_id: uploadImg.fileId,
                imagekit_url: uploadImg.url,
                imagekit_path: uploadImg.filePath
            });

            const docResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/documents/${created.id}`)
            .addLink('consultation', `${API_BASE_PATH}/consultations/${created.consultation_id}`);

            const response = {
                status: 'CREATED',
                message: 'New document created',
                data: docResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/documents`},
                    created: { href: `${API_BASE_PATH}/documents/${created.id}`}
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
            const document = req.file.buffer.toString('base64');

            const docData = await Document.findOne({where: {id}});
            if (!docData) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Document didn't exist`,
                    data: null
                });
            }

            if (docData.imagekit_id != 'sample-pdf') {
                await imagekit.deleteFile(docData.imagekit_id);
            }

            const uploadNew = await imagekit.upload({
                file: document,
                fileName: req.file.originalname,
                folder: IMAGEKIT_FOLDER
            });

            await docData.update({
                file_name: uploadNew.name,
                imagekit_id: uploadNew.fileId,
                imagekit_url: uploadNew.url,
                imagekit_path: uploadNew.filePath
            });

            const docResource = halson(docData.toJSON())
            .addLink('self', `${API_BASE_PATH}/documents/${docData.id}`)
            .addLink('consultation', `${API_BASE_PATH}/consultations/${docData.consultation_id}`);

            const response = {
                status: 'OK',
                message: 'Update document success',
                data: docResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/documents` },
                    updated: { href: `${API_BASE_PATH}/documents/${document.id}` }
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

            const document = await Document.findOne({ where: {id} });

            if (!document) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Document didn't exist`,
                    data: null
                });
            }

            if (document.imagekit_id != 'sample-pdf') {
                await imagekit.deleteFile(document.imagekit_id);
            }

            await document.destroy();

            const response = {
                status: 'OK',
                message: 'Delete document success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/documents` },
                    deleted: { href: `${API_BASE_PATH}/documents/${document.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}