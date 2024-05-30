import { create_sym } from "@stemcmicro/atoms";

export const QUOTE = create_sym("quote");

export const TRANSPOSE = create_sym("transpose");

export const TRANSPOSE_CHAR_CODE = 7488;
export const TRANSPOSE_STRING = String.fromCharCode(TRANSPOSE_CHAR_CODE);
export const TRANSPOSE_REGEX_GLOBAL = new RegExp(TRANSPOSE_STRING, "g");

/**
 * Middle or Center Dot. 183 = 0xB7
 */
export const MIDDLE_DOT_CHAR_CODE = 183;
export const MIDDLE_DOT_STRING = String.fromCharCode(MIDDLE_DOT_CHAR_CODE);
export const MIDDLE_DOT_REGEX_GLOBAL = new RegExp(MIDDLE_DOT_STRING, "g");
