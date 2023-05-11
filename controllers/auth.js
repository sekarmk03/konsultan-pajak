const bcrypt = require('bcrypt');
const roles = require('../common/constant/roles');
const { User, Notification } = require('../models');
const schema = require('../common/validation_schema');
const Validator = require('fastest-validator');
const v = new Validator;
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET_KEY,
    API_BASE_PATH,
} = process.env;

module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password, role_id = roles.CUSTOMER, user_detail_id = 0 } = req.body;

            const exist = await User.findOne({where: {email: email}});

            if (exist) {
                return res.status(400).json({
                    status: 'BAD_REQUEST',
                    message: 'User already exist',
                    data: null
                });
            }

            const body = req.body;
            const val = v.validate(body, schema.auth.register);
            if (val.length) return res.status(400).json(val);

            const hashedPass = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: hashedPass,
                role_id,
                user_detail_id
            });

            await Notification.create({
                receiver_id: newUser.id,
                sender_id: 0,
                topic: 'account',
                title: "Account Created!",
                message: "Welcome to KKP Budi Indratno. Dapatkan keuntungan dengan pelayanan oleh konsultan berpengalaman tinggi dan jaminan risiko perpajakan.",
                is_read: false,
            });

            return res.status(201).json({
                status: 'CREATED',
                message: 'User registered',
                _links: {
                    login: `${API_BASE_PATH}/auth/login`,
                    check_user: `${API_BASE_PATH}/auth/whoami`
                },
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    password: newUser.password,
                    role_id: newUser.role_id,
                    user_detail_id: newUser.user_detail_id
                }
            });
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({where: {email: email}});

            if (!user) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: 'User not found',
                    data: null
                });
            }

            const correct = await bcrypt.compare(password, user.password);
            if (!correct) {
                return res.status(404).json({
                    status: 'BAD_REQUEST',
                    message: 'Wrong password',
                    data: null
                });
            }

            const payload = {
                id: user.id,
                email: user.email,
                password: user.password,
                role_id: user.role_id,
                user_detail_id: user.user_detail_id
            };

            const token = jwt.sign(payload, JWT_SECRET_KEY);

            return res.status(200).json({
                status: 'OK',
                message: 'Login success',
                _links: {
                    register: `${API_BASE_PATH}/auth/register`,
                    check_user: `${API_BASE_PATH}/auth/whoami`
                },
                data: {
                    id: user.id,
                    email: user.email,
                    token: token,
                }
            });
        } catch (err) {
            next(err);
        }
    },

    whoami: async (req, res, next) => {
        try {
            const currentUser = req.user;

            return res.status(200).json({
                status: 'OK',
                message: 'User found',
                _links: {
                    login: `${API_BASE_PATH}/auth/login`,
                    register: `${API_BASE_PATH}/auth/register`
                },
                data: {
                    id: currentUser.id,
                    email: currentUser.email,
                    token: currentUser.token,
                }
            })
        } catch (err) {
            next(err);
        }
    }
}