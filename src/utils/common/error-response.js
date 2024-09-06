class ErrorResponse {
    constructor(error, message = "Something went wrong") {
        this.success = false;
        this.message = message;
        this.data = {};
        this.error = error;
    }
}

module.exports = ErrorResponse;
