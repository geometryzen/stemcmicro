import { ExtensionEnv } from "../env/ExtensionEnv";
import { symbolsinfo } from "../env/symbolsinfo";
import { stack_push } from "../runtime/stack";
import { Str } from "../tree/str/Str";
import { NIL } from "../tree/tree";

export function Eval_symbolsinfo($: ExtensionEnv): void {
  const sinfo = symbolsinfo($);
  if (sinfo !== '') {
    stack_push(new Str(sinfo));
  }
  else {
    stack_push(NIL);
  }
}
