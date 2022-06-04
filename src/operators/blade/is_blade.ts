import { Blade } from "../../tree/vec/Blade";

export function is_blade(arg: unknown): arg is Blade {
    // We have to use duck-typing because Vec is an interface, not a class.
    if (typeof arg === 'object') {
        const duck = arg as Blade;
        return duck.name === 'Blade';
    }
    else {
        return false;
    }
}
