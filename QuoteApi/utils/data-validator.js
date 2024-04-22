import Joi from "joi";

const authorSchema = Joi.object({
	name: Joi.string().min(4).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(4).max(8).required(),
	age: Joi.number().required(),
});

const validate = (schema) => {
	return (req, res, next) => {
		const result = schema.validate(req.body);
		if (result.error) {
			res.json(result.error);
		} else {
			next();
		}
	};
};

export { validate, authorSchema };
