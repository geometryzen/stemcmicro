import { is_sym, Sym } from "math-expression-atoms";
import { LambdaExpr } from "math-expression-context";
import { Cons, is_cons, U } from "math-expression-tree";
import { hash_nonop_cons } from "../hashing/hash_info";
import { FunctionVarArgs } from "../operators/helpers/FunctionVarArgs";
import { ConsExpr, ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";

class PluggableBuilder implements OperatorBuilder<U> {
    constructor(private readonly opr: Sym, private readonly hash: string, private readonly evaluator: ConsExpr) {
    }
    create($: ExtensionEnv): Operator<U> {
        return new PluggableOperator(this.opr, this.hash, this.evaluator, $);
    }
}

class PluggableOperator extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor(opr: Sym, hash: string, private readonly evaluator: ConsExpr, $: ExtensionEnv) {
        super(opr.key(), opr, $);
        // console.lg("constructor PluggableOperator", "opr", `${opr}`, "hash", `${hash}`);
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

export function operator_from_cons_expression(opr: Sym, transformer: ConsExpr): OperatorBuilder<U> {
    const hash = hash_nonop_cons(opr);
    return new PluggableBuilder(opr, hash, transformer);
}

export function operator_from_lambda_expression(match: U, lambda: LambdaExpr): OperatorBuilder<U> {
    const opr = opr_from_match(match);
    const hash = hash_from_match(match);
    const transformer = transformer_from_lambda(lambda);
    return new PluggableBuilder(opr, hash, transformer);
}

export function opr_from_match(match: U): Sym {
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

export function hash_from_match(pattern: U): string {
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

function transformer_from_lambda(lambda: LambdaExpr): ConsExpr {
    return function (expr: Cons, $: ExtensionEnv) {
        // The lambda operates on the argument list.
        // The arguments in the argument list are not evaluated.
        return lambda(expr.argList, $);
    };
}
