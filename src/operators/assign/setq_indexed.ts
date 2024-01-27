
// Here "setq" is a misnomer because
// setq wouldn't work in Lisp to set array elements
// since setq stands for "set quoted" and you wouldn't
// quote an array element access.
// You'd rather use setf, which is a macro that can
// assign a value to anything.
//   (setf (aref YourArray 2) "blue")
// see
//   http://stackoverflow.com/questions/18062016/common-lisp-how-to-set-an-element-in-a-2d-array
//-----------------------------------------------------------------------------
//
//  Example: a[1] = b
//
//  p1  *-------*-----------------------*
//    |  |      |
//    setq  *-------*-------*  b
//      |  |  |
//      index  a  1
//
//  cadadr(p1) -> a
//

import { is_sym } from "math-expression-atoms";
import { Cons, is_cons, nil } from "math-expression-tree";
import { set_component } from "../../calculators/set_component";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { defs } from "../../runtime/defs";
import { stack_pop, stack_push, stack_push_items } from "../../runtime/stack";
import { cadadr, caddr, cdadr } from "../../tree/helpers";

//-----------------------------------------------------------------------------
/**
 * 
 * @param assignExpr (= )
 * @param $ 
 * @returns nil
 */
export function setq_indexed(assignExpr: Cons, $: Pick<ExtensionEnv, 'setBinding' | 'valueOf'>): Cons {
    // console.lg(`setq_indexed ${$.toInfixString(assignExpr)}`);
    const p4 = cadadr(assignExpr);
    // console.lg(`p4: ${toInfixString(p4)}`);
    if (!is_sym(p4)) {
        // this is likely to happen when one tries to
        // do assignments like these
        //   1[2] = 3
        // or
        //   f(x)[1] = 2
        // or
        //   [[1,2],[3,4]][5] = 6
        //
        // In other words, one can only do
        // a straight assignment like
        //   existingMatrix[index] = something
        throw new Error('indexed assignment: expected a symbol name');
    }
    const h = defs.tos;
    stack_push($.valueOf(caddr(assignExpr)));
    const p2 = cdadr(assignExpr);
    if (is_cons(p2)) {
        stack_push_items([...p2].map(function (x) {
            return $.valueOf(x);
        }));
    }
    set_component(defs.tos - h);
    const p3 = stack_pop();
    $.setBinding(p4, p3);
    return nil;
}
