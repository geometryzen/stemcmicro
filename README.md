[![npm version](https://badge.fury.io/js/jsxmath.svg)](https://badge.fury.io/js/jsxmath)

JsxMath is a Javascript (Typescript) library for symbolic mathematics.

## Example

```typescript
import { assert } from "chai";
import { is_rat } from "math-expression-atoms";
import { create_engine, ExprEngine } from "../src/api/index";
import { Interpreter, State } from '../src/clojurescript/runtime/Interpreter';
import { Stack } from "../src/env/Stack";

describe("example", function () {
    it("program", function () {
        const lines: string[] = [
            `(+ 1 2 3 4 5)`,
            `(+ 10 (* 5 2))`,
            `(* (+ 10 5) 2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useClojureScript: true });
        const { program, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const runner = new Interpreter(program);
        runner.run();
        const stack: Stack<State> = runner.getStateStack();
        assert.strictEqual(stack.length, 1);
        const values = stack.top.values;
        assert.strictEqual(values.length, 3);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "15");
        assert.strictEqual(is_rat(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "20");
        assert.strictEqual(is_rat(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), "30");
        assert.strictEqual(is_rat(values[2]), true);
        engine.release();
    });
});
```

## Features

* arbitrary-precision arithmetic
* complex quantities
* geometric algebra
* trigonometric functions
* special functions
* simplification
* expansion
* substitution
* factoring
* symbolic and numeric roots
* units of measure
* hyperreal numbers
* matrices
* derivatives and gradients
* tensors
* booleans
* integrals
* multi-integrals
* open for extension

## Getting Started

Please take a look at the [tutorial](https://github.com/geometryzen/jsxmath/blob/master/TUTORIAL.md) file.

## Contributing

Please take a look at the [contributing](https://github.com/geometryzen/jsxmath/blob/master/CONTRIBUTING.md) file.

## References

jsxmath is a fork of [Algebrite by Davide Della Casa](https://github.com/davidedc/Algebrite).
The fork adds Geometric Algebra, S.I. Units of Measure, and changes the way that expressions are matched and transformed.  

Algebrite started as a port of [the EigenMath CAS by George Weigt](http://eigenmath.sourceforge.net/Eigenmath.pdf) to TypeScript.
Another fork of EigenMath: [SMIB by Philippe Billet](http://smib.sourceforge.net/).

Another CAS of similar nature is [SymPy](http://www.sympy.org/en/index.html) made in Python.

Three other Javascript CAS are

* [javascript-cas by Anthony Foster](https://github.com/aantthony/javascript-cas) supporting "differentiation, complex numbers, sums, vectors (dot products, cross products, gradient/curl etc)"
* [Coffeequate by Matthew Alger](http://coffeequate.readthedocs.org/) supporting "quadratic and linear equations, simplification of most algebraic expressions, uncertainties propagation, substitutions, variables, constants, and symbolic constants".
* [Algebra.js by Nicole White](http://algebra.js.org) which among other things can build and solve equations via a "chainable" API.
