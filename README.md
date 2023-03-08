[![npm version](https://badge.fury.io/js/symbolic-math.svg)](https://badge.fury.io/js/symbolic-math)

symbolic-math is a Javascript (Typescript) library for symbolic mathematics.

## Example

```typescript
import { assert } from "chai";
import { create_script_context, ScriptContextOptions } from "symbolic-math";

describe("example", function () {
    it("Geometric Algebra", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["i","j","k"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `C = Cx * e1 + Cy * e2 + Cz * e3`,
            `cross(A,B)`,
            `A|B`,
            `A^B`
        ];
        const sourcetText = lines.join('\n');
        const options: ScriptContextOptions = {
            useCaretForExponentiation: false,
            useDefinitions: false
        };
        const context = create_script_context(options);
        const { values } = context.executeScript(sourcetText);
        assert.strictEqual(context.renderAsInfix(values[0]), "Ay*Bz*i-Az*By*i-Ax*Bz*j+Az*Bx*j+Ax*By*k-Ay*Bx*k");
        assert.strictEqual(context.renderAsInfix(values[1]), "Ax*Bx+Ay*By+Az*Bz");
        assert.strictEqual(context.renderAsInfix(values[2]), "Ax*By*i^j-Ay*Bx*i^j+Ax*Bz*i^k-Az*Bx*i^k+Ay*Bz*j^k-Az*By*j^k");
        context.release();
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
* Native, Python, and Scheme syntax
* open for extension

## Getting Started

Please take a look at the [tutorial](https://github.com/geometryzen/symbolic-math/blob/master/TUTORIAL.md) file.

## Contributing

Please take a look at the [contributing](https://github.com/geometryzen/symbolic-math/blob/master/CONTRIBUTING.md) file.

## References

symbolic-math is a fork of [Algebrite by Davide Della Casa](https://github.com/davidedc/Algebrite).
The fork adds Geometric Algebra, S.I. Units of Measure, and changes the way that expressions are matched and transformed.  

Algebrite started as a port of [the EigenMath CAS by George Weigt](http://eigenmath.sourceforge.net/Eigenmath.pdf) to TypeScript.
Another fork of EigenMath: [SMIB by Philippe Billet](http://smib.sourceforge.net/).

Another CAS of similar nature is [SymPy](http://www.sympy.org/en/index.html) made in Python.

Three other Javascript CAS are

* [javascript-cas by Anthony Foster](https://github.com/aantthony/javascript-cas) supporting "differentiation, complex numbers, sums, vectors (dot products, cross products, gradient/curl etc)"
* [Coffeequate by Matthew Alger](http://coffeequate.readthedocs.org/) supporting "quadratic and linear equations, simplification of most algebraic expressions, uncertainties propagation, substitutions, variables, constants, and symbolic constants".
* [Algebra.js by Nicole White](http://algebra.js.org) which among other things can build and solve equations via a "chainable" API.
