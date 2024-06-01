import { is_sym, Sym } from "@stemcmicro/atoms";
import { Cons2, items_to_cons, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { diffFlag, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { ASSIGN } from "../../runtime/constants";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = Sym;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (= Sym U)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("assign_sym_any", ASSIGN, is_sym, is_any);
        this.#hash = hash_binop_atom_atom(ASSIGN, HASH_SYM, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        const m = this.match(expr, $);
        if (m) {
            // Unlike the base class, we do not evaluate the left hand side (var) of the assignment.
            const [flagsR, rhs] = $.transform(m.rhs);
            if (diffFlag(flagsR)) {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(m.opr, m.lhs, rhs))];
            } else {
                return this.transform2(m.opr, m.lhs, m.rhs, m, $);
            }
        }
        return [TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: Sym, rhs: U, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        $.setBinding(lhs, rhs);
        // Assignments return NIL to prevent them from being printed.
        // That's a bit unfortunate for chained assignments.
        // The kernel of the problem is the printing of expressions by default in the REPL.
        return [TFLAG_DIFF, nil];
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        const lhs: Sym = expr.lhs;
        const rhs = expr.rhs;
        try {
            const binding = $.valueOf(rhs);
            try {
                $.setBinding(lhs, binding);
                return nil;
            } finally {
                binding.release();
            }
        } finally {
            lhs.release();
            rhs.release();
        }
    }
}

export const assign_sym_any = mkbuilder<EXP>(Op);
