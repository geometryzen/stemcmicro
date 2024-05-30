import { Extension, ExtensionBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Ceiling();
    }
}

type ARG = Cons;

class Ceiling extends Function1<ARG> {
    constructor() {
        super("ceiling_cons", create_sym("ceiling"), is_cons);
    }
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const ceiling_cons = new Builder();
