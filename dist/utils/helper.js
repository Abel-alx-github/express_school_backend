"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format_date = void 0;
const format_date = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};
exports.format_date = format_date;
