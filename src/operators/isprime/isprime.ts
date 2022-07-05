import { ExtensionEnv } from '../../env/ExtensionEnv';
import { isnonnegativeinteger } from '../../is';
import { mprime } from './mprime';
import { cadr } from '../../tree/helpers';
import { one, zero } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';

export function Eval_isprime(p1: U, $: ExtensionEnv): U {
    return isprime($.valueOf(cadr(p1)));
}

function isprime(p1: U): U {
    if (isnonnegativeinteger(p1) && mprime(p1.a)) {
        return one;
    }
    return zero;
}
