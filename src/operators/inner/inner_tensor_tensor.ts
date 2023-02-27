import { ExtensionEnv } from "../../env/ExtensionEnv";
import { MAXDIM } from "../../runtime/constants";
import { halt } from "../../runtime/defs";
import { zero } from "../../tree/rat/Rat";
import { create_tensor_elements } from "../../tree/tensor/create_tensor_elements";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";

export function inner_tensor_tensor(p1: Tensor, p2: Tensor, $: ExtensionEnv): U {
    const n = p1.dim(p1.ndim - 1);
    if (n !== p2.dim(0)) {
        halt('inner: tensor dimension check');
    }

    const ndim = p1.ndim + p2.ndim - 2;

    if (ndim > MAXDIM) {
        halt('inner: rank of result exceeds maximum');
    }

    //---------------------------------------------------------------------
    //
    //  ak is the number of rows in tensor A
    //
    //  bk is the number of columns in tensor B
    //
    //  Example:
    //
    //  A[3][3][4] B[4][4][3]
    //
    //    3  3        ak = 3 * 3 = 9
    //
    //    4  3        bk = 4 * 3 = 12
    //
    //---------------------------------------------------------------------
    const ak = p1.sliceDimensions(0, p1.ndim - 1).reduce((a, b) => a * b, 1);
    const bk = p2.sliceDimensions(1).reduce((a, b) => a * b, 1);

    const elems: U[] = create_tensor_elements(ak * bk, zero);

    // new method copied from ginac http://www.ginac.de/
    for (let i = 0; i < ak; i++) {
        for (let j = 0; j < n; j++) {
            if ($.isZero(p1.elem(i * n + j))) {
                continue;
            }
            for (let k = 0; k < bk; k++) {
                elems[i * bk + k] = $.add($.multiply(p1.elem(i * n + j), p2.elem(j * bk + k)), elems[i * bk + k]);
            }
        }
    }

    //---------------------------------------------------------------------
    //
    //  Note on understanding "k * bk + j"
    //
    //  k * bk because each element of a column is bk locations apart
    //
    //  + j because the beginnings of all columns are in the first bk
    //  locations
    //
    //  Example: n = 2, bk = 6
    //
    //  b111  <- 1st element of 1st column
    //  b112  <- 1st element of 2nd column
    //  b113  <- 1st element of 3rd column
    //  b121  <- 1st element of 4th column
    //  b122  <- 1st element of 5th column
    //  b123  <- 1st element of 6th column
    //
    //  b211  <- 2nd element of 1st column
    //  b212  <- 2nd element of 2nd column
    //  b213  <- 2nd element of 3rd column
    //  b221  <- 2nd element of 4th column
    //  b222  <- 2nd element of 5th column
    //  b223  <- 2nd element of 6th column
    //
    //---------------------------------------------------------------------
    if (ndim === 0) {
        return elems[0];
    }
    else {
        const dims = [...p1.sliceDimensions(0, p1.ndim - 1), ...p2.sliceDimensions(1, p2.ndim),];
        return new Tensor(dims, elems);
    }
}
