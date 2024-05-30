import { bitCount } from "./bitCount";

export function grade(bitmap: number): number {
    return bitCount(bitmap);
}
