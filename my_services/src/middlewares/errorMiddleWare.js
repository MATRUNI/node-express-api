import AppErrors from "../utils/AppErrors.js";

function handleValidationError(err) {
    const errors = {};
    for (const field in err.errors) {
        if (err.errors[field].name === 'CastError') {
            errors[field] = `Invalid data type. Expected a ${err.errors[field].kind}.`;
        } else {
            // Standard validation error (e.g., enum violation, required field missing)
            errors[field] = err.errors[field].message;
        }
    }
    return new AppErrors('Validation Failed', 400, errors);
}

function handleDuplicateKeyError(err) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    
    const errors = { [field]: `The ${field} '${value}' already exists.` };
    return new AppErrors('Duplicate Field Value Error', 400, errors);
}

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = err; 

    if (err.name === 'ValidationError') error = handleValidationError(err);
    if (err.code === 11000) error = handleDuplicateKeyError(err);
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: error.message,
            errors: error.errors
        });
    }

    console.error('ERROR 💥:', err);
    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went completely wrong on our end.'
    });
};