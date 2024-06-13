import { booF, Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { ISREAL } from "../../runtime/constants";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

class IsRealAny extends Function1<U> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("is_real_any", ISREAL, is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: U): [TFLAGS, U] {
        // We could use fuzzy logic here...
        return [TFLAG_DIFF, booF];
    }
}

export const is_real_any = mkbuilder(IsRealAny);
