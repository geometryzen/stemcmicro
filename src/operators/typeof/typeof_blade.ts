import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_BLADE, hash_unaop_atom } from "../../hashing/hash_info";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_blade } from "../../tree/vec/Algebra";
import { Blade } from "../../tree/vec/Blade";
import { TYPE_NAME_BLADE } from "../blade/TYPE_NAME_BLADE";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Blade> implements Operator<Cons> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('typeof_blade', new Sym('typeof'), is_blade, $);
        this.hash = hash_unaop_atom(this.opr, HASH_BLADE);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Blade, expr: UCons<Sym, Blade>): [TFLAGS, U] {
        return [TFLAG_DIFF, TYPE_NAME_BLADE];
    }
}

export const typeof_blade = new Builder();
