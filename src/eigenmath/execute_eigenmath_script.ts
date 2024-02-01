import { create_sym } from 'math-expression-atoms';
import { is_nil, nil } from 'math-expression-tree';
import { defineConsFunction, EigenmathParseConfig, eigenmath_prolog, evaluate_expression, pop, scan_inbuf, ScriptContentHandler, ScriptErrorHandler, ScriptVars, set_symbol } from './eigenmath';
import { eval_draw } from './eval_draw';
import { eval_infixform } from './eval_infixform';
import { eval_print } from './eval_print';
import { eval_run } from './eval_run';

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
    const $ = new ScriptVars();
    $.init();
    defineConsFunction(create_sym("draw"), eval_draw);
    defineConsFunction(create_sym("infixform"), eval_infixform);
    defineConsFunction(create_sym("print"), eval_print);
    defineConsFunction(create_sym("run"), eval_run);
    contentHandler.begin($);
    try {
        $.inbuf = sourceText;

        $.executeProlog(eigenmath_prolog);

        let k = 0;

        for (; ;) {

            k = scan_inbuf(k, $, config);

            if (k === 0) {
                break; // end of input
            }

            const input = pop($);
            const result = evaluate_expression(input, $);
            contentHandler.output(result, input, $);
            if (!is_nil(result)) {
                set_symbol(LAST, result, nil, $);
            }
        }
    }
    catch (errmsg) {
        if ((errmsg as string).length > 0) {
            if ($.trace1 < $.trace2 && $.inbuf[$.trace2 - 1] === '\n') {
                $.trace2--;
            }
            errorHandler.error($.inbuf, $.trace1, $.trace2, errmsg, $);
        }
    }
    finally {
        contentHandler.end($);
    }
}
