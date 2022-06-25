import { complex_conjugate } from '../../complex_conjugate';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { cadr } from '../../tree/helpers';
import { two } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';
import { rect } from '../rect/rect';

/*
 Returns the coefficient of the imaginary part of complex z

  z    imag(z)
  -    -------

  a + i b    b

  exp(i a)  sin(a)
*/

export function Eval_imag(p1: U, $: ExtensionEnv): U {
    return imag($.valueOf(cadr(p1)), $);
}

export function imag(z: U, $: ExtensionEnv): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, where: string): U {
        // console.lg(`imag of ${$.toInfixString(z)} => ${$.toInfixString(retval)} (${where})`);
        return retval;
    };

    const rect_z = rect(z, $);
    const conj_z = complex_conjugate(rect_z, $);
    const two_i_times_im = $.subtract(rect_z, conj_z);
    const i_times_im = $.divide(two_i_times_im, two);
    const im = $.divide(i_times_im, imu);
    return hook(im, "");
}
