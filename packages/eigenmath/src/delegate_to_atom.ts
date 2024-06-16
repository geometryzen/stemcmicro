import { Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { ProgramStack } from "@stemcmicro/stack";
import { Atom, Cons } from "@stemcmicro/tree";

export function delegate_to_atom(atom: Atom, opr: Sym, argList: Cons, env: ExprContext, $: ProgramStack): void {
    const handler = env.handlerFor(atom);
    const value = handler.dispatch(atom, opr, argList, env);
    try {
        $.push(value);
    } finally {
        value.release();
    }
}
