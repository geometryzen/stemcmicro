import { is_nil } from "math-expression-tree";
import { Concept, ExprEngine } from "../api/api";
import { iszero } from "./iszero";

export function should_engine_render_svg($: ExprEngine): boolean {
    const sym = $.symbol(Concept.TTY);
    const tty = $.getBinding(sym);
    if (is_nil(tty)) {
        // Unbound in Native engine.
        return true;
    }
    else if (tty.equals(sym)) {
        // Unbound in Eigenmath engine.
        return true;
    }
    else if (iszero(tty)) {
        // Bound to zero.
        return true;
    }
    else {
        return false;
    }
}
