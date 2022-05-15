import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { is_add } from "../add/is_add";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { cosine_of_angle } from "./cosine_of_angle";
import { cosine_of_angle_sum } from "./cosine_of_angle_sum";
import { MATH_COS } from "./MATH_COS";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new CosAny($);
    }
}

class CosAny extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('cos_any', MATH_COS, is_any, $);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        if (is_cons(arg) && is_add(arg)) {
            return [CHANGED, cosine_of_angle_sum(arg, this.$)];
        }
        else {
            return [NOFLAGS, cosine_of_angle(arg, this.$)];
        }
    }
}

export const cos_any = new Builder();
