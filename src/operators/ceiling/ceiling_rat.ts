import { create_sym, is_rat, Rat, Sym } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function1 } from "../helpers/Function1";

class CeilingRat extends Function1<Rat> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('ceiling_rat', create_sym('ceiling'), is_rat);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.ceiling()];
    }
}

export const ceiling_rat = make_extension_builder(CeilingRat);
