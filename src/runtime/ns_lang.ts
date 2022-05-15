import { Sym } from "../tree/sym/Sym";

export const LANG_NAMESPACE = new Sym('lang');
/**
 * if
 */
export const LANG_IF = new Sym('if', LANG_NAMESPACE);
/**
 * nil() => NIL
 */
export const LANG_NIL = new Sym('nil', LANG_NAMESPACE);
/**
 * false
 */
export const LANG_FALSE = new Sym('false', LANG_NAMESPACE);
/**
 * true
 */
export const LANG_TRUE = new Sym('true', LANG_NAMESPACE);
/**
 * undefined
 */
export const LANG_UNDEFINED = new Sym('undefined', LANG_NAMESPACE);
/**
 * ':='
 */
export const LANG_COLON_EQ = new Sym(':=', LANG_NAMESPACE);
