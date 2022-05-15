import { Boo } from "./Boo";

export function is_boo(p: unknown): p is Boo {
    return p instanceof Boo;
}
