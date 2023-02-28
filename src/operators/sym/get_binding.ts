import { ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
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
    // console.lg("get_binding", render_as_infix(sym, $), "is", render_as_infix(binding, $));

    if (is_nil(binding)) {
        return [TFLAG_NONE, sym];
    }

    if (!sym.equals(binding)) {
        return [TFLAG_DIFF, binding];
    }
    else {
        return [TFLAG_NONE, sym];
    }
}