
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_TENSOR } from "../../hashing/hash_info";
import { MAXDIM } from "../../runtime/constants";
import { halt } from "../../runtime/defs";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_tensor } from "../tensor/is_tensor";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export function outer_tensor_tensor(p1: Tensor, p2: Tensor, $: ExtensionEnv): U {
    const ndim = p1.ndim + p2.ndim;
    if (ndim > MAXDIM) {
        halt('outer: rank of result exceeds maximum');
    }

    const dims = [...p1.copyDimensions(), ...p2.copyDimensions()];

    const elems: U[] = [];
    let k = 0;
    for (let i = 0; i < p1.nelem; i++) {
        for (let j = 0; j < p2.nelem; j++) {
            elems[k++] = $.multiply(p1.elem(i), p2.elem(j));
        }
    }

    return new Tensor(dims, elems);
}

type LHS = Tensor;
type RHS = Tensor;
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv) {
        super('outer_2_tensor_tensor', MATH_OUTER, is_tensor, is_tensor, $);
        this.#hash = hash_binop_atom_atom(MATH_OUTER, HASH_TENSOR, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, outer_tensor_tensor(lhs, rhs, $)];
    }
}

export const outer_2_tensor_tensor = new Builder();
