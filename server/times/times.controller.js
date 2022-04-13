const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const timeService = require('./time.service');

// routes
router.get('/', getAll);

module.exports = router;

// route functions
function getAll(req, res, next) {
     timeService.getAll()
        .then(times => res.json(times))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty('')
    }).with('password', 'password');
    validateRequest(req, next, schema);
}
