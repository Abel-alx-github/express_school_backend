"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}
exports.DatabaseError = DatabaseError;
