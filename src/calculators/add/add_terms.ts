import { ExtensionEnv } from "../../env/ExtensionEnv";
import { defs } from "../../runtime/defs";
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
export function append_terms(terms: U[], term: U, $: ExtensionEnv): void {
    if (is_cons(term) && is_add(term)) {
        // Go recursive here, don't just "spread" them in.
        // That way we entirely flatten nested add(s) and respect zero value processing.
        const kids = term.tail();
        kids.forEach(function (kid) {
            append_terms(terms, kid, $);
        });
    }
    else if ($.isZero(term)) {
        if (defs.omitZeroTermsFromSums) {
            // Do nothing (omit zeroes).

            // TODO We could maintain structure by finding the extension that is responsible for the zero,
            // getting the multiplicative identity element for that zero value and then multiply out the existing xs.
            // let xs = [x1, x2, ...] 
            // sum(xs) + 0 => sum(xs * 1), where 1 has the same type as the zero.
            // BUT... This only works if there is an additive identity and that is not guaranteed.
            // const ext = $.extensionOf(x);
            // Maybe implementations could return the identity or NIL if it does not exist?
            // e.g. For square matrices it would exist.
            // const mul_identity = ext.one(x, $);
        }
        else {
            terms.push(term);
        }
    }
    else {
        terms.push(term);
    }
}

export function flatten_terms(terms: U[], $: ExtensionEnv): U[] {
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

export function add_terms(terms: U[], $: ExtensionEnv): U {
    const flattened: U[] = [];
    for (const t of terms) {
        append_terms(flattened, t, $);
    }
    return to_list_add_sort(flattened, $);
}
