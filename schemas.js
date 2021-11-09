const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.walkSchema = Joi.object({
		walk: Joi.object({
			title: Joi.string().required().escapeHTML(),
			text: Joi.string().required().escapeHTML(),
			location: Joi.string().required().escapeHTML(),
			// start: Joi.string().required(),
			end: Joi.string().required().escapeHTML(),
			// endName: Joi.string().required(),
			distance: Joi.number().precision(2).required(),
			time: Joi.number().required(),
			ascent: Joi.number().required(),
			descent: Joi.number().required(),
			difficulty: Joi.string().required().escapeHTML(),
			layout: Joi.string().required().escapeHTML()
			// name: Joi.string().required(),			
			// desc: Joi.string().required()			
		}).required(),
	    deleteImages: Joi.array()
	})

module.exports.commentSchema = Joi.object({
		comment: Joi.object({	
			rating: Joi.number().required().min(1).max(5),
			body: Joi.string().required().escapeHTML()						
		}).required()
	})