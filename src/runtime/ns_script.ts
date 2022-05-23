import { Sym } from "../tree/sym/Sym";


/**
 * 'script'
 */
export const SCRIPT_NAMESPACE = new Sym('script');

/**
 * 'script.last'
 */
export const NAME_SCRIPT_LAST = new Sym('last', SCRIPT_NAMESPACE);
