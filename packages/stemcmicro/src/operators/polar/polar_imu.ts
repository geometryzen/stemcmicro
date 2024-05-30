import { Imu, is_imu, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons1, U } from "math-expression-tree";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { half } from "../../tree/rat/Rat";
import { Function1 } from "../helpers/Function1";

const PI = native_sym(Native.PI);
const POLAR = native_sym(Native.polar);

type ARG = Imu;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor() {
        super("polar_imu", POLAR, is_imu);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.exp($.multiply(half, PI))];
    }
}

export const polar_imu = mkbuilder<EXP>(Op);
