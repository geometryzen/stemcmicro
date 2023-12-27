import { cons, nil, U } from "math-expression-tree";
import { Stack } from "./Stack";

/**
 * A stack of expressions that can be used to support evaluation.
 */
export class StackU extends Stack<U> {
    list(n: number): void {
        this.push(nil);
        for (let i = 0; i < n; i++) {
            const arg2 = this.pop();
            const arg1 = this.pop();
            this.push(cons(arg1, arg2));
        }
    }
}