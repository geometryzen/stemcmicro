import { hash_nonop_cons } from "../hashing/hash_info";
import { FunctionVarArgs } from "../operators/helpers/FunctionVarArgs";
import { is_sym } from "../operators/sym/is_sym";
import { Sym } from "../tree/sym/Sym";
import { Cons, is_cons, U } from "../tree/tree";
import { ExtensionEnv, LambdaExpr, LegacyExpr, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";

class PluggableBuilder implements OperatorBuilder<U> {
    constructor(private readonly opr: Sym, private readonly hash: string, private readonly evaluator: LegacyExpr) {
    }
    create($: ExtensionEnv): Operator<U> {
        return new PluggableOperator(this.opr, this.hash, this.evaluator, $);
    }
}

class PluggableOperator extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor(opr: Sym, hash: string, private readonly evaluator: LegacyExpr, $: ExtensionEnv) {
        super(opr.text, opr, $);
        this.#hash = hash;
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        // console.lg("PluggableOperator.transform", "name:", JSON.stringify(this.name), "expr:", render_as_sexpr(expr, $));
        const hook = (where: string, retval: U): U => {
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_infix(expr, this.$), "=>", render_as_infix(retval, $));
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        const retval = this.evaluator(expr, $);
        const flags = retval.equals(expr) ? TFLAG_NONE : TFLAG_DIFF;
        return [flags, hook('', retval)];
    }
}

export function operator_from_legacy_transformer(opr: Sym, transformer: LegacyExpr): OperatorBuilder<U> {
    const hash = hash_nonop_cons(opr);
    return new PluggableBuilder(opr, hash, transformer);
}

export function operator_from_modern_transformer(match: U, lambda: LambdaExpr): OperatorBuilder<U> {
    const opr = opr_from_match(match);
    const hash = hash_from_match(match);
    const transformer = transformer_from_lambda(lambda);
    return new PluggableBuilder(opr, hash, transformer);
}

function opr_from_match(match: U): Sym {
    if (is_cons(match)) {
        const head = match.head;
        if (is_sym(head)) {
            return head;
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}

function hash_from_match(pattern: U): string {
    if (is_cons(pattern)) {
        const opr = pattern.head;
        if (is_sym(opr)) {
            // TODO: More specific matching.
            // hash_unaop_atom
            return hash_nonop_cons(opr);
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}

function transformer_from_lambda(lambda: LambdaExpr): LegacyExpr {
    return function (expr: Cons, $: ExtensionEnv) {
        // The lambda operates on the argument list.
        // The arguments in the argument list are not evaluated.
        return lambda(expr.argList, $);
    };
}
