import { ExtensionEnv } from "../env/ExtensionEnv";
import { stack_push } from "../runtime/stack";
import { promote_tensor } from "../tensor";
import { Tensor } from "../tree/tensor/Tensor";

//(docs are generated from top-level comments, keep an eye on the formatting!)

/* tensor =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
General description
-------------------
Tensors are a strange in-between of matrices and "computer"
rectangular data structures.
 
Tensors, unlike matrices, and like rectangular data structures,
can have an arbitrary number of dimensions (rank), although a tensor with
rank zero is just a scalar.
 
Tensors, like matrices and unlike many computer rectangular data structures,
must be "contiguous" i.e. have no empty spaces within its size, and "uniform",
i.e. each element must have the same shape and hence the same rank.
 
Also tensors have necessarily to make a distinction between row vectors,
column vectors (which have a rank of 2) and uni-dimensional vectors (rank 1).
They look very similar but they are fundamentally different.
 
Tensors are 1-indexed, as per general math notation, and like Fortran,
Lua, Mathematica, SASL, MATLAB, Julia, Erlang and APL.
 
Tensors with elements that are also tensors get promoted to a higher rank
, this is so we can represent and get the rank of a matrix correctly.
Example:
Start with a tensor of rank 1 with 2 elements (i.e. shape: 2)
if you put in both its elements another 2 tensors
of rank 1 with 2 elements (i.e. shape: 2)
then the result is a tensor of rank 2 with shape 2,2
i.e. the dimension of a tensor at all times must be
the number of nested tensors in it.
Also, all tensors must be "uniform" i.e. they must be accessed
uniformly, which means that all existing elements of a tensor
must be contiguous and have the same shape.
Implication of it all is that you can't put arbitrary
tensors inside tensors (like you would do to represent block matrices)
Rather, all tensors inside tensors must have same shape (and hence, rank)
 
Limitations
-----------
n.a.
 
Implementation info
-------------------
Tensors are implemented...
 
*/
// Called from the "eval" module to evaluate tensor elements.

export function eval_tensor(A: Tensor, $: ExtensionEnv) {
    const B = A.map((a) => $.valueOf(a));

    stack_push(promote_tensor(B));
}
