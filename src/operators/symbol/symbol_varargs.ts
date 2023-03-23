import { ExtensionEnv, Operator, OperatorBuilder, Predicates, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_nonop_cons, HASH_STR, HASH_TENSOR } from "../../hashing/hash_info";
import { convert_tensor_to_primitives } from "../../helpers/convert_tensor_to_primitives";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_sym } from "../../tree/sym/Sym";
import { Cons, is_nil, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_str } from "../str/is_str";
import { is_tensor } from "../tensor/is_tensor";

const SYMBOL = native_sym(Native.symbol);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('symbol_varargs', SYMBOL, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(symbolExpr: Cons): [number, U] {
        const $ = this.$;
        const argList = symbolExpr.argList;
        const descriptionStr = $.valueOf(argList.head);
        if (is_str(descriptionStr)) {
            const predicatesTensor = argList.cdr.head;
            if (is_nil(predicatesTensor)) {
                return [TFLAG_DIFF, create_sym(descriptionStr.str)];
            }
            else {
                if (is_tensor(predicatesTensor)) {
                    const primitives = convert_tensor_to_primitives(predicatesTensor);
                    const sym = create_sym(descriptionStr.str);
                    $.setSymbolPredicates(sym, primitives_to_predicates(primitives));
                    return [TFLAG_DIFF, sym];
                }
                else {
                    throw new Error(`predicates must be a ${HASH_TENSOR}`);
                }
            }
        }
        else {
            throw new Error(`description must be a ${HASH_STR}`);
        }
    }
}

function primitives_to_predicates(primitives: (boolean | string)[]): Partial<Predicates> {
    const predicates: Partial<Predicates> = {};
    const pairs = primitives_to_pairs(primitives);
    for (const [name, value] of pairs) {
        switch (name) {
            case "finite": {
                predicates.finite = value;
                break;
            }
            case "infinite": {
                predicates.infinite = value;
                break;
            }
            default: {
                throw new Error(`Unexpected predicate: ${JSON.stringify(name)}`);
            }
        }
    }
    return predicates;
}

function primitives_to_pairs(primitives: (boolean | string)[]): [string, boolean][] {
    const pairs: [string, boolean][] = [];
    const count = primitives.length / 2;
    for (let i = 0; i < count; i++) {
        const lhs = primitives[i * 2 + 0];
        const rhs = primitives[i * 2 + 1];
        if (typeof lhs !== 'string') {
            throw new Error();
        }
        if (typeof rhs !== 'boolean') {
            throw new Error();
        }
        pairs.push([lhs, rhs]);
    }
    return pairs;
}

export const symbol_varargs = new Builder();
