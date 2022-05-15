import { Sym } from "../tree/sym/Sym";


/**
 * 'script'
 */
export const SCRIPT_NAMESPACE = new Sym('script');

/**
 * 'script.last'
 */
export const NAME_SCRIPT_LAST = new Sym('last', SCRIPT_NAMESPACE);
export const NAME_SCRIPT_METAA = new Sym('$METAA', SCRIPT_NAMESPACE);
export const NAME_SCRIPT_METAB = new Sym('$METAB', SCRIPT_NAMESPACE);
export const NAME_SCRIPT_METAX = new Sym('$METAX', SCRIPT_NAMESPACE);
