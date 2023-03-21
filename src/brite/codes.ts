import { TokenCode } from "./Token";

const next_code = function (startCode: number) {
    let nextCode = startCode;
    return function (text: string): TokenCode {
        return { text, code: nextCode++ };
    };
}(1001);

export const T_INT = next_code('Int');
export const T_FLT = next_code('Flt');
export const T_SYM = next_code('Sym');
export const T_FUNCTION = next_code('Function');
export const T_MINUS = next_code('-');
export const T_NEWLINE = next_code('NewLine');
export const T_PLUS = next_code('+');
export const T_STR = next_code('Str');
export const T_GTEQ = next_code('>=');
export const T_GTGT = next_code('>>');
export const T_LTEQ = next_code('<=');
export const T_LTLT = next_code('<<');
export const T_LT = next_code('<');
export const T_GT = next_code('>');
export const T_ASTRX = next_code('*');
export const T_FWDSLASH = next_code('/');
export const T_LPAR = next_code('(');
export const T_RPAR = next_code(')');
export const T_MIDDLE_DOT = next_code('·');
export const T_EQ_EQ = next_code('==');
export const T_NTEQ = next_code('!=');
export const T_COLON = next_code(':');
export const T_COLON_EQ = next_code(':=');
export const T_EQ = next_code('=');
export const T_ASTRX_ASTRX = next_code('**');
export const T_CARET = next_code('^');
export const T_VBAR = next_code('|');
export const T_END = next_code('End');
export const T_COMMA = next_code(',');
export const T_LSQB = next_code('[');
export const T_RSQB = next_code(']');
export const T_BANG = next_code('!');
