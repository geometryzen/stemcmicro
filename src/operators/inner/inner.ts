
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { MATH_INNER } from "../../runtime/ns_math";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Inner($);
    }
}

class Inner extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inner_extension', MATH_INNER, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        // console.lg(this.name, render_as_sexpr(expr, $));
        const hook = (where: string, retval: U): U => {
            // console.lg(this.name, where, decodeMode($.getMode()), render_as_infix(expr, this.$), "=>", render_as_infix(retval, $));
            // console.lg(this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        if ($.isExpanding()) {
            return [TFLAG_NONE, hook('A', expr)];
        }
        else if ($.isFactoring()) {
            return [TFLAG_NONE, hook('B', expr)];
        }
        else {
            throw new Error();
        }
    }
}

export const inner_extension = new Builder();
