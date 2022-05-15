import { CHANGED, ExtensionEnv, NOFLAGS, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_nil, U } from "../../tree/tree";

/**
 * Looks up the binding in the symbol table, with some additional behavior.
 * 1. If the binding is NIL, the sym is returned and changed is false.
 * 2. If the binding is simply the symbol itself, return sym and changed is false.
 * 3. If the binding exists and is not the same as sym, returns the binding and changed is true.
 * @param sym The symbol for which the binding is required.
 */
export function get_binding(sym: Sym, $: ExtensionEnv): [changed: TFLAGS, retval: U] {
    const binding = $.getBinding(sym);

    if (is_nil(binding)) {
        return [NOFLAGS, sym];
    }

    if (!sym.equals(binding)) {
        return [CHANGED, binding];
    }
    else {
        return [NOFLAGS, sym];
    }
}