import { car, cdr, Cons, U } from "@stemcmicro/tree";

export function caar(p: U): U {
    return car(car(p));
}

export function cadr(p: U): U {
    return car(cdr(p));
}

export function cdar(p: U): U {
    return cdr(car(p));
}

export function cddr(p: U): Cons {
    return cdr(cdr(p));
}

export function caadr(p: U): U {
    return car(car(cdr(p)));
}

export function caddr(p: U): U {
    return car(cdr(cdr(p)));
}

export function cadar(p: U): U {
    return car(cdr(car(p)));
}

export function cdadr(p: U): U {
    return cdr(car(cdr(p)));
}

export function cddar(p: U): U {
    return cdr(cdr(car(p)));
}

export function cdddr(p: U): Cons {
    return cdr(cdr(cdr(p)));
}

export function caaddr(p: U): U {
    return car(car(cdr(cdr(p))));
}

export function cadadr(p: U): U {
    return car(cdr(car(cdr(p))));
}

export function caddar(p: U): U {
    return car(cdr(cdr(car(p))));
}

export function cdaddr(p: U): Cons {
    return cdr(car(cdr(cdr(p))));
}

export function cadddr(p: U): U {
    return car(cdr(cdr(cdr(p))));
}

export function cddddr(p: U): Cons {
    return cdr(cdr(cdr(cdr(p))));
}

export function caddddr(p: U): U {
    return car(cdr(cdr(cdr(cdr(p)))));
}

export function cadaddr(p: U): U {
    return car(cdr(car(cdr(cdr(p)))));
}

export function cddaddr(p: U): Cons {
    return cdr(cdr(car(cdr(cdr(p)))));
}

export function caddadr(p: U): U {
    return car(cdr(cdr(car(cdr(p)))));
}

export function cdddaddr(p: U): Cons {
    return cdr(cdr(cdr(car(cdr(cdr(p))))));
}

export function cdadaddr(p: U): Cons {
    return cdr(car(cdr(car(cdr(cdr(p))))));
}

export function caddaddr(p: U): U {
    return car(cdr(cdr(car(cdr(cdr(p))))));
}
