/* eslint-disable @typescript-eslint/no-unused-vars */
import { is_rat, is_sym, Sym } from "@stemcmicro/atoms";
import { Native } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";
import { Scope, Thing } from "./Stepper";

export class DerivedScope implements Scope {
    #bindings: Map<string, U> = new Map();
    #usrfuncs: Map<Sym, U> = new Map();
    constructor(
        readonly parentEnv: Scope,
        readonly strict: boolean,
        readonly thing: Thing
    ) {}
    evaluate(opr: Native, ...args: U[]): U {
        return this.parentEnv.evaluate(opr, ...args);
    }
    hasBinding(sym: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    getBinding(sym: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    setBinding(sym: Sym, binding: U): void {
        this.#bindings.set(sym.key(), binding);
        // throw new Error(`DerivedEnv.setBinding ${sym} ${binding} Method not implemented.`);
    }
    hasUserFunction(sym: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    getUserFunction(sym: Sym): U {
        throw new Error("Method not implemented.");
    }
    setUserFunction(sym: Sym, usrfunc: U): void {
        this.#usrfuncs.set(sym, usrfunc);
        // throw new Error(`DerivedEnv.setUserFunction ${sym} ${usrfunc} Method not implemented.`);
    }
    valueOf(expr: U): U {
        if (is_rat(expr)) {
            return expr;
        }
        if (is_sym(expr)) {
            if (this.#bindings.has(expr.key())) {
                return this.#bindings.get(expr.key());
            }
        }
        throw new Error(`valueOf(${expr}) DerivedEnv.valueOf Method not implemented.`);
    }
}
