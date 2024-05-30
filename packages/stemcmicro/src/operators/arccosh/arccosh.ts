import { create_flt, is_flt, zero } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { car, Cons, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { COSH } from "../../runtime/constants";
import { halt } from "../../runtime/defs";
import { cadr } from "../../tree/helpers";

export function eval_arccosh(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const arg = argList.head;
        try {
            const x = $.valueOf(arg);
            try {
                return arccosh(x, $);
            } finally {
                x.release();
            }
        } finally {
            arg.release();
        }
    } finally {
        argList.release();
    }
}

function arccosh(x: U, env: ExtensionEnv): U {
    if (car(x).equals(COSH)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let { d } = x;
        if (d < 1.0) {
            halt("arccosh function argument is less than 1.0");
        }
        d = Math.log(d + Math.sqrt(d * d - 1.0));
        return create_flt(d);
    }

    if (env.isone(x)) {
        return zero;
    }

    /*
    const $ = new StackU();
    $.push(native_sym(Native.pow));     //  pow
    $.push(x);                          //  pow x
    $.push(create_int(2));              //  pow x 2
    list(3, $);                         //  x**2
    $.push(native_sym(Native.add));     //  x**2 + 
    swap($);                            //  + x**2
    $.push(create_int(-1));             //  + x**2 -1
    list(3, $);                         //  x**2-1
    $.push(native_sym(Native.sqrt));    //  x**2-1 sqrt
    swap($);                            //  sqrt x**2-1
    list(2, $);                         //  sqrt(x**2-1)
    $.push(native_sym(Native.add));     //  sqrt(x**2-1) + 
    swap($);                            //  + sqrt(x**2-1)
    $.push(x);                          //  + sqrt(x**2-1) x
    list(3, $);                         //  x+sqrt(x**2-1)
    $.push(native_sym(Native.log));     //  x+sqrt(x**2-1) log
    swap($);                            //  log x+sqrt(x**2-1)
    list(2, $);                         //  log(x+sqrt(x**2-1))
    value_of(env, env, $);              //  normalization             
    return $.pop();
    */
    return items_to_cons(native_sym(Native.arccosh), x);
}
