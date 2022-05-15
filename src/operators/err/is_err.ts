import { Err } from "../../tree/err/Err";

export function is_err(p: unknown): p is Err {
    return p instanceof Err;
}
