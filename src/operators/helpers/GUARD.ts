import { ExtensionEnv } from "../../env/ExtensionEnv";

export type GUARD<I, O extends I> = (arg: I, $: ExtensionEnv) => arg is O;
