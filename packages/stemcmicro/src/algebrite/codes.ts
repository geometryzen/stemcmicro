import { TokenCode } from "./Token";

const next_code = (function (startCode: number) {
    let nextCode = startCode;
    return function (text: string): TokenCode {
        return { text, code: nextCode++ };
    };
})(1001);

export const T_INT = next_code("Int"); // 1001
export const T_FLT = next_code("Flt"); // 1002
/**
 * 1003
 */
export const T_SYM = next_code("Sym"); // 1003
/**
 * 1004
 */
export const T_KEYWORD = next_code("Keyword"); // 1004
export const T_FUNCTION = next_code("Function"); // 1005
export const T_MINUS = next_code("-"); // 1006
export const T_NEWLINE = next_code("NewLine"); // 1007
export const T_PLUS = next_code("+"); // 1008
export const T_STR = next_code("Str"); // 1009
export const T_GTEQ = next_code(">="); // 1010
export const T_GTGT = next_code(">>"); // 1011
export const T_LTEQ = next_code("<="); // 1012
export const T_LTLT = next_code("<<"); // 1013
export const T_LT = next_code("<"); // 1014
export const T_GT = next_code(">"); // 1015
export const T_ASTRX = next_code("*"); // 1016
export const T_FWDSLASH = next_code("/"); // 1017
export const T_LPAR = next_code("("); // 1018
export const T_RPAR = next_code(")"); // 1019
export const T_MIDDLE_DOT = next_code("·"); // 1020
export const T_EQ_EQ = next_code("=="); // 1021
export const T_NTEQ = next_code("!="); // 1022
export const T_COLON = next_code(":"); // 1023
export const T_COLON_EQ = next_code(":="); // 1024
export const T_EQ = next_code("="); // 1025
export const T_ASTRX_ASTRX = next_code("**"); // 1026
export const T_CARET = next_code("^"); // 1027
export const T_VBAR = next_code("|"); // 1028
export const T_END = next_code("End"); // 1029
export const T_COMMA = next_code(","); // 1030
export const T_LSQB = next_code("["); // 1031
export const T_RSQB = next_code("]"); // 1032
/**
 * 1033
 */
export const T_LCURLY = next_code("{"); // 1033
/**
 * 1034
 */
export const T_RCURLY = next_code("}"); // 1034
export const T_BANG = next_code("!"); // 1035
