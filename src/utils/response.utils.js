
function successResponse(res, statusCode = 200, data, message = 'Success') {
    res.status(statusCode).send({
        success: true,
        message,
        data,
        statusCode: statusCode
    });
}


function errorResponse(res, statusCode = 500, message = 'Internal Server Error', error = {}) {
    res.status(statusCode).send({
        success: false,
        message,
        error,
        statusCode: statusCode
    });
}

export {
    successResponse,
    errorResponse
};
