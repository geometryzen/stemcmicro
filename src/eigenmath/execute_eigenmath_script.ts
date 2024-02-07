import { create_sym } from 'math-expression-atoms';
import { nil } from 'math-expression-tree';
import { define_cons_function, EigenmathParseConfig, eigenmath_prolog, evaluate_expression, scan_inbuf, ScriptContentHandler, ScriptErrorHandler, ScriptVars, set_symbol } from './eigenmath';
import { make_eval_draw } from './eval_draw';
import { eval_infixform } from './eval_infixform';
import { make_eval_print } from './eval_print';
import { make_eval_run } from './eval_run';
import { ProgramControl } from './ProgramControl';
import { ProgramEnv } from './ProgramEnv';
import { ProgramIO } from './ProgramIO';
import { ProgramStack } from './ProgramStack';

export const LAST = create_sym("last");

function eigenmath_parse_config_from_options(options: Partial<EigenmathParseConfig>): EigenmathParseConfig {
    const config: EigenmathParseConfig = {
        useCaretForExponentiation: options.useCaretForExponentiation ? true : false,
        useParenForTensors: options.useParenForTensors ? true : false
    };
    return config;
}

export function execute_eigenmath_script(sourceText: string, contentHandler: ScriptContentHandler, errorHandler: ScriptErrorHandler, options: Partial<EigenmathParseConfig> = {}): void {
    const config = eigenmath_parse_config_from_options(options);
    const vars = new ScriptVars();
    const env: ProgramEnv = vars;
    const ctrl: ProgramControl = vars;
    const $: ProgramStack = vars;
    const io: ProgramIO = vars;
    vars.init();
    define_cons_function(create_sym("draw"), make_eval_draw(io));
    define_cons_function(create_sym("infixform"), eval_infixform);
    define_cons_function(create_sym("print"), make_eval_print(io));
    define_cons_function(create_sym("run"), make_eval_run(io));
    contentHandler.begin($);
    try {
        io.inbuf = sourceText;

        env.executeProlog(eigenmath_prolog);

        let k = 0;

        for (; ;) {

            k = scan_inbuf(k, env, ctrl, $, io, config);

            if (k === 0) {
                break; // end of input
            }

            const input = $.pop();
            const result = evaluate_expression(input, env, ctrl, $);
            contentHandler.output(result, input, $);
            if (!result.isnil) {
                set_symbol(LAST, result, nil, env);
            }
        }
    }
    catch (e) {
        if (e instanceof Error) {
            errorHandler.error(e.message, 0, e.message.length, e, io);
        }
        if ((e as string).length > 0) {
            if (io.trace1 < io.trace2 && io.inbuf[io.trace2 - 1] === '\n') {
                io.trace2--;
            }
            errorHandler.error(io.inbuf, io.trace1, io.trace2, e, io);
        }
    }
    finally {
        contentHandler.end($);
    }
}
