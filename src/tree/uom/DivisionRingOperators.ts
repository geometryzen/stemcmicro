import { RingOperators } from './RingOperators';

/**
 *
 */
export interface DivisionRingOperators<T, UNIT> extends RingOperators<T, UNIT> {
    __div__(rhs: unknown): T | undefined
    __rdiv__(lhs: unknown): T | undefined
}
