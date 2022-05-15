## symbolic-math

[![npm version](https://badge.fury.io/js/symbolic-math.svg)](https://badge.fury.io/js/symbolic-math)

symbolic-math is a Javascript (Typescript) library for symbolic mathematics designed to be comprehensible and easily extensible.

## JavaScript Example

```js
import {run, factor, evaluate, integral} from 'symbolic-math'

run('x + x') // => "2 x"

factor('10!').toString() // => "2^8 3^4 5^2 7"

evaluate('integral(x^2)').toString() // => "1/3 x^3"

// composing...
integral(evaluate('x')).toString() // => "1/2 x^2"
```

## Features

symbolic-math supports: arbitrary-precision arithmetic, complex quantities, simplification, expansion , substitution, symbolic and numeric roots, units of measurement, matrices, derivatives and gradients, tensors, integrals, multi-integrals, computing integrals and much more!

## Things to Know

All the built-in methods in symbolic-math are exposed through a javascript interface. Strings are automatically parsed as expressions, numbers are converted into the appropriate representation, and the internal cons objects are returned. 

The cons objects have a `toString` method which converts it into a pretty-print notation.

## Getting Started

Please take a look at the [tutorial](https://github.com/geometryzen/symbolic-math/blob/master/TUTORIAL.md) file.

## Contributing

Please take a look at the [contributing](https://github.com/geometryzen/symbolic-math/blob/master/CONTRIBUTING.md) file.

## References

symbolic-math is a fork of [Algebrite by Davide Della Casa](https://github.com/davidedc/Algebrite). The fork introduces better support for TypeScript through the generated `index.d.ts` file, generated Documentation using typedoc, the Rollup build system, Linting using eslint, Testing using Mocha and Chai. The fork has introduced small changes to the API which are not backwards compatible with Algebrite. 

symbolic-math started as an adaptation of [the EigenMath CAS by George Weigt](http://eigenmath.sourceforge.net/Eigenmath.pdf). Also you might want to check another fork of EigenMath: [SMIB by Philippe Billet](http://smib.sourceforge.net/).

Another CAS of similar nature is [SymPy](http://www.sympy.org/en/index.html) made in Python.

Three other Javascript CAS are

* [javascript-cas by Anthony Foster](https://github.com/aantthony/javascript-cas) supporting "differentiation, complex numbers, sums, vectors (dot products, cross products, gradient/curl etc)"
* [Coffeequate by Matthew Alger](http://coffeequate.readthedocs.org/) supporting "quadratic and linear equations, simplification of most algebraic expressions, uncertainties propagation, substitutions, variables, constants, and symbolic constants".
* [Algebra.js by Nicole White](http://algebra.js.org) which among other things can build and solve equations via a "chainable" API.
