import { Cons, is_cons, U } from "math-expression-tree";
import { kronecker } from "../../eigenmath/eigenmath";
import { ProgramControl } from "../../eigenmath/ProgramControl";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { StackU } from "../../env/StackU";

class ProgramControlAdapter implements ProgramControl {
    #evalLevel = 0;
    #expanding = 1;

    constructor() {

    }
    get drawing(): number {
        throw new Error("Method not implemented.");
    }
    set drawing(drawing: number) {
        throw new Error("Method not implemented.");
    }
    get eval_level(): number {
        return this.#evalLevel;
    }
    set eval_level(eval_level: number) {
        this.#evalLevel = eval_level;
    }
    get expanding(): number {
        return this.#expanding;
    }
    set expanding(expanding: number) {
        this.#expanding = expanding;
    }
    get nonstop(): number {
        throw new Error("Method not implemented.");
    }
    set nonstop(nonstop: number) {
        throw new Error("Method not implemented.");
    }
}

/**
 * (kronecker a b ...)
 */
export function Eval_kronecker(expr: Cons, env: ExtensionEnv): U {
    const stack = new StackU();
    const ctrl = new ProgramControlAdapter();
    const argList = expr.argList;
    try {
        const a = argList.head;
        stack.push(env.valueOf(a));
        let bs = argList.rest;
        while (is_cons(bs)) {
            const b = bs.head;
            stack.push(env.valueOf(b));
            kronecker(env, ctrl, stack);
            bs = bs.rest;
        }
    }
    finally {
        argList.release();
    }
    return stack.pop();
}
