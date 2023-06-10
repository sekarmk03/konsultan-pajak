const { Customer, Schedule, Consultation, Admin } = require('../models');

module.exports = {
    customer: async (req, res, next) => {
        try {
            const customer = await Customer.count();

            return res.status(200).json({
                status: 'OK',
                message: 'Get customer summary success',
                data: customer,
            })
        } catch (err) {
            next(err);
        }
    },
    admin: async (req, res, next) => {
        try {
            const admin = await Admin.count();

            return res.status(200).json({
                status: 'OK',
                message: 'Get admin summary success',
                data: admin,
            })
        } catch (err) {
            next(err);
        }
    },
    schedule: async (req, res, next) => {
        try {
            const schedule = await Schedule.count();

            return res.status(200).json({
                status: 'OK',
                message: 'Get schedule summary success',
                data: schedule,
            })
        } catch (err) {
            next(err);
        }
    },
    consultation: async (req, res, next) => {
        try {
            const consultation = await Consultation.count();

            return res.status(200).json({
                status: 'OK',
                message: 'Get consultation summary success',
                data: consultation,
            })
        } catch (err) {
            next(err);
        }
    },
    
}