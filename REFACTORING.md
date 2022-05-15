# Refactoring

These notes are intended to act as a guide to developers and contributors and are specific to refactoring.

Rafactoring can be a slow process where language processing libraries are concerned because of the sheer number of files that are intertwined.

As a result, many refactoring ideas may be work-in-progress and not obvious.

The purpose of this document is to make manifest the ideas in play so that contributions can be orchestrated and discussed if not clear or controversial.

# Principles

## Separation of Tree construction from Runtime evaluation.

This is really a matter of not overwhelming the developer with distinct concerns and not accidentally introducing couplings between the two. Ultimately it becomes a way to cleave the library into two parts.

This is reflected in the source folder having two sub-folders, "tree" and "runtime". The top-level runtime folder will migrate under the source folder. Eventually it may be pulled out as a separate library. Refactoring should move towards the "tree" contents being independent of the "runtime".

The use of a "runtime" abstraction by a "tree" abstraction should be regarded as a code smell and a reason for refactoring.

## Encapsulation of Atomic types

The list of atomic types is currently Cons, Double, Multivector, Num, Str, Sym, Tensor, Unit.

Atoms become the granularity of future extensions; the introduction of new mathematical structures. e.g. Graph (not actually planned).

The atomic types should encapsulated their implementation as far as possible. e.g. Num should have a "round(): Num" method. Even Double should not expose the underlying number implementation. This principle is not just about modularity, it should help to DRY the code.

## Interaction between Atomic types and Operator Overloading or Smart Methods.

If the library is to be used (in a manner similar to Python) for tree construction directly in JavaScript then the atomic types will

have to become coupled. However, this should only be done in special methods (a.k.a Dunder Methods) that are there to support Operator Overloading.

This idea is used in e.g. STEMCstudio and may never become mainstream, but it will keep the code organized and standard. It will also support STEMCstudio, which can act as an example for and demonstration of buiding symbolic algebra applications.

Ideas for turning interactions into explicit extension approaches are still to be developed, but this will be a goal.

## Refactoring Coding Guidelines

The following guidelines are strong recommendations. i.e. They should be followed unless there is a good reason otherwise.

They are also based upon working with the code base and are the some of the significant pain points in reafctoring.

1) Explicit return types for functions and methods. Manifest return types reduces cognitive load, reduces coding mistakes.
2) Reduced use of "let" in favor of "const". Decouples concepts that are really distinct. Easier to reason and refactor code.
3) "else" on next line. Makes it easier to add new branches. Consistent with "if" placement.
4) Work incrementally and agressively (prefer doing it right, even if it means major reorganization). Refactoring in a language library can be a long and laborius process but ideas for improvement will emerge and eventually everything will snap into place.