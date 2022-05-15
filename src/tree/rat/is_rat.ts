import { Rat } from "./Rat";

export function is_rat(p: unknown): p is Rat {
    return p instanceof Rat;
}
