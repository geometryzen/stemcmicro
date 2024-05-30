import { Rat } from "math-expression-atoms";

export function is_two(num: Rat): num is Rat {
    return num.isTwo();
}
