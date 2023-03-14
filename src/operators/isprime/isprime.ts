import { ExtensionEnv } from '../../env/ExtensionEnv';
import { cadr } from '../../tree/helpers';
import { one, zero } from '../../tree/rat/Rat';
import { Cons, U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { mprime } from './mprime';

export function Eval_isprime(expr: Cons, $: ExtensionEnv): U {
    return isprime($.valueOf(cadr(expr)));
}

function isprime(x: U): U {
    if (is_rat(x) && x.isNonNegativeInteger() && mprime(x.a)) {
        return one;
    }
    return zero;
}
