import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_vec } from "../../tree/vec/Algebra";
import { Blade } from "../../tree/vec/Blade";
import { TYPE_NAME_BLADE } from "../blade/TYPE_NAME_BLADE";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new TypeofAny($);
    }
}

class TypeofAny extends Function1<Blade> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('typeof_blade', new Sym('typeof'), is_vec, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Blade, expr: UCons<Sym, Blade>): [TFLAGS, U] {
        return [TFLAG_DIFF, TYPE_NAME_BLADE];
    }
}

export const typeof_blade = new Builder();
