import { complex_conjugate } from '../../complex_conjugate';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { rect } from '../rect/rect';
import { cadr } from '../../tree/helpers';
import { two } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';

/*
 Returns the real part of complex z

  z    real(z)
  -    -------

  a + i b    a

  exp(i a)  cos(a)
*/
export function Eval_real(p1: U, $: ExtensionEnv): U {
    return real($.valueOf(cadr(p1)), $);
}

/**
 * Returns the real part of complex z
 * @param z 
 * @param $ 
 * @returns 
 */
export function real(z: U, $: ExtensionEnv): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, where: string): U {
        // console.lg(`real of ${$.toInfixString(z)} => ${$.toInfixString(retval)} (${where})`);
        return retval;
    };

    // I'm not sure why this first step is necessary; it should not be.
    const rect_z = rect(z, $);
    const conj_z = complex_conjugate(rect_z, $);
    // console.lg(`rect_z => ${$.toInfixString(rect_z)}`);
    // console.lg(`conj_z => ${$.toInfixString(conj_z)}`);
    const two_re = $.add(rect_z, conj_z);
    // console.lg(`2*x => ${$.toInfixString(two_re)}`);
    const re = $.divide(two_re, two);
    return hook(re, "");
}
