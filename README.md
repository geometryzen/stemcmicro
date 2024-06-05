# STEMCmicro Monorepo

## Overview

stemcmicro is a Javascript (Typescript) library for symbolic mathematics.

It is motivated by the need to support learning activities in a web browser without requiring a symbolic mathematics server.

The roadmap is to create a highly modular and extensible ecosystem of packages to support diverse use cases. 

## Status

All packages are published together with the same version number.

[![version](https://img.shields.io/npm/v/@stemcmicro/core.svg)](https://www.npmjs.com/package/@stemcmicro/core)

[![npm downloads](https://img.shields.io/npm/dm/@stemcmicro/core.svg)](https://npm-stat.com/charts.html?package=@stemcmicro/core&from=2024-03-27)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

## Example

```typescript
import { create_engine, ExprEngine } from "@stemcmicro/engine";
import { js_parse } from "@stemcmicro/js-parse";

describe("units", () => {
    it("create_engine", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`G20 = algebra([1, 1, 1], ["ex", "ey", "ez"])`, `ex = G20[1]`, `ey = G20[2]`, `cross(ex,ey)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("cross(ex,ey)");
                    const t = engine.renderAsString(engine.simplify(value));
                    expect(t).toBe("ez");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
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

For a STEMCstudio example (click [here](https://www.stemcstudio.com/gists/615c4d96400a7d18e9741abe9bfc28fa) to try)

## Packages and API Documentation

### [@stemcmicro/atoms](https://geometryzen.github.io/stemcmicro/atoms)
### [@stemcmicro/context](https://geometryzen.github.io/stemcmicro/context)
### [@stemcmicro/core](https://geometryzen.github.io/stemcmicro/core)
### [@stemcmicro/cs-parse](https://geometryzen.github.io/stemcmicro/cs-parse)
### [@stemcmicro/diagnostics](https://geometryzen.github.io/stemcmicro/diagnostics)
### [@stemcmicro/directive](https://geometryzen.github.io/stemcmicro/directive)
### [@stemcmicro/em-parse](https://geometryzen.github.io/stemcmicro/em-parse)
### [@stemcmicro/engine](https://geometryzen.github.io/stemcmicro/engine)
### [@stemcmicro/helpers](https://geometryzen.github.io/stemcmicro/helpers)
### [@stemcmicro/hilbert](https://geometryzen.github.io/stemcmicro/hilbert)
### [@stemcmicro/js-parse](https://geometryzen.github.io/stemcmicro/js-parse)
### [@stemcmicro/native](https://geometryzen.github.io/stemcmicro/native)
### [@stemcmicro/predicates](https://geometryzen.github.io/stemcmicro/predicates)
### [@stemcmicro/py-parse](https://geometryzen.github.io/stemcmicro/py-parse)
### [@stemcmicro/tree](https://geometryzen.github.io/stemcmicro/tree)

## Contributing

Please take a look at the [contributing](https://github.com/geometryzen/stemcmicro/blob/master/CONTRIBUTING.md) file.

## References

STEMCmicro is a fork of [Algebrite by Davide Della Casa](https://github.com/davidedc/Algebrite).
The fork adds Geometric Algebra, S.I. Units of Measure, and changes the way that expressions are matched and transformed.  

Algebrite started as a port of [the EigenMath CAS by George Weigt](http://eigenmath.sourceforge.net/Eigenmath.pdf) to TypeScript.
Another fork of EigenMath: [SMIB by Philippe Billet](http://smib.sourceforge.net/).

Another CAS of similar nature is [SymPy](http://www.sympy.org/en/index.html) made in Python.

Three other Javascript CAS are

* [javascript-cas by Anthony Foster](https://github.com/aantthony/javascript-cas) supporting "differentiation, complex numbers, sums, vectors (dot products, cross products, gradient/curl etc)"
* [Coffeequate by Matthew Alger](http://coffeequate.readthedocs.org/) supporting "quadratic and linear equations, simplification of most algebraic expressions, uncertainties propagation, substitutions, variables, constants, and symbolic constants".
* [Algebra.js by Nicole White](http://algebra.js.org) which among other things can build and solve equations via a "chainable" API.
