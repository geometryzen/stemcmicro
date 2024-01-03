import { BasisBlade } from "./BasisBlade";
export { Adapter } from 'math-expression-atoms';

export type SumTerm<T, K> = { blade: BasisBlade<T, K>, weight: T }
