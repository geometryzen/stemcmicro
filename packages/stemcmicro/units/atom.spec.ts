/* eslint-disable @typescript-eslint/no-unused-vars */

import assert from "assert";
import { assert_rat, create_sym, Err, JsAtom, Str, Sym } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler, LambdaExpr } from "@stemcmicro/context";
import { Native } from "@stemcmicro/native";
import { Cons, is_nil, nil, U } from "@stemcmicro/tree";
import { create_engine, ExprEngine, ExprHandlerBuilder } from "../src/api/api";
import { hash_for_atom } from "../src/hashing/hash_info";

const TYPE = "myatom";
const NAME = "MyAtom";
const MAKE = "mkatom";

class MyAtom extends JsAtom {
    readonly type = TYPE;
    constructor(
        readonly x: number,
        readonly y: number
    ) {
        super(NAME);
    }
}

const HASH = hash_for_atom(new MyAtom(0, 0));

function is_myatom(expr: U): expr is MyAtom {
    return expr instanceof MyAtom;
}

class MyAtomExprHandlerBuilder implements ExprHandlerBuilder<MyAtom> {
    create(): ExprHandler<MyAtom> {
        return new MyAtomHandler();
    }
}

class MyAtomHandler implements ExprHandler<MyAtom> {
    binL(lhs: MyAtom, opr: Sym, rhs: U, env: ExprContext): U {
        return nil;
    }
    binR(rhs: MyAtom, opr: Sym, lhs: U, env: ExprContext): U {
        return nil;
    }
    dispatch(atom: MyAtom, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.infix: {
                return new Str(`[${atom.x},${atom.y}]`);
            }
        }
        if (opr.equalsSym(create_sym("valueof"))) {
            return atom;
        }
        return new Err(new Str(`I'm sorry Dave, I'm afraid I can't '${opr}' on '${atom.type}' type.`));
    }
    subst(atom: MyAtom, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("TestAtomExprHandler.subst method not implemented.");
    }
    test(atom: MyAtom, opr: Sym, env: ExprContext): boolean {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const create_atom: LambdaExpr = (argList: Cons, env: ExprContext): U => {
    const item0 = argList.item0;
    const item1 = argList.item1;
    try {
        const value0 = env.valueOf(item0);
        const value1 = env.valueOf(item1);
        try {
            return new MyAtom(assert_rat(value0).toNumber(), assert_rat(value1).toNumber());
        } finally {
            value0.release();
            value1.release();
        }
    } finally {
        item0.release();
        item1.release();
    }
};

describe("atom", function () {
    it("Native handling of custom atom", function () {
        const lines: string[] = [`a=${MAKE}(3,4)`, `infix(a)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine();
        engine.defineFunction(create_sym(MAKE), create_atom);
        const builder = new MyAtomExprHandlerBuilder();
        engine.defineAtomHandler(builder, HASH, is_myatom); // hash or type? hash will work because of indirection.
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: "Infix" }), `"[3,4]"`);
            }
        }
        engine.release();
    });
});
