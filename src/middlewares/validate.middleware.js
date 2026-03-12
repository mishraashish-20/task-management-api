import { ApiError } from "../utils/ApiError.js";

export function validate(schema) {
  return (req, res, next) => {
    const payload = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const { error, value } = schema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(
          400,
          "Validation error",
          error.details.map((d) => d.message),
        ),
      );
    }

    if (value.body) req.body = value.body;
    if (value.params) req.params = value.params;

    req.validatedQuery = value.query || req.query;

    next();
  };
}
