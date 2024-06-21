/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "@stemcmicro/atoms";
import { ExprContext, LambdaExpr } from "@stemcmicro/context";
import { hash_info } from "@stemcmicro/hashing";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";
import { Scope, Thing } from "./Stepper";

/**
 * Having both a BaseEnv as well as a DerivedEnv is a relic of using ExtensionEnv.
 */
export class BaseEnv implements Scope {
    readonly #hash_to_lambda: Map<string, LambdaExpr> = new Map();
    #coreEnv: ExprContext;
    constructor(
        coreEnv: ExprContext,
        readonly thing: Thing
    ) {
        this.#coreEnv = coreEnv;
    }
    evaluate(opr: Native, ...args: U[]): U {
        const expr = items_to_cons(native_sym(opr), ...args);
        const hashes: string[] = hash_info(expr);
        for (const hash of hashes) {
            if (this.#hash_to_lambda.has(hash)) {
                const lambda = this.#hash_to_lambda.get(hash);
                lambda(items_to_cons(...args), this.#coreEnv);
            }
        }
        switch (opr) {
            case Native.add: {
                throw new Error(`BaseEnv.evaluate + ${args} Method not implemented. ${hashes}`);
            }
        }
        throw new Error(`BaseEnv.evaluate ${opr} ${args} Method not implemented.`);
    }
    hasBinding(sym: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    getBinding(sym: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    setBinding(sym: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    hasUserFunction(sym: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    getUserFunction(sym: Sym): U {
        throw new Error("Method not implemented.");
    }
    setUserFunction(sym: Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: U): U {
        return this.#coreEnv.valueOf(expr);
    }
}
