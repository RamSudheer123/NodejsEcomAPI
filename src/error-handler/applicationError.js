// This is customized apllication error handler
export class applicationError extends Error {
    constructor(message, code) {
        super(message) // This is coming from parent class Error
        this.code = code
    }
}