import { SystemError } from "../../runtime/SystemError";
import { U } from "../tree";
import { Boo } from "./Boo";
import { is_boo } from "./is_boo";

export function assert_boo(expr: U): Boo {
    if (is_boo(expr)) {
        return expr;
    }
    else {
        throw new SystemError(`Expecting a Booi but got expression ${expr}.`);
    }
}