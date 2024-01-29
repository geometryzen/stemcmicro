import { assert_map, assert_sym, assert_tensor, is_map, is_tensor, Map, Str, Sym, Tensor } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, items_to_cons, nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Err } from "../../tree/err/Err";
import { is_err } from "../err/is_err";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_str } from "../str/is_str";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        const DEFN = native_sym(Native.defn);
        try {
            return new Op($, DEFN);
        }
        finally {
            DEFN.release();
        }
    }
}

function split_defn_args(expr: Cons): [name: Sym, doc: Str | U, attrMap: Map | U, params: Tensor<U>, prepost: U, body: U] {
    const argList = expr.argList;
    try {
        const name = assert_sym(argList.item(0));
        const item1 = argList.item(1);
        const item2 = argList.item(2);
        const n = argList.length;
        switch (n) {
            case 3: {
                return [name, nil, nil, assert_tensor(item1), nil, item2];
            }
            case 4: {
                const item3 = argList.item(3);
                if (is_str(item1)) {
                    return [name, item1, nil, assert_tensor(item2), nil, item3];
                }
                else if (is_map(item1)) {
                    return [name, nil, assert_map(item1), assert_tensor(item2), nil, item3];
                }
                else {
                    throw new Err(new Str(`Unexpected item 1 for defn`));
                }
            }
            case 5: {
                const item3 = argList.item(3);
                const item4 = argList.item(4);
                if (is_str(item1)) {
                    if (is_tensor(item2)) {
                        // item3 should be a Map.
                        return [name, item1, nil, assert_tensor(item2), item3, item4];
                    }
                    else {
                        return [name, item1, item2, assert_tensor(item3), nil, item4];
                    }
                }
                else if (is_map(item1)) {
                    return [name, nil, item1, assert_tensor(item2), item3, item4];
                }
                else {
                    throw new Err(new Str(`Unexpected item 1 ${item1} for defn`));
                }
            }
            case 6: {
                const item3 = argList.item(3);
                const item4 = argList.item(4);
                const item5 = argList.item(5);
                if (is_str(item1)) {
                    return [name, item1, item2, assert_tensor(item3), item4, item5];
                }
                else {
                    throw new Err(new Str(`Unexpected item 1 ${item1} for defn`));
                }
            }
            default: {
                throw new Err(new Str(`Unexpected number of arguments (${n}) for defn`));
            }
        }
    }
    finally {
        argList.release();
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Eval_defn(expr: Cons, $: ExtensionEnv): U {
    try {
        const [name, doc, attrMap, params, prepostMap, body] = split_defn_args(expr);
        try {
            const DEF = native_sym(Native.def);
            const FN = native_sym(Native.fn);
            try {
                const retval = $.valueOf(items_to_cons(DEF, name, items_to_cons(FN, params, body)));
                return retval;
            }
            finally {
                DEF.release();
                FN.release();
            }
        }
        finally {
            name.release();
            doc.release();
            attrMap.release();
            params.release();
            prepostMap.release();
            body.release();
        }
    }
    catch (e) {
        if (is_err(e)) {
            return e;
        }
        else {
            throw e;
        }
    }
}

/**
 * [name doc-string? attr-map? [params*] prepost-map? body]
 * [name doc-string? attr-map? ([params*] prepost-map? body) + attr-map?]
 */
class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv, DEFN: Sym) {
        super('defn', DEFN, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_defn(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const defn_builder = new Builder();

