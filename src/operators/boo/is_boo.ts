import { Boo } from "../../tree/boo/Boo";

export function is_boo(p: unknown): p is Boo {
    return p instanceof Boo;
}
