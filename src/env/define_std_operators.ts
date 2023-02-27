import { AddComparator } from '../calculators/compare/comparator_add';
import { MulComparator } from '../calculators/compare/comparator_mul';
import { hash_binop_cons_atom, HASH_BLADE, HASH_FLT, HASH_RAT, HASH_SYM } from '../hashing/hash_info';
import { abs_any } from '../operators/abs/abs_any';
import { abs_factorize } from '../operators/abs/abs_factorize';
import { abs_rat } from '../operators/abs/abs_rat';
import { abs_sym_real } from '../operators/abs/abs_sym_real';
import { add_2_add_2_any_any_any_factorize_rhs } from '../operators/add/add_2_add_2_any_any_any_factorize_rhs';
import { add_2_add_2_any_imag_imag } from '../operators/add/add_2_add_2_any_imag_imag';
import { add_2_add_2_any_imag_real } from '../operators/add/add_2_add_2_any_imag_real';
import { add_2_add_2_rat_mul_2_rat_any_add_2_rat_any } from '../operators/add/add_2_add_2_any_mul_2_rat_any_add_2_rat_any';
import { add_2_add_2_any_mul_2_rat_sym_mul_2_rat_sym } from '../operators/add/add_2_add_2_any_mul_2_rat_sym_mul_2_rat_sym';
import { add_2_add_2_any_mul_2_rat_sym } from '../operators/add/add_2_add_2_any_sym_mul_2_rat_sym';
import { add_2_add_2_sym_xxx_xxx } from '../operators/add/add_2_add_2_sym_xxx_xxx';
import { add_2_any_any_factorize_rhs } from '../operators/add/add_2_any_any_factorize_rhs';
import { add_2_any_any_zero_sum } from '../operators/add/add_2_any_any_zero_sum';
import { add_2_any_mul_2_rat_any } from '../operators/add/add_2_any_mul_2_rat_any';
import { add_2_assoc_lhs_factorize_blades } from '../operators/add/add_2_assoc_lhs_factorize_blades';
import { add_2_assoc_rhs_canonical_ordering } from '../operators/add/add_2_assoc_rhs_canonical_ordering';
import { add_2_blade_blade } from '../operators/add/add_2_blade_blade';
import { add_2_blade_mul_2_rat_blade } from '../operators/add/add_2_blade_mul_2_rat_blade';
import { add_2_cons_rat } from '../operators/add/add_2_cons_rat';
import { add_2_flt_flt } from '../operators/add/add_2_flt_flt';
import { add_2_flt_rat } from '../operators/add/add_2_flt_rat';
import { add_2_flt_uom } from '../operators/add/add_2_flt_uom';
import { add_2_imu_flt } from '../operators/add/add_2_imu_flt';
import { add_2_mul_2_any_imu_sym } from '../operators/add/add_2_mul_2_any_imu_sym';
import { add_2_mul_2_rat_anX_anX } from '../operators/add/add_2_mul_2_rat_anX_anX';
import { add_2_mul_2_rat_inner_2_sym_sym_outer_2_sym_sym } from '../operators/add/add_2_mul_2_rat_inner_2_sym_sym_outer_2_sym_sym';
import { add_2_mul_2_rat_X_mul_2_rat_X } from '../operators/add/add_2_mul_2_rat_X_mul_2_rat_X';
import { add_2_mul_2_rat_zzz_aaa } from '../operators/add/add_2_mul_2_rat_zzz_aaa';
import { add_2_pow_2_any_any_mul_2_any_any } from '../operators/add/add_2_pow_2_any_any_mul_2_any_any';
import { add_2_rat_blade } from '../operators/add/add_2_rat_blade';
import { add_2_rat_cons } from '../operators/add/add_2_rat_cons';
import { add_2_rat_flt } from '../operators/add/add_2_rat_flt';
import { add_2_rat_rat } from '../operators/add/add_2_rat_rat';
import { add_2_rat_sym } from '../operators/add/add_2_rat_sym';
import { add_2_rat_uom } from '../operators/add/add_2_rat_uom';
import { add_2_sym_rat } from '../operators/add/add_2_sym_rat';
import { add_2_sym_sym } from '../operators/add/add_2_sym_sym';
import { add_2_tensor_tensor } from '../operators/add/add_2_tensor_tensor';
import { add_2_uom_flt } from '../operators/add/add_2_uom_flt';
import { add_2_uom_rat } from '../operators/add/add_2_uom_rat';
import { add_2_xxx_mul_2_rm1_xxx } from '../operators/add/add_2_xxx_mul_2_rm1_xxx';
import { add_varargs } from '../operators/add/add_varargs';
import { adj_any } from '../operators/adj/adj_any';
import { algebra_2_tensor_tensor } from '../operators/algebra/algebra_2_mat_mat';
import { and_varargs } from '../operators/and/and_varargs';
import { arccos_varargs } from '../operators/arccos/arccos_varargs';
import { arccosh_varargs } from '../operators/arccosh/arccosh_varargs';
import { arcsin_varargs } from '../operators/arcsin/arcsin_varargs';
import { arcsinh_any } from '../operators/arcsinh/arcsinh_any';
import { arctan_varargs } from '../operators/arctan/arctan_varargs';
import { arctanh_varargs } from '../operators/arctanh/arctanh_varargs';
import { arg_varargs } from '../operators/arg/arg_varargs';
import { assign_any_any } from '../operators/assign/assign_any_any';
import { assign_sym_any } from '../operators/assign/assign_sym_any';
import { besselj_varargs } from '../operators/besselj/besselj_varargs';
import { bessely_varargs } from '../operators/bessely/bessely_varargs';
import { binomial_varargs } from '../operators/binomial/binomial_varargs';
import { blade_extension } from '../operators/blade/blade_extension';
import { is_blade } from '../operators/blade/is_blade';
import { boo_extension } from '../operators/boo/boo_extension';
import { ceiling_any } from '../operators/ceiling/ceiling_any';
import { ceiling_flt } from '../operators/ceiling/ceiling_flt';
import { ceiling_rat } from '../operators/ceiling/ceiling_rat';
import { choose_varargs } from '../operators/choose/choose_varargs';
import { circexp_any } from '../operators/circexp/circexp_any';
import { clock_any } from '../operators/clock/clock_any';
import { coeff_varargs } from '../operators/coeff/coeff_varargs';
import { cofactor_varargs } from '../operators/cofactor/cofactor_varargs';
import { condense_varargs } from '../operators/condense/condense_varargs';
import { conj_any } from '../operators/conj/conj_any';
import { conj_blade } from '../operators/conj/conj_blade';
import { conj_flt } from '../operators/conj/conj_flt';
import { conj_imaginary_unit } from '../operators/conj/conj_imag';
import { conj_inner } from '../operators/conj/conj_inner';
import { conj_mul_2_any_any } from '../operators/conj/conj_mul_2_any_any';
import { conj_rat } from '../operators/conj/conj_rat';
import { conj_sym } from '../operators/conj/conj_sym';
import { cons_extension } from '../operators/cons/cons_extension';
import { contract_varargs } from '../operators/contract/contract_varargs';
import { cos_add_2_any_any } from '../operators/cos/cos_add_2_any_any';
import { cos_any } from '../operators/cos/cos_any';
import { cos_hyp } from '../operators/cos/cos_hyp';
import { cos_mul_2_any_imu } from '../operators/cos/cos_mul_2_any_imu';
import { cos_sym } from '../operators/cos/cos_sym';
import { cosh_sym } from '../operators/cosh/cosh_sym';
import { cosh_varargs } from '../operators/cosh/cosh_varargs';
import { cross_any_any } from '../operators/cross/cross_any_any';
import { cross_blade_blade } from '../operators/cross/cross_blade_blade';
import { MATH_VECTOR_CROSS_PRODUCT } from '../operators/cross/MATH_VECTOR_CROSS_PRODUCT';
import { defint } from '../operators/defint/defint';
import { degree_varargs } from '../operators/degree/degree_varargs';
import { denominator_fn } from '../operators/denominator/denominator_fn';
import { derivative_2_mul_any } from '../operators/derivative/derivative_2_mul_any';
import { derivative_2_pow_any } from '../operators/derivative/derivative_2_pow_any';
import { derivative_2_sym_sym } from '../operators/derivative/derivative_2_sym_sym';
import { derivative_fn } from '../operators/derivative/derivative_fn';
import { d_to_derivative } from '../operators/derivative/d_to_derivative';
import { det_any } from '../operators/det/det_any';
import { dim_varargs } from '../operators/dim/dim_varargs';
import { dirac_varargs } from '../operators/dirac/dirac_varargs';
import { make_lhs_distrib_expand_law, make_rhs_distrib_expand_law } from '../operators/distrib/make_distrib_expand_law';
import { divisors_varargs } from '../operators/divisors/divisors_varargs';
import { do_varargs } from '../operators/do/do_varargs';
import { eigenval_varargs } from '../operators/eigen/eigenval_varargs';
import { eigenvec_varargs } from '../operators/eigen/eigenvec_varargs';
import { eigen_varargs } from '../operators/eigen/eigen_varargs';
import { erf_varargs } from '../operators/erf/erf_varargs';
import { erfc_varargs } from '../operators/erfc/erfc_varargs';
import { err_extension } from '../operators/err/err_extension';
import { eval_varargs } from '../operators/eval/eval_varargs';
import { exp_any } from '../operators/exp/exp_any';
import { exp_flt } from '../operators/exp/exp_flt';
import { exp_rat } from '../operators/exp/exp_rat';
import { expcos_varargs } from '../operators/expcos/expcos_varargs';
import { expsin_varargs } from '../operators/expsin/expsin_varargs';
import { factor_varargs } from '../operators/factor/factor_varargs';
import { factorial_varargs } from '../operators/factorial/factorial_varargs';
import { factorize_geometric_product_lhs_assoc } from '../operators/factorize/factorize_geometric_product_lhs_assoc';
import { float_cons } from '../operators/float/float_cons';
import { float_flt } from '../operators/float/float_flt';
import { float_imu } from '../operators/float/float_imu';
import { float_mul_2_flt_sym } from '../operators/float/float_mul_2_flt_sym';
import { float_rat } from '../operators/float/float_rat';
import { float_sym } from '../operators/float/float_sym';
import { float_sym_pi } from '../operators/float/float_sym_pi';
import { floor_varargs } from '../operators/floor/floor_varargs';
import { flt_extension, is_flt } from '../operators/flt/flt_extension';
import { for_varargs } from '../operators/for/for_varargs';
import { gamma_varargs } from '../operators/gamma/gamma_varargs';
import { gcd_varargs } from '../operators/gcd/gcd_varargs';
import { heterogenous_canonical_order } from '../operators/helpers/heterogenous_canonical_order';
import { heterogenous_canonical_order_lhs_assoc } from '../operators/helpers/heterogenous_canonical_order_lhs_assoc';
import { hermite_varargs } from '../operators/hermite/hermite_varargs';
import { hilbert_varargs } from '../operators/hilbert/hilbert_varargs';
import { hyp_extension } from '../operators/hyp/hyp_extension';
import { imag_any } from '../operators/imag/imag_any';
import { imu_extension } from '../operators/imu/Imu_extension';
import { index_varargs } from '../operators/index/index_varargs';
import { inner_extension } from '../operators/inner/inner';
import { inner_2_any_imu } from '../operators/inner/inner_2_any_imu';
import { inner_2_any_rat } from '../operators/inner/inner_2_any_rat';
import { inner_2_any_real } from '../operators/inner/inner_2_any_real';
import { inner_2_blade_blade } from '../operators/inner/inner_2_blade_blade';
import { inner_2_imu_any } from '../operators/inner/inner_2_imu_any';
import { inner_2_imu_imu } from '../operators/inner/inner_2_imu_imu';
import { inner_2_imu_rat } from '../operators/inner/inner_2_imu_rat';
import { inner_2_num_num } from '../operators/inner/inner_2_num_num';
import { inner_2_rat_any } from '../operators/inner/inner_2_rat_any';
import { inner_2_rat_imu } from '../operators/inner/inner_2_rat_imu';
import { inner_2_rat_sym } from '../operators/inner/inner_2_rat_sym';
import { inner_2_real_any } from '../operators/inner/inner_2_real_any';
import { inner_2_sym_sym } from '../operators/inner/inner_2_sym_sym';
import { inner_2_vec_scalar } from '../operators/inner/inner_2_vec_scalar';
import { integral_varargs } from '../operators/integral/integral_varargs';
import { inv_any } from '../operators/inv/inv_any';
import { isprime_varargs } from '../operators/isprime/isprime_varargs';
import { iszero_any } from '../operators/iszero/iszero_any';
import { iszero_rat } from '../operators/iszero/iszero_rat';
import { laguerre_varargs } from '../operators/laguerre/laguerre_varargs';
import { lcm_varargs } from '../operators/lcm/lcm_varargs';
import { lco_2_any_any } from '../operators/lco/lco_2_any_any';
import { lco_2_any_mul_2_scalar_any } from '../operators/lco/lco_2_any_mul_2_scalar_any';
import { lco_2_blade_blade } from '../operators/lco/lco_2_blade_blade';
import { lco_2_mul_2_scalar_any_any } from '../operators/lco/lco_2_mul_2_scalar_any_any';
import { legendre_varargs } from '../operators/legendre/legendre_varargs';
import { log_varargs } from '../operators/log/log_varargs';
import { mod_varargs } from '../operators/mod/mod_varargs';
import { mul_2_any_rat } from '../operators/mul/mul_2_any_rat';
import { mul_2_blade_blade } from '../operators/mul/mul_2_blade_blade';
import { mul_2_blade_rat } from '../operators/mul/mul_2_blade_rat';
import { mul_2_blade_sym } from '../operators/mul/mul_2_blade_sym';
import { mul_2_flt_flt } from '../operators/mul/mul_2_flt_flt';
import { mul_2_flt_imu } from '../operators/mul/mul_2_flt_imu';
import { mul_2_flt_mul_2_flt_any } from '../operators/mul/mul_2_flt_mul_2_flt_any';
import { mul_2_flt_rat } from '../operators/mul/mul_2_flt_rat';
import { mul_2_flt_uom } from '../operators/mul/mul_2_flt_uom';
import { mul_2_hyp_rat } from '../operators/mul/mul_2_hyp_rat';
import { mul_2_hyp_sym } from '../operators/mul/mul_2_hyp_sym';
import { mul_2_imu_imu } from '../operators/mul/mul_2_imu_imu';
import { mul_2_mul_2_aaa_bbb_bbb } from '../operators/mul/mul_2_mul_2_aaa_bbb_bbb';
import { mul_2_mul_2_any_blade_blade } from '../operators/mul/mul_2_mul_2_any_blade_blade';
import { mul_2_mul_2_any_cons_sym } from '../operators/mul/mul_2_mul_2_any_cons_sym';
import { mul_2_mul_2_any_imu_any } from '../operators/mul/mul_2_mul_2_any_imu_any';
import { mul_2_mul_2_any_imu_imu } from '../operators/mul/mul_2_mul_2_any_imu_imu';
import { mul_2_mul_2_any_imu_sym } from '../operators/mul/mul_2_mul_2_any_imu_sym';
import { mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any } from '../operators/mul/mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any';
import { mul_2_mul_2_any_sym_imu } from '../operators/mul/mul_2_mul_2_any_sym_imu';
import { mul_2_mul_2_any_sym_mul_2_imu_sym } from '../operators/mul/mul_2_mul_2_any_sym_mul_2_imu_sym';
import { mul_2_mul_2_any_X_pow_2_X_rat } from '../operators/mul/mul_2_mul_2_any_X_pow_2_X_rat';
import { mul_2_mul_2_any_Z_pow_2_A_any } from '../operators/mul/mul_2_mul_2_any_Z_pow_2_A_any';
import { mul_2_mul_2_num_any_rat } from '../operators/mul/mul_2_mul_2_num_any_rat';
import { mul_2_mul_2_rat_any_mul_2_rat_any } from '../operators/mul/mul_2_mul_2_rat_any_mul_2_rat_any';
import { mul_2_mul_2_rat_sym_sym } from '../operators/mul/mul_2_mul_2_rat_sym_sym';
import { mul_2_mul_2_sym_imu_sym } from '../operators/mul/mul_2_mul_2_sym_imu_sym';
import { mul_2_one_any } from '../operators/mul/mul_2_one_any';
import { mul_2_pow_2_xxx_any_pow_2_xxx_any } from '../operators/mul/mul_2_pow_2_xxx_any_pow_2_xxx_any';
import { mul_2_pow_2_xxx_rat_xxx } from '../operators/mul/mul_2_pow_2_xxx_rat_xxx';
import { mul_2_rat_any } from '../operators/mul/mul_2_rat_any';
import { mul_2_rat_blade } from '../operators/mul/mul_2_rat_blade';
import { mul_2_rat_flt } from '../operators/mul/mul_2_rat_flt';
import { mul_2_rat_rat } from '../operators/mul/mul_2_rat_rat';
import { mul_2_rat_sym } from '../operators/mul/mul_2_rat_sym';
import { mul_2_rat_tensor } from '../operators/mul/mul_2_rat_tensor';
import { mul_2_scalar_blade } from '../operators/mul/mul_2_scalar_blade';
import { mul_2_sym_blade } from '../operators/mul/mul_2_sym_blade';
import { mul_2_sym_flt } from '../operators/mul/mul_2_sym_flt';
import { mul_2_sym_imu } from '../operators/mul/mul_2_sym_imu';
import { mul_2_sym_mul_2_rat_any } from '../operators/mul/mul_2_sym_mul_2_rat_any';
import { mul_2_sym_num } from '../operators/mul/mul_2_sym_num';
import { mul_2_sym_rat } from '../operators/mul/mul_2_sym_rat';
import { mul_2_sym_sym } from '../operators/mul/mul_2_sym_sym';
import { mul_2_sym_sym_general } from '../operators/mul/mul_2_sym_sym_general';
import { mul_2_sym_tensor } from '../operators/mul/mul_2_sym_tensor';
import { mul_2_tensor_any } from '../operators/mul/mul_2_tensor_any';
import { mul_2_tensor_sym } from '../operators/mul/mul_2_tensor_sym';
import { mul_2_tensor_tensor } from '../operators/mul/mul_2_tensor_tensor';
import { mul_2_uom_flt } from '../operators/mul/mul_2_uom_flt';
import { mul_2_uom_rat } from '../operators/mul/mul_2_uom_rat';
import { mul_2_uom_uom } from '../operators/mul/mul_2_uom_uom';
import { mul_2_X_pow_2_X_rat } from '../operators/mul/mul_2_X_pow_2_X_rat';
import { mul_varargs } from '../operators/mul/mul_varargs';
import { nil_extension } from '../operators/nil/nil_extension';
import { not_fn } from '../operators/not/not_fn';
import { nroots_varargs } from '../operators/nroots/nroots_varargs';
import { number_fn } from '../operators/number/number_fn';
import { numerator_fn } from '../operators/numerator/numerator_fn';
import { or_varargs } from '../operators/or/or_varargs';
import { outer_2_any_any } from '../operators/outer/outer_2_any_any';
import { outer_2_any_mul_2_scalar_any } from '../operators/outer/outer_2_any_mul_2_scalar_any';
import { outer_2_blade_blade } from '../operators/outer/outer_2_blade_blade';
import { outer_2_mul_2_scalar_any_any } from '../operators/outer/outer_2_mul_2_scalar_any_any';
import { outer_2_sym_sym } from '../operators/outer/outer_2_sym_sym';
import { outer_2_tensor_tensor } from '../operators/outer/outer_2_tensor_tensor';
import { polar_varargs } from '../operators/polar/polar_varargs';
import { pow } from '../operators/pow/pow';
import { pow_2_any_any } from '../operators/pow/pow_2_any_any';
import { pow_2_any_rat } from '../operators/pow/pow_2_any_rat';
import { pow_2_blade_rat } from '../operators/pow/pow_2_blade_rat';
import { pow_2_cons_rat } from '../operators/pow/pow_2_cons_rat';
import { pow_2_e_any } from '../operators/pow/pow_2_e_any';
import { pow_2_flt_rat } from '../operators/pow/pow_2_flt_rat';
import { pow_2_imu_rat } from '../operators/pow/pow_2_imu_rat';
import { pow_2_pow_2_e_any_rat } from '../operators/pow/pow_2_pow_2_any_any_rat';
import { pow_2_pow_2_any_rat_rat } from '../operators/pow/pow_2_pow_2_any_rat_rat';
import { pow_2_rat_mul_2_rat_rat } from '../operators/pow/pow_2_rat_mul_2_rat_rat';
import { pow_2_rat_rat } from '../operators/pow/pow_2_rat_rat';
import { pow_2_sym_rat } from '../operators/pow/pow_2_sym_rat';
import { pow_2_uom_rat } from '../operators/pow/pow_2_uom_rat';
import { pred_any } from '../operators/pred/pred_any';
import { pred_rat } from '../operators/pred/pred_rat';
import { printlist_1_any } from '../operators/printlist/printlist_1_any';
import { printlist_keyword } from '../operators/printlist/printlist_keyword';
import { product_varargs } from '../operators/product/product_varargs';
import { quote_varargs } from '../operators/quote/quote_varargs';
import { quotient_varargs } from '../operators/quotient/quotient_varargs';
import { rank_varargs } from '../operators/rank/rank_varargs';
import { is_rat, rat_extension } from '../operators/rat/rat_extension';
import { rationalize_fn } from '../operators/rationalize/rationalize_fn';
import { rco_2_any_any } from '../operators/rco/rco_2_any_any';
import { rco_2_any_mul_2_scalar_any } from '../operators/rco/rco_2_any_mul_2_scalar_any';
import { rco_2_blade_blade } from '../operators/rco/rco_2_blade_blade';
import { rco_2_mul_2_scalar_any_any } from '../operators/rco/rco_2_mul_2_scalar_any_any';
import { real_any } from '../operators/real/real_any';
import { rect_varargs } from '../operators/rect/rect_varargs';
import { roots_varargs } from '../operators/roots/roots_varargs';
import { round_varargs } from '../operators/round/round_varargs';
import { script_last_0 } from '../operators/script_last/script_last';
import { sgn_varargs } from '../operators/sgn/sgn_varargs';
import { shape_varargs } from '../operators/shape/shape_varargs';
import { simplify_varargs } from '../operators/simplify/simplify_fn';
import { simplify_mul_2_blade_mul_2_blade_any } from '../operators/simplify/simplify_mul_2_blade_mul_2_blade_any';
import { sin_add_2_any_any } from '../operators/sin/sin_add_2_any_any';
import { sin_any } from '../operators/sin/sin_any';
import { sin_hyp } from '../operators/sin/sin_hyp';
import { sin_mul_2_any_imu } from '../operators/sin/sin_mul_2_any_imu';
import { sin_sym } from '../operators/sin/sin_sym';
import { sinh_any } from '../operators/sinh/sinh_any';
import { sinh_flt } from '../operators/sinh/sinh_flt';
import { sinh_rat } from '../operators/sinh/sinh_rat';
import { sinh_sym } from '../operators/sinh/sinh_sym';
import { sqrt_1_any } from '../operators/sqrt/sqrt_1_any';
import { sqrt_1_rat } from '../operators/sqrt/sqrt_1_rat';
import { st_add_2_any_hyp } from '../operators/st/st_add_2_any_hyp';
import { st_any } from '../operators/st/st_any';
import { st_mul_2_rat_any } from '../operators/st/st_mul_2_rat_any';
import { st_rat } from '../operators/st/st_rat';
import { st_sym } from '../operators/st/st_sym';
import { str_extension } from '../operators/str/str_extension';
import { subst_varargs } from '../operators/subst/subst_varargs';
import { succ_any } from '../operators/succ/succ_any';
import { succ_rat } from '../operators/succ/succ_rat';
import { sum_varargs } from '../operators/sum/sum_varargs';
import { is_sym } from '../operators/sym/is_sym';
import { sym_extension } from '../operators/sym/sym_extension';
import { sym_math_add } from '../operators/sym/sym_math_add';
import { sym_math_mul } from '../operators/sym/sym_math_mul';
import { sym_math_pi } from '../operators/sym/sym_math_pi';
import { sym_math_pow } from '../operators/sym/sym_math_pow';
import { tan_varargs } from '../operators/tan/tan_varargs';
import { tanh_varargs } from '../operators/tanh/tanh_varargs';
import { tau } from '../operators/tau/tau';
import { taylor_varargs } from '../operators/taylor/taylor_varargs';
import { tensor_extension } from '../operators/tensor/tensor_extension';
import { testeq_sym_rat } from '../operators/testeq/testeq_sym_rat';
import { testgt_mul_2_any_any_rat } from '../operators/testgt/testgt_mul_2_any_any_rat';
import { testgt_rat_rat } from '../operators/testgt/testgt_rat_rat';
import { testgt_sym_rat } from '../operators/testgt/testgt_sym_rat';
import { testlt_flt_rat } from '../operators/testlt/testlt_flt_rat';
import { testlt_mul_2_any_any_rat } from '../operators/testlt/testlt_mul_2_any_any_rat';
import { testlt_rat_rat } from '../operators/testlt/testlt_rat_rat';
import { testlt_sym_rat } from '../operators/testlt/testlt_sym_rat';
import { transpose_varargs } from '../operators/transpose/transpose_varargs';
import { add_2_mul_2_cos_cos_mul_2_mul_2_rat_sin_sin } from '../operators/trig/add_2_mul_2_cos_cos_mul_2_mul_2_rat_sin_sin';
import { add_2_mul_2_cos_cos_mul_2_sin_sin } from '../operators/trig/add_2_mul_2_cos_cos_mul_2_sin_sin';
import { add_2_mul_2_cos_sin_mul_2_cos_sin_factoring } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_cos_sin_factoring';
import { add_2_mul_2_cos_sin_mul_2_cos_sin_ordering } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_cos_sin_ordering';
import { add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring';
import { add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_ordering } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_ordering';
import { add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos';
import { add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring } from '../operators/trig/add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring';
import { add_2_mul_2_sin_cos_mul_2_cos_sin } from '../operators/trig/add_2_mul_2_sin_cos_mul_2_cos_sin';
import { add_2_mul_2_sin_cos_mul_2_mul_2_rat_cos_sin } from '../operators/trig/add_2_mul_2_sin_cos_mul_2_mul_2_rat_cos_sin';
import { add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin } from '../operators/trig/add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin';
import { add_2_pow_2_cos_rat_pow_2_sin_rat } from '../operators/trig/add_2_pow_2_cos_rat_pow_2_sin_rat';
import { mul_2_sin_cos } from '../operators/trig/mul_2_sin_cos';
import { typeof_any } from '../operators/typeof/typeof_any';
import { typeof_blade } from '../operators/typeof/typeof_blade';
import { typeof_tensor } from '../operators/typeof/typeof_tensor';
import { unit_any } from '../operators/unit/unit_any';
import { uom_1_str } from '../operators/uom/uom_1_str';
import { is_uom, uom_extension } from '../operators/uom/uom_extension';
import { zero_varargs } from '../operators/zero/zero_varargs';
import { MATH_ADD, MATH_INNER, MATH_LCO, MATH_MUL, MATH_OUTER, MATH_RCO } from '../runtime/ns_math';
import { one, zero } from '../tree/rat/Rat';
import { ExtensionEnv } from "./ExtensionEnv";

/**
 * Registers the Operator extension(s) with the environment.
 */
export function define_std_operators($: ExtensionEnv) {

    $.setAssocL(MATH_ADD, true);
    $.setAssocL(MATH_MUL, true);
    $.setAssocL(MATH_LCO, true);
    $.setAssocL(MATH_RCO, true);
    $.setAssocL(MATH_OUTER, true);

    $.setSymbolOrder(MATH_ADD, new AddComparator());
    $.setSymbolOrder(MATH_MUL, new MulComparator());

    $.defineOperator(make_lhs_distrib_expand_law(MATH_MUL, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_MUL, MATH_ADD));

    $.defineOperator(make_lhs_distrib_expand_law(MATH_INNER, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_INNER, MATH_ADD));

    $.defineOperator(factorize_geometric_product_lhs_assoc);

    $.defineOperator(add_2_add_2_rat_mul_2_rat_any_add_2_rat_any);
    $.defineOperator(add_2_add_2_any_mul_2_rat_sym_mul_2_rat_sym);
    $.defineOperator(add_2_add_2_any_mul_2_rat_sym);

    $.defineOperator(add_2_flt_flt);
    $.defineOperator(add_2_flt_rat);
    $.defineOperator(add_2_flt_uom);
    $.defineOperator(add_2_rat_blade);
    $.defineOperator(add_2_rat_uom);
    $.defineOperator(add_2_rat_flt);
    $.defineOperator(add_2_rat_rat);
    $.defineOperator(add_2_rat_sym);
    $.defineOperator(add_2_rat_cons);
    $.defineOperator(add_2_tensor_tensor);
    $.defineOperator(add_2_uom_flt);
    $.defineOperator(add_2_uom_rat);

    // Missing add_sym_flt
    // Missing add_sym_rat
    $.defineOperator(add_2_sym_rat);
    $.defineOperator(add_2_cons_rat);
    $.defineOperator(add_2_xxx_mul_2_rm1_xxx);
    $.defineOperator(add_2_any_mul_2_rat_any);
    $.defineOperator(add_2_blade_mul_2_rat_blade);
    $.defineOperator(add_2_add_2_sym_xxx_xxx);
    $.defineOperator(add_2_add_2_any_imag_real);
    $.defineOperator(add_2_add_2_any_imag_imag);
    // $.defineOperator(add_2_canonical_ordering);
    $.defineOperator(add_2_add_2_any_any_any_factorize_rhs);
    $.defineOperator(add_2_assoc_rhs_canonical_ordering);
    $.defineOperator(add_2_assoc_lhs_factorize_blades);

    // Not needed because it only works for binary expressions.
    // $.defineOperator(add_2_add_any);

    $.defineOperator(add_2_mul_2_rat_X_mul_2_rat_X);
    $.defineOperator(add_2_mul_2_rat_anX_anX);
    $.defineOperator(add_2_mul_2_rat_zzz_aaa);
    $.defineOperator(add_2_mul_2_any_imu_sym);
    $.defineOperator(add_2_mul_2_sin_cos_mul_2_cos_sin);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_cos_sin_ordering);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_cos_sin_factoring);
    $.defineOperator(add_2_mul_2_sin_cos_mul_2_mul_2_rat_cos_sin);
    $.defineOperator(add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin);
    $.defineOperator(add_2_mul_2_cos_cos_mul_2_mul_2_rat_sin_sin);
    $.defineOperator(add_2_mul_2_cos_cos_mul_2_sin_sin);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_ordering);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring);
    $.defineOperator(add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring);
    $.defineOperator(add_2_pow_2_cos_rat_pow_2_sin_rat);
    $.defineOperator(add_2_pow_2_any_any_mul_2_any_any);

    $.defineOperator(add_2_sym_sym);

    $.defineOperator(add_2_blade_blade);
    $.defineOperator(add_2_mul_2_rat_inner_2_sym_sym_outer_2_sym_sym);
    $.defineOperator(add_2_imu_flt);
    $.defineOperator(add_2_any_any_zero_sum);
    $.defineOperator(add_2_any_any_factorize_rhs);
    $.defineOperator(add_varargs);

    $.defineAssociative(MATH_ADD, zero);
    $.defineAssociative(MATH_MUL, one);

    $.defineOperator(pow_2_pow_2_e_any_rat);
    $.defineOperator(pow_2_pow_2_any_rat_rat);
    $.defineOperator(pow_2_e_any);
    $.defineOperator(pow_2_sym_rat);
    $.defineOperator(pow_2_rat_rat);
    $.defineOperator(pow_2_rat_mul_2_rat_rat);
    $.defineOperator(pow_2_flt_rat);
    $.defineOperator(pow_2_imu_rat);
    $.defineOperator(pow_2_uom_rat);
    $.defineOperator(pow_2_cons_rat);
    $.defineOperator(pow_2_blade_rat);
    $.defineOperator(pow_2_any_rat);
    $.defineOperator(pow_2_any_any);
    $.defineOperator(pow);

    $.defineOperator(mul_2_sym_blade);
    $.defineOperator(mul_2_one_any);
    // $.defineOperator(mul_cons_sym);

    $.defineOperator(mul_2_any_rat);
    $.defineOperator(mul_2_flt_flt);
    $.defineOperator(mul_2_flt_rat);
    $.defineOperator(mul_2_flt_imu);
    $.defineOperator(mul_2_flt_uom);
    $.defineOperator(mul_2_flt_mul_2_flt_any);
    $.defineOperator(mul_2_imu_imu);

    $.defineOperator(mul_2_rat_blade);
    $.defineOperator(mul_2_rat_flt);
    $.defineOperator(mul_2_rat_rat);
    $.defineOperator(mul_2_rat_sym);
    $.defineOperator(mul_2_rat_tensor);
    $.defineOperator(mul_2_rat_any);
    $.defineOperator(mul_2_mul_2_rat_any_mul_2_rat_any);

    $.defineOperator(simplify_mul_2_blade_mul_2_blade_any);

    $.defineOperator(mul_2_mul_2_aaa_bbb_bbb);

    // The following is only used for right-associating.
    $.defineOperator(mul_2_mul_2_rat_sym_sym);
    $.defineOperator(mul_2_mul_2_sym_imu_sym);
    $.defineOperator(mul_2_mul_2_any_imu_sym);

    $.defineOperator(mul_2_mul_2_num_any_rat);
    $.defineOperator(mul_2_mul_2_any_imu_imu);
    $.defineOperator(mul_2_mul_2_any_imu_any);
    $.defineOperator(mul_2_mul_2_any_blade_blade);
    $.defineOperator(mul_2_mul_2_any_cons_sym);
    $.defineOperator(mul_2_mul_2_any_sym_imu);
    $.defineOperator(mul_2_mul_2_any_sym_mul_2_imu_sym);
    // Notice how we need three operators in order to provide canonical ordering.
    // TODO: DRY the duplication of hash specification and matching guard functions.
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Flt * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_FLT), MATH_MUL, is_flt, is_uom));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Rat * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_RAT), MATH_MUL, is_flt, is_uom));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Sym * Blade', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM), MATH_MUL, is_sym, is_blade));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Sym * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM), MATH_MUL, is_sym, is_uom));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Blade * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_BLADE), MATH_MUL, is_blade, is_uom));
    $.defineOperator(mul_2_pow_2_xxx_rat_xxx);
    $.defineOperator(mul_2_X_pow_2_X_rat);
    $.defineOperator(mul_2_sym_mul_2_rat_any);
    $.defineOperator(mul_2_sym_flt);
    $.defineOperator(mul_2_hyp_rat);
    $.defineOperator(mul_2_sym_rat);
    $.defineOperator(mul_2_sym_num);
    $.defineOperator(mul_2_sym_sym_general);
    $.defineOperator(mul_2_sym_sym);
    $.defineOperator(mul_2_sym_imu);
    $.defineOperator(mul_2_sym_tensor);
    $.defineOperator(mul_2_tensor_sym);
    $.defineOperator(mul_2_tensor_any);
    $.defineOperator(mul_2_tensor_tensor);
    $.defineOperator(mul_2_mul_2_any_X_pow_2_X_rat);
    $.defineOperator(mul_2_mul_2_any_Z_pow_2_A_any);

    // Distribution Laws in Factoring direction for symmetric and left-associated.
    // This concept should have an abstraction. 
    $.defineOperator(mul_2_pow_2_xxx_any_pow_2_xxx_any);
    // $.defineOperator(mul_2_pow_2_sym_any_pow_2_sym_any);
    $.defineOperator(mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any);

    $.defineOperator(mul_2_hyp_sym);

    // TODO: Notice that this transformer is not being found because Num is not recognized in hashing...
    $.defineOperator(heterogenous_canonical_order('HCO: Flt * Uom', '(* Uom Flt)', MATH_MUL, is_flt, is_uom));
    $.defineOperator(heterogenous_canonical_order('HCO: Rat * Uom', '(* Uom Rat)', MATH_MUL, is_rat, is_uom));
    $.defineOperator(heterogenous_canonical_order('HCO: Sym * Blade', '(* Blade Sym)', MATH_MUL, is_sym, is_blade));
    $.defineOperator(heterogenous_canonical_order('HCO: Sym * Uom', '(* Uom Sym)', MATH_MUL, is_sym, is_uom));
    $.defineOperator(heterogenous_canonical_order('HCO: Blade * Uom', '(* Uom Blade)', MATH_MUL, is_blade, is_uom));
    $.defineOperator(mul_2_uom_rat);
    $.defineOperator(mul_2_uom_flt);
    $.defineOperator(mul_2_uom_uom);

    $.defineOperator(mul_2_blade_rat);
    $.defineOperator(mul_2_blade_sym);
    $.defineOperator(mul_2_blade_blade);
    $.defineOperator(mul_2_scalar_blade);
    $.defineOperator(mul_2_sin_cos);
    $.defineOperator(mul_varargs);

    $.defineOperator(binomial_varargs);
    $.defineOperator(choose_varargs);

    $.defineOperator(conj_inner);
    $.defineOperator(conj_sym);
    $.defineOperator(conj_rat);
    $.defineOperator(conj_flt);
    $.defineOperator(conj_imaginary_unit);
    $.defineOperator(conj_blade);
    $.defineOperator(conj_mul_2_any_any);
    $.defineOperator(conj_any);

    $.defineOperator(degree_varargs);

    $.defineOperator(gamma_varargs);

    $.defineOperator(gcd_varargs);

    $.defineOperator(hermite_varargs);

    $.defineOperator(inner_2_num_num);
    $.defineOperator(inner_2_rat_imu);
    $.defineOperator(inner_2_rat_sym);
    $.defineOperator(inner_2_rat_any);
    $.defineOperator(inner_2_imu_rat);
    $.defineOperator(inner_2_imu_imu);
    $.defineOperator(inner_2_imu_any);
    $.defineOperator(inner_2_sym_sym);
    $.defineOperator(inner_2_vec_scalar);
    $.defineOperator(inner_2_blade_blade);
    $.defineOperator(inner_2_real_any);
    $.defineOperator(inner_2_any_real);
    $.defineOperator(inner_2_any_rat);
    $.defineOperator(inner_2_any_imu);
    $.defineOperator(inner_extension);

    $.defineOperator(laguerre_varargs);

    $.defineOperator(lcm_varargs);

    $.defineOperator(lco_2_blade_blade);
    $.defineOperator(make_lhs_distrib_expand_law(MATH_LCO, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_LCO, MATH_ADD));
    $.defineOperator(lco_2_mul_2_scalar_any_any);
    $.defineOperator(lco_2_any_mul_2_scalar_any);
    $.defineOperator(lco_2_any_any);

    $.defineOperator(legendre_varargs);

    $.defineOperator(log_varargs);
    $.defineOperator(mod_varargs);

    $.defineOperator(outer_2_blade_blade);
    $.defineOperator(make_lhs_distrib_expand_law(MATH_OUTER, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_OUTER, MATH_ADD));
    $.defineOperator(outer_2_mul_2_scalar_any_any);
    // $.defineOperator(outer_2_sym_sym_vector_antisymmetry);
    // $.defineOperator(outer_2_sym_sym_vector_to_geometric);
    $.defineOperator(outer_2_sym_sym);
    $.defineOperator(outer_2_tensor_tensor);
    $.defineOperator(outer_2_any_mul_2_scalar_any);
    $.defineOperator(outer_2_any_any);

    $.defineOperator(rank_varargs);

    $.defineOperator(rco_2_blade_blade);
    $.defineOperator(make_lhs_distrib_expand_law(MATH_RCO, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_RCO, MATH_ADD));
    $.defineOperator(rco_2_mul_2_scalar_any_any);
    $.defineOperator(rco_2_any_mul_2_scalar_any);
    $.defineOperator(rco_2_any_any);

    $.defineOperator(boo_extension);
    $.defineOperator(rat_extension);
    $.defineOperator(flt_extension);
    $.defineOperator(str_extension);

    $.defineOperator(abs_rat);
    $.defineOperator(abs_sym_real);
    $.defineOperator(abs_any);
    $.defineOperator(abs_factorize);

    $.defineOperator(adj_any);

    $.defineOperator(algebra_2_tensor_tensor);
    $.defineOperator(and_varargs);
    $.defineOperator(arccos_varargs);
    $.defineOperator(arccosh_varargs);
    $.defineOperator(arcsin_varargs);
    $.defineOperator(arcsinh_any);
    $.defineOperator(arctan_varargs);
    $.defineOperator(arctanh_varargs);
    $.defineOperator(arg_varargs);

    $.defineOperator(assign_sym_any);
    $.defineOperator(assign_any_any);

    $.defineOperator(besselj_varargs);
    $.defineOperator(bessely_varargs);

    $.defineOperator(ceiling_flt);
    $.defineOperator(ceiling_rat);
    $.defineOperator(ceiling_any);

    $.defineOperator(circexp_any);

    $.defineOperator(clock_any);
    $.defineOperator(coeff_varargs);
    $.defineOperator(cofactor_varargs);
    $.defineOperator(condense_varargs);
    $.defineOperator(contract_varargs);

    $.defineOperator(cos_add_2_any_any);
    $.defineOperator(cos_mul_2_any_imu);
    $.defineOperator(cos_sym);
    $.defineOperator(cos_hyp);
    $.defineOperator(cos_any);

    $.defineOperator(cosh_sym);
    $.defineOperator(cosh_varargs);

    $.defineOperator(cross_blade_blade);
    $.defineOperator(make_lhs_distrib_expand_law(MATH_VECTOR_CROSS_PRODUCT, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_VECTOR_CROSS_PRODUCT, MATH_ADD));
    $.defineOperator(cross_any_any);

    $.defineOperator(defint);
    $.defineOperator(denominator_fn);

    $.defineOperator(d_to_derivative);
    $.defineOperator(derivative_2_mul_any);
    $.defineOperator(derivative_2_pow_any);
    $.defineOperator(derivative_2_sym_sym);
    $.defineOperator(derivative_fn);

    $.defineOperator(det_any);

    $.defineOperator(dim_varargs);
    $.defineOperator(dirac_varargs);
    $.defineOperator(divisors_varargs);

    $.defineOperator(do_varargs);

    $.defineOperator(eigen_varargs);
    $.defineOperator(eigenval_varargs);
    $.defineOperator(eigenvec_varargs);

    $.defineOperator(erf_varargs);
    $.defineOperator(erfc_varargs);

    $.defineOperator(eval_varargs);

    $.defineOperator(exp_flt);
    $.defineOperator(exp_rat);
    $.defineOperator(exp_any);

    $.defineOperator(expcos_varargs);
    $.defineOperator(expsin_varargs);

    $.defineOperator(factor_varargs);
    $.defineOperator(factorial_varargs);

    $.defineOperator(float_mul_2_flt_sym);
    $.defineOperator(float_cons);
    $.defineOperator(float_sym_pi);
    $.defineOperator(float_sym);
    $.defineOperator(float_flt);
    $.defineOperator(float_rat);
    $.defineOperator(float_imu);
    $.defineOperator(floor_varargs);

    $.defineOperator(for_varargs);

    $.defineOperator(hilbert_varargs);

    $.defineOperator(imag_any);

    $.defineOperator(index_varargs);

    $.defineOperator(integral_varargs);
    $.defineOperator(inv_any);
    $.defineOperator(isprime_varargs);
    $.defineOperator(iszero_rat);
    $.defineOperator(iszero_any);

    $.defineOperator(not_fn);
    $.defineOperator(number_fn);
    $.defineOperator(numerator_fn);
    $.defineOperator(nroots_varargs);
    $.defineOperator(or_varargs);

    $.defineOperator(pred_rat);
    $.defineOperator(pred_any);
    $.defineOperator(polar_varargs);

    $.defineOperator(printlist_1_any);
    $.defineOperator(printlist_keyword);

    $.defineOperator(product_varargs);

    $.defineOperator(quote_varargs);
    $.defineOperator(quotient_varargs);
    $.defineOperator(rationalize_fn);
    $.defineOperator(real_any);
    $.defineOperator(rect_varargs);
    $.defineOperator(roots_varargs);
    $.defineOperator(round_varargs);

    $.defineOperator(script_last_0);
    $.defineOperator(sgn_varargs);
    $.defineOperator(shape_varargs);
    $.defineOperator(simplify_varargs);

    $.defineOperator(sinh_flt);
    $.defineOperator(sinh_rat);
    $.defineOperator(sinh_sym);
    $.defineOperator(sinh_any);

    $.defineOperator(succ_rat);
    $.defineOperator(succ_any);

    $.defineOperator(sin_add_2_any_any);
    $.defineOperator(sin_sym);
    $.defineOperator(sin_hyp);
    $.defineOperator(sin_mul_2_any_imu);
    $.defineOperator(sin_any);

    $.defineOperator(sqrt_1_rat);
    $.defineOperator(sqrt_1_any);

    $.defineOperator(st_add_2_any_hyp);
    $.defineOperator(st_mul_2_rat_any);
    $.defineOperator(st_rat);
    $.defineOperator(st_sym);
    $.defineOperator(st_any);

    $.defineOperator(subst_varargs);
    $.defineOperator(sum_varargs);

    $.defineOperator(taylor_varargs);
    $.defineOperator(tan_varargs);
    $.defineOperator(tanh_varargs);
    $.defineOperator(tau);

    $.defineOperator(typeof_tensor);
    $.defineOperator(typeof_blade);
    $.defineOperator(typeof_any);


    $.defineOperator(testeq_sym_rat);

    $.defineOperator(testlt_flt_rat);
    $.defineOperator(testlt_rat_rat);
    $.defineOperator(testlt_sym_rat);
    $.defineOperator(testlt_mul_2_any_any_rat);

    $.defineOperator(testgt_rat_rat);
    $.defineOperator(testgt_sym_rat);
    $.defineOperator(testgt_mul_2_any_any_rat);

    $.defineOperator(transpose_varargs);

    $.defineOperator(sym_math_add);
    $.defineOperator(sym_math_mul);
    $.defineOperator(sym_math_pow);
    $.defineOperator(sym_math_pi);

    $.defineOperator(sym_extension);
    $.defineOperator(tensor_extension);
    $.defineOperator(blade_extension);
    $.defineOperator(uom_extension);
    $.defineOperator(hyp_extension);
    $.defineOperator(err_extension);
    $.defineOperator(imu_extension);

    $.defineOperator(unit_any);

    $.defineOperator(uom_1_str);

    $.defineOperator(zero_varargs);

    // NIL is implemented as an empty Cons, so it has to be defined before the generic Cons operator.
    $.defineOperator(nil_extension);

    // There is no fallback. We migrate everything.
    $.defineOperator(cons_extension);
}
