import { is_sym, Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { ProgrammingError } from "../../programming/ProgrammingError";

export function assert_sym(expr: U): Sym {
    if (is_sym(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new ProgrammingError(`Ex`);
    }
}
