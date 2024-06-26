import { half, two } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { has_clock_form, has_exp_form } from "../../runtime/find";
import { imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { simplify_trig } from "../simplify/simplify";

const ABS = native_sym(Native.abs);
const ADD = native_sym(Native.add);

/**
 * abs(a + b + ...)
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ABS, ADD);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, addExpr: Cons, absExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, $.toInfixString(addExpr));
        // console.lg("abs", $.toInfixString(expr));
        // TODO: If it looks vaguely like a complex number perhaps?
        // The conditions essentially say that we are trying to create an expression stripped of any for of imaginary unit.
        // It may be better to ask if the expression is complex and not real. This would engage the extension system.
        if (has_clock_form(addExpr, addExpr, $) || has_exp_form(addExpr, $) || addExpr.contains(imu)) {
            // console.lg(`z? => ${$.toInfixString(expr)}`);

            const z = addExpr;
            // const z = rect(expr, $); // convert polar terms, if any

            // console.lg(`z => ${$.toInfixString(z)}`);

            const x = $.re(z);
            // console.lg("x", $.toInfixString(x));
            const y = $.im(z);
            // console.lg("y", $.toInfixString(y));
            const xx = $.power(x, two);
            const yy = $.power(y, two);
            const zz = $.add(xx, yy);
            const abs_z = $.power(zz, half);
            // console.lg(`x => ${$.toInfixString(x)}`)
            // console.lg(`y => ${$.toInfixString(y)}`)
            const retval = simplify_trig(abs_z, $);
            return [TFLAG_DIFF, retval];
        }
        if ($.getDirective(Directive.expandAbsSum)) {
            if (addExpr.tail().every($.isreal)) {
                return [TFLAG_DIFF, $.power(addExpr, two)];
            }
        }
        // TODO: Note that this does not try to expand the abs of a real sum.
        return [TFLAG_NONE, absExpr];
    }
}

export const abs_add = mkbuilder(Op);
