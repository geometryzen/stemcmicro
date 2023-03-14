import { ExtensionEnv } from '../../env/ExtensionEnv';
import { cadr } from '../../tree/helpers';
import { one, zero } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { mprime } from './mprime';

export function Eval_isprime(p1: U, $: ExtensionEnv): U {
    return isprime($.valueOf(cadr(p1)));
}

function isprime(p1: U): U {
    if (is_rat(p1) && p1.isNonNegativeInteger() && mprime(p1.a)) {
        return one;
    }
    return zero;
}
