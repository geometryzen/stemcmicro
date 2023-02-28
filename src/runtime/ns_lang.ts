import { create_sym } from "../tree/sym/Sym";

/**
 * if
 */
export const LANG_IF = create_sym('if');
/**
 * nil() => NIL
 */
export const LANG_NIL = create_sym('nil');
/**
 * false
 */
export const LANG_FALSE = create_sym('false');
/**
 * true
 */
export const LANG_TRUE = create_sym('true');
/**
 * undefined
 */
export const LANG_UNDEFINED = create_sym('undefined');
/**
 * ':='
 */
export const LANG_COLON_EQ = create_sym(':=');
