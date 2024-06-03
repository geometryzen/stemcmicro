import { car, cdr } from "./car-cdr-1";
import { U } from "./tree";

export function cadadr(p: U): U {
    return car(cdr(car(cdr(p))));
}

export function cadddr(p: U): U {
    return car(cdr(cdr(cdr(p))));
}
