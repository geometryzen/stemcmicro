
export type GUARD<I, O extends I> = (arg: I) => arg is O;
