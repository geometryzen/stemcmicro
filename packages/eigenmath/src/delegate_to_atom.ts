import { Sym } from "@stemcmicro/atoms";
import { ProgramControl, ProgramEnv, ProgramStack } from "@stemcmicro/stack";
import { Atom, Cons } from "@stemcmicro/tree";
import { ExprContextFromProgram } from "./ExprContextFromProgram";

export function delegate_to_atom(atom: Atom, opr: Sym, argList: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const context = new ExprContextFromProgram(env, ctrl);
    try {
        const handler = env.handlerFor(atom);
        const mag_atom = handler.dispatch(atom, opr, argList, context);
        try {
            $.push(mag_atom);
        } finally {
            mag_atom.release();
        }
    } finally {
        context.release();
    }
}
