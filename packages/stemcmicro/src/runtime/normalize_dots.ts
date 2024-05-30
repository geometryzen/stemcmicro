// there are around a dozen different unicodes that
// represent some form of middle dot, let's catch the most

import { MIDDLE_DOT_STRING } from "./constants";

/**
 * Converts the various representations of middle dots embedded in text to a canonical MIDDLE_DOT_STRING.
 * @param text Contains the embedded middle dots in various forms.
 */
export function normalize_unicode_dots(text: string): string {
    let str = text;
    str = str.replace(new RegExp(String.fromCharCode(8901), "g"), MIDDLE_DOT_STRING);
    str = str.replace(new RegExp(String.fromCharCode(8226), "g"), MIDDLE_DOT_STRING);
    str = str.replace(new RegExp(String.fromCharCode(12539), "g"), MIDDLE_DOT_STRING);
    str = str.replace(new RegExp(String.fromCharCode(55296), "g"), MIDDLE_DOT_STRING);
    str = str.replace(new RegExp(String.fromCharCode(65381), "g"), MIDDLE_DOT_STRING);
    return str;
}
