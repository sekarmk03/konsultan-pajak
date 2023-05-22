const auth = require('./auth');
const user = require('./user');
const customer = require('./customer');
const admin = require('./admin');
const image = require('./image');
const role = require('./role');
const document = require('./document');
const schedule = require('./schedule');
const consultation = require('./consultation');
const notification = require('./notification');
const consulttype = require('./consulttype');

module.exports = {
    auth,
    user,
    customer,
    admin,
    image,
    role,
    document,
    schedule,
    consultation,
    notification,
    consulttype
};