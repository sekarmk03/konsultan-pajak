const { User } = require('../models');
const { Op } = require('sequelize');
const schema = require('../common/validation_schema');
const Validator = require('fastest-validator');
const v = new Validator;
const halson = require('halson');

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

            const users = await User.findAndCountAll({
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
                        
                    }
                ]
            })
        } catch (err) {
            
        }
    }
}