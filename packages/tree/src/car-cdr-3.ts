import { car, cdr } from "./car-cdr-1";
import { Cons, U } from "./tree";

export function caadr(p: U): U {
    return car(car(cdr(p)));
}

export function caddr(p: U): U {
    return car(cdr(cdr(p)));
}

export function cdddr(p: U): Cons {
    return cdr(cdr(cdr(p)));
}
