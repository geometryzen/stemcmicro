import { Cons, U } from 'math-expression-tree';
import { ConsFunction } from '../../eigenmath/eigenmath';
import { make_eval_draw } from '../../eigenmath/eval_draw';
import { ProgramIO } from '../../eigenmath/ProgramIO';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { StackU } from '../../env/StackU';

export function Eval_draw(expr: Cons, env: ExtensionEnv): U {
    const io: Pick<ProgramIO, 'listeners'> = env;
    const consFunction: ConsFunction = make_eval_draw(io);
    const stack = new StackU();
    consFunction(expr, env, env, stack);
    return stack.pop();
}
