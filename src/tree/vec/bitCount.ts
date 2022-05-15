export function bitCount(i: number): number {
    // Note that unsigned shifting (>>>) is not required.
    i = i - ((i >> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
    i = (i + (i >> 4)) & 0x0F0F0F0F;
    i = i + (i >> 8);
    i = i + (i >> 16);
    return i & 0x0000003F;
}
