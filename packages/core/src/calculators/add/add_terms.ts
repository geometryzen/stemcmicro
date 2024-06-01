import { ExprContext } from "@stemcmicro/context";
import { Directive, ExtensionEnv } from "../../env/ExtensionEnv";
import { iszero } from "../../helpers/iszero";
import { is_add } from "../../runtime/helpers";
import { is_cons, U } from "../../tree/tree";
import { to_list_add_sort } from "./to_list_add_sort";

/**
 * Pushes the term onto the terms array.
 * Zero rational and double are skipped.
 */

/**
 * Appends a term to the terms array, flattening nested (+ ...) trees and respecting the setting for handling zeros.
 * @param terms The output destination for the term or nested (+ ...) trees.
 * @param term The term to be appended.
 * @param $ The extension environment.
 */
export function append_terms(terms: U[], term: U, $: Pick<ExprContext, "getDirective" | "valueOf">): void {
    if (is_cons(term) && is_add(term)) {
        // Go recursive here, don't just "spread" them in.
        // That way we entirely flatten nested add(s) and respect zero value processing.
        const kids = term.tail();
        kids.forEach(function (kid) {
            append_terms(terms, kid, $);
        });
    } else if (iszero(term, $)) {
        if ($.getDirective(Directive.keepZeroTermsInSums)) {
            terms.push(term);
        }
    } else {
        terms.push(term);
    }
}

export function flatten_terms(terms: U[], $: Pick<ExtensionEnv, "getDirective" | "valueOf">): U[] {
    const retval: U[] = [];
    terms.forEach(function (term) {
        append_terms(retval, term, $);
    });
    return retval;
}

/*
export function add_legacy(p1: U, p2: U, $: ExtensionEnv): U {
  const terms: U[] = [];
  push_terms(terms, p1);
  push_terms(terms, p2);
  return add_terms(terms, $);
}
*/

export function add_terms(terms: U[], $: ExprContext): U {
    const flattened: U[] = [];
    for (const t of terms) {
        append_terms(flattened, t, $);
    }
    return to_list_add_sort(flattened, $);
}
