import { create_boo, create_flt, create_sym, is_jsobject, Str, Sym } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        const DOTDOT = create_sym("..");
        try {
            return new DotDotOperator($, DOTDOT);
        }
        finally {
            DOTDOT.release();
        }
    }
}

export function Eval_dotdot(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const arg0 = argList.item(0);
        try {
            const val0 = $.valueOf(arg0);
            try {
                if (is_jsobject(val0)) {
                    const obj = val0.obj;
                    const props = argList.tail();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let value = (obj as unknown as any);
                    for (let i = 0; i < props.length; i++) {
                        const prop = props[i];
                        if (is_sym(prop)) {
                            const key = prop.key();
                            if (key.startsWith("-")) {
                                const name = key.slice(1);
                                value = value[name];
                            }
                            else {
                                // eslint-disable-next-line no-console
                                console.warn("key", `${key}`);
                                throw new ProgrammingError();
                            }
                        }
                        else {
                            // eslint-disable-next-line no-console
                            console.warn("prop", `${prop}`);
                            throw new ProgrammingError();
                        }
                    }
                    if (typeof value === 'boolean') {
                        return create_boo(value);
                    }
                    else if (typeof value === 'number') {
                        return create_flt(value);
                    }
                    else if (typeof value === 'string') {
                        return new Str(value);
                    }
                    else {
                        // eslint-disable-next-line no-console
                        console.warn("JavaScript to U", `${value}`);
                        throw new ProgrammingError();
                    }
                }
                else {
                    // eslint-disable-next-line no-console
                    console.warn("val0", `${val0}`);
                    throw new ProgrammingError();
                }
            }
            finally {
                val0.release();
            }
        }
        finally {
            arg0.release();
        }
    }
    finally {
        argList.release();
    }
}

/**
 * (.. e -target -value)
 */
class DotDotOperator extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv, DOTDOT: Sym) {
        super('dotdot', DOTDOT, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override evaluate(argList: Cons): [TFLAGS, U] {
        throw new ProgrammingError();
    }
    override valueOf(expr: Cons): U {
        return Eval_dotdot(expr, this.$);
    }
    override transform(expr: Cons): [number, U] {
        const $ = this.$;
        // console.lg(this.name, render_as_sexpr(expr, $));
        const hook = (where: string, retval: U): U => {
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_infix(expr, this.$), "=>", render_as_infix(retval, $));
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        const retval = Eval_dotdot(expr, $);
        const flag = retval.equals(expr) ? TFLAG_NONE : TFLAG_DIFF;
        return [flag, hook('A', retval)];
    }
}

export const dotdot_builder = new Builder();
