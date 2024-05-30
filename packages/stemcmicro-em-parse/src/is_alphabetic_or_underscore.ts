import { is_digit } from "./is_digit";

function is_alphabetic_or_underscore(str: string): boolean {
    if (str == null) {
        return false;
    }
    if (str === "") {
        return false;
    }
    // Check for non-alphabetic characters and space
    return str.search(/[^A-Za-z_]/) === -1;
}

export function is_alphanumeric_or_underscore(str: string): boolean {
    if (str == null) {
        return false;
    }
    if (str === "") {
        return false;
    }
    // console.lg(`is_alphabetic_or_underscore(str = ${JSON.stringify(str)}) length is ${str.length}`);
    return is_alphabetic_or_underscore(str) || is_digit(str);
}
