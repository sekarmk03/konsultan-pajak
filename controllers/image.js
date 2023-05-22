const { Image } = require('../models');
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
                sort = "file_name", type = "DESC", search = "", page = "1", limit = "10"
            } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);
            let start = 0 + (page - 1) * limit;
            let end = page * limit;

            const images = await Image.findAndCountAll({
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

            let count = images.count;
            let pagination = {};
            pagination.totalRows = count;
            pagination.totalPages = Math.ceil(count/limit);
            pagination.thisPageRows = images.rows.length;
            pagination.currentPage = page;
            pagination.next = end < count ? page + 1 : null;
            pagination.prev = start > 0 ? page - 1 : null;

            const imgResources = images.rows.map((img) => {
                const resource = halson(img.toJSON())
                .addLink('self', `${API_BASE_PATH}/images/${img.id}`);

                return resource;
            });

            const response = {
                status: 'OK',
                message: 'Get all images success',
                pagination,
                data: imgResources,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/images` }
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
            const image = await Image.findOne({
                where: {id}
            });

            if (!image) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Image didn't exist`,
                    data: null
                });
            }

            const imgResource = halson(image.toJSON())
            .addLink('self', `${API_BASE_PATH}/images/${image.id}`);

            const response = {
                status: 'OK',
                message: 'Get image success',
                data: imgResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/images` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const image = req.file.buffer.toString('base64');

            const uploadImg = await imagekit.upload({
                file: image,
                fileName: req.file.originalname,
                folder: IMAGEKIT_FOLDER
            });

            const created = await Image.create({
                file_name: uploadImg.name,
                imagekit_id: uploadImg.fileId,
                imagekit_url: uploadImg.url,
                imagekit_path: uploadImg.filePath
            });

            const imgResource = halson(created.toJSON())
            .addLink('self', `${API_BASE_PATH}/images/${created.id}`);

            const response = {
                status: 'CREATED',
                message: 'New image created',
                data: imgResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/images`},
                    created: { href: `${API_BASE_PATH}/images/${created.id}`}
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
            const image = req.file.buffer.toString('base64');

            const imgData = await Image.findOne({where: {id}});
            if (!imgData) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Image didn't exist`,
                    data: null
                });
            }

            if (imgData.imagekit_id != 'default-image') {
                await imagekit.deleteFile(imgData.imagekit_id);
            }

            const uploadNew = await imagekit.upload({
                file: image,
                fileName: req.file.originalname,
                folder: IMAGEKIT_FOLDER
            });

            await imgData.update({
                file_name: uploadNew.name,
                imagekit_id: uploadNew.fileId,
                imagekit_url: uploadNew.url,
                imagekit_path: uploadNew.filePath
            });

            const imgResource = halson(imgData.toJSON())
            .addLink('self', `${API_BASE_PATH}/images/${imgData.id}`);

            const response = {
                status: 'OK',
                message: 'Update image success',
                data: imgResource,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/images` },
                    updated: { href: `${API_BASE_PATH}/images/${image.id}` }
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

            const image = await Image.findOne({ where: {id} });

            if (!image) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Image didn't exist`,
                    data: null
                });
            }

            if (image.imagekit_id != 'default-image') {
                await imagekit.deleteFile(image.imagekit_id);
            }

            await image.destroy();

            const response = {
                status: 'OK',
                message: 'Delete image success',
                data: null,
                links: {
                    self: { href: req.originalUrl },
                    collection: { href: `${API_BASE_PATH}/images` },
                    deleted: { href: `${API_BASE_PATH}/images/${image.id}` }
                }
            };

            return res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}