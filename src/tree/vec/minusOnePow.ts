/**
 * pow(-1, i), i.e. (-1) raised to the i'th power.
 */
export function minusOnePow(i: number): 1 | -1 {
    return ((i & 1) === 0) ? 1 : -1;
}
