import { ExtensionEnv } from "../env/ExtensionEnv";
import { makeList } from '../makeList';
import { clear_patterns, patternsinfo } from "../pattern";
import { PATTERN } from "../runtime/constants";
import { defs, halt } from "../runtime/defs";
import { stack_pop, stack_push } from "../runtime/stack";
import { Str } from "../tree/str/Str";
import { car, cdr, is_cons, nil, U } from "../tree/tree";

/*
  Add a pattern i.e. a substitution rule.
  Substitution rule needs a template as first argument
  and what to transform it to as second argument.
  Optional third argument is a boolean test which
  adds conditions to when the rule is applied.
*/

// same as Eval_pattern but only leaves
// NIL on stack at return, hence gives no
// printout
export function Eval_silentpattern(p1: U, $: ExtensionEnv): void {
    Eval_pattern(p1, $);
    stack_pop();
    stack_push(nil);
}

export function Eval_pattern(p1: U, $: ExtensionEnv): void {
    // check that the parameters are allright
    let arg3: U;
    if (!is_cons(cdr(p1))) {
        halt('pattern needs at least a template and a transformed version');
    }
    const arg1 = car(cdr(p1));
    const arg2 = car(cdr(cdr(p1)));
    if (nil === arg2) {
        halt('pattern needs at least a template and a transformed version');
    }
    // third argument is optional and contains the tests
    if (!is_cons(cdr(cdr(p1)))) {
        arg3 = nil;
    }
    else {
        arg3 = car(cdr(cdr(cdr(p1))));
    }

    if ($.equals(arg1, arg2)) {
        halt('recursive pattern');
    }

    // console.lg "Eval_pattern of " + cdr(p1)
    // this is likely to create garbage collection
    // problems in the C version as it's an
    // untracked reference
    let stringKey = 'template: ' + $.toListString(arg1);
    stringKey += ' tests: ' + $.toListString(arg3);
    // console.lg(`pattern stringkey: ${stringKey}`);

    const index = defs.userSimplificationsInStringForm.indexOf(stringKey);
    // if pattern is not there yet, add it, otherwise replace it
    if (index === -1) {
        // console.lg "adding pattern because it doesn't exist: " + cdr(p1)
        defs.userSimplificationsInStringForm.push(stringKey);
        defs.userSimplificationsInListForm.push(cdr(p1));
    }
    else {
        // console.lg(`pattern already exists, replacing. ${cdr(p1)}`);
        defs.userSimplificationsInStringForm[index] = stringKey;
        defs.userSimplificationsInListForm[index] = cdr(p1);
    }

    // return the pattern node itself so we can
    // give some printout feedback
    stack_push(makeList(PATTERN, cdr(p1)));
}

export function Eval_clearpatterns() {
    // this is likely to create garbage collection
    // problems in the C version as it's an
    // untracked reference
    clear_patterns();

    // return nothing
    stack_push(nil);
}

export function Eval_patternsinfo() {
    const pinfo = patternsinfo();
    if (pinfo !== '') {
        stack_push(new Str(pinfo));
    }
    else {
        stack_push(nil);
    }
}
