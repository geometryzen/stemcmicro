## symbolic-math

[![npm version](https://badge.fury.io/js/symbolic-math.svg)](https://badge.fury.io/js/symbolic-math)

symbolic-math is a Javascript (Typescript) library for symbolic mathematics.

## Example

```typescript
import { createScriptEngine } from "symbolic-math";

const lines: string[] = [
    `a/b`
];

const eng = createScriptEngine();

const { values } = eng.executeScript(lines.join('\n'));
assert.strictEqual(eng.renderAsInfix(values[0]), "a/b");
assert.strictEqual(eng.renderAsSExpr(values[0]), "(* a (power b -1))");
assert.strictEqual(eng.renderAsLaTeX(values[0]), "\\frac{a}{b}");

eng.release();
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
* units of measurement
* matrices
* derivatives and gradients
* tensors
* integrals
* multi-integrals

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
