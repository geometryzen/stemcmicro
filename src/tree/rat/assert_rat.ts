import { SystemError } from "../../runtime/SystemError";
import { U } from "../tree";
import { is_rat } from "./is_rat";
import { Rat } from "./Rat";

export function assert_rat(expr: U): Rat {
    if (is_rat(expr)) {
        return expr;
    }
    else {
        throw new SystemError(`Expecting a Rat but got expression ${expr}.`);
    }
}