import { Rat } from "../../tree/rat/Rat";

export function is_rat(p: unknown): p is Rat {
    return p instanceof Rat;
}
