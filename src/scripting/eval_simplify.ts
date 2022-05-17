import { ExtensionEnv } from '../env/ExtensionEnv';
import { INTEGRAL, MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES, MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE } from '../runtime/constants';
import { defs, halt, use_factoring_with_unary_function } from '../runtime/defs';
import { stack_push } from '../runtime/stack';
import { simplify } from '../simplify';
import { transform } from '../transform';
import { cadr } from '../tree/helpers';
import { Cons, NIL, U } from '../tree/tree';

export function Eval_simplify(expr: Cons, $: ExtensionEnv): void {
    // console.lg(`Eval_simplify expr = ${$.toInfixString(expr)}`);
    const arg = run_user_defined_simplifications(cadr(expr), $);
    // console.lg(`Eval_simplify ${$.toInfixString(expr)} arg = ${$.toInfixString(arg)}`);
    const result = simplify($.valueOf(arg), $);
    // console.lg(`Eval_simplify result = ${$.toInfixString(result)}`);
    stack_push(result);
}

function run_user_defined_simplifications(p: U, $: ExtensionEnv): U {
    // -----------------------
    // unfortunately for the time being user
    // specified simplifications are only
    // run in things which don't contain
    // integrals.
    // Doesn't work yet, could be because of
    // some clobbering as "transform" is called
    // recursively?
    if (defs.userSimplificationsInListForm.length === 0 || p.contains(INTEGRAL)) {
        return p;
    }

    let F1 = use_factoring_with_unary_function(function (x) {
        return $.valueOf(x);
    }, p, $);

    let atLeastOneSuccessInRouldOfRulesApplications = true;
    let numberOfRulesApplications = 0;

    while (atLeastOneSuccessInRouldOfRulesApplications && numberOfRulesApplications < MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
        atLeastOneSuccessInRouldOfRulesApplications = false;
        numberOfRulesApplications++;
        for (const eachSimplification of Array.from(defs.userSimplificationsInListForm)) {
            let success = true;
            let eachConsecutiveRuleApplication = 0;
            while (success && eachConsecutiveRuleApplication < MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE) {
                eachConsecutiveRuleApplication++;
                [F1, success] = transform(F1, NIL, eachSimplification, true, $);
                if (success) {
                    atLeastOneSuccessInRouldOfRulesApplications = true;
                }
            }
            if (
                eachConsecutiveRuleApplication ===
                MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE
            ) {
                halt(
                    `maximum application of single transformation rule exceeded: ${$.toInfixString(eachSimplification)}`
                );
            }
        }
    }

    if (numberOfRulesApplications === MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
        halt('maximum application of all transformation rules exceeded ');
    }
    return F1;
}

export function simplifyForCodeGeneration(p: U, $: ExtensionEnv): U {
    const arg = run_user_defined_simplifications(p, $);
    defs.codeGen = true;
    // in "codeGen" mode we completely
    // eval and simplify the function bodies
    // because we really want to resolve all
    // the variables indirections and apply
    // all the simplifications we can.
    const result = simplify(arg, $);
    defs.codeGen = false;
    return result;
}
