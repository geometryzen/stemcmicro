import { Eval_approxratio } from '../approxratio';
import { AddComparator } from '../calculators/compare/comparator_add';
import { MulComparator } from '../calculators/compare/comparator_mul';
import { Eval_clear, Eval_clearall } from '../clear';
import { hash_binop_cons_atom, HASH_BLADE, HASH_FLT, HASH_RAT, HASH_SYM } from '../hashing/hash_info';
import { Native } from '../native/Native';
import { native_sym } from '../native/native_sym';
import { Eval_nroots } from '../nroots';
import { abs_add } from '../operators/abs/abs_add';
import { abs_add_blades } from '../operators/abs/abs_add_blades';
import { abs_any } from '../operators/abs/abs_any';
import { abs_blade } from '../operators/abs/abs_blade';
import { abs_exp } from '../operators/abs/abs_exp';
import { abs_flt } from '../operators/abs/abs_flt';
import { abs_imu } from '../operators/abs/abs_imu';
import { abs_pow_any_negone } from '../operators/abs/abs_pow_any_negone';
import { abs_rat } from '../operators/abs/abs_rat';
import { abs_sym } from '../operators/abs/abs_sym';
import { abs_tensor } from '../operators/abs/abs_tensor';
import { abs_uom } from '../operators/abs/abs_uom';
import { add_2_add_2_any_any_any_factorize_rhs } from '../operators/add/add_2_add_2_any_any_any_factorize_rhs';
import { add_2_add_2_any_mul_2_rat_sym } from '../operators/add/add_2_add_2_any_sym_mul_2_rat_sym';
import { add_2_any_any_factorize_rhs } from '../operators/add/add_2_any_any_factorize_rhs';
import { add_2_any_any_zero_sum } from '../operators/add/add_2_any_any_zero_sum';
import { add_2_blade_blade } from '../operators/add/add_2_blade_blade';
import { add_2_blade_mul_2_rat_blade } from '../operators/add/add_2_blade_mul_2_rat_blade';
import { add_2_flt_any } from '../operators/add/add_2_flt_any';
import { add_2_flt_flt } from '../operators/add/add_2_flt_flt';
import { add_2_flt_rat } from '../operators/add/add_2_flt_rat';
import { add_2_flt_uom } from '../operators/add/add_2_flt_uom';
import { add_2_imu_flt } from '../operators/add/add_2_imu_flt';
import { add_2_mul_2_any_imu_sym } from '../operators/add/add_2_mul_2_any_imu_sym';
import { add_2_mul_2_rat_X_mul_2_rat_X } from '../operators/add/add_2_mul_2_rat_X_mul_2_rat_X';
import { add_2_mul_2_rat_zzz_aaa } from '../operators/add/add_2_mul_2_rat_zzz_aaa';
import { add_2_rat_blade } from '../operators/add/add_2_rat_blade';
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
import { arccos_varargs } from '../operators/arccos/arccos_varargs';
import { arccosh_varargs } from '../operators/arccosh/arccosh_varargs';
import { arcsin_varargs } from '../operators/arcsin/arcsin_varargs';
import { arcsinh_any } from '../operators/arcsinh/arcsinh_any';
import { arctan_varargs } from '../operators/arctan/arctan_varargs';
import { arctanh_varargs } from '../operators/arctanh/arctanh_varargs';
import { arg_add } from '../operators/arg/arg_add';
import { arg_any } from '../operators/arg/arg_any';
import { arg_flt } from '../operators/arg/arg_flt';
import { arg_imu } from '../operators/arg/arg_imu';
import { arg_mul } from '../operators/arg/arg_mul';
import { arg_pow } from '../operators/arg/arg_pow';
import { arg_rat } from '../operators/arg/arg_rat';
import { arg_sym } from '../operators/arg/arg_sym';
import { assign_any_any } from '../operators/assign/assign_any_any';
import { assign_sym_any } from '../operators/assign/assign_sym_any';
import { besselj_varargs } from '../operators/besselj/besselj_varargs';
import { bessely_varargs } from '../operators/bessely/bessely_varargs';
import { binomial_varargs } from '../operators/binomial/binomial_varargs';
import { blade_extension } from '../operators/blade/blade_extension';
import { is_blade } from '../operators/blade/is_blade';
import { boo_extension } from '../operators/boo/boo_extension';
import { ceiling_cons } from '../operators/ceiling/ceiling_cons';
import { ceiling_flt } from '../operators/ceiling/ceiling_flt';
import { ceiling_rat } from '../operators/ceiling/ceiling_rat';
import { Eval_check } from '../operators/check/Eval_check';
import { choose_varargs } from '../operators/choose/choose_varargs';
import { circexp_any } from '../operators/circexp/circexp_any';
import { clock_any } from '../operators/clock/clock_any';
import { coeff_varargs } from '../operators/coeff/coeff_varargs';
import { cofactor_varargs } from '../operators/cofactor/cofactor_varargs';
import { condense_varargs } from '../operators/condense/condense_varargs';
import { conj_add } from '../operators/conj/conj_add';
import { conj_any } from '../operators/conj/conj_any';
import { conj_blade } from '../operators/conj/conj_blade';
import { conj_flt } from '../operators/conj/conj_flt';
import { conj_imu } from '../operators/conj/conj_imu';
import { conj_inner } from '../operators/conj/conj_inner';
import { conj_mul } from '../operators/conj/conj_mul';
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
import { exp } from '../operators/exp/exp';
import { exp_add } from '../operators/exp/exp_add';
import { exp_flt } from '../operators/exp/exp_flt';
import { exp_imu } from '../operators/exp/exp_imu';
import { exp_log } from '../operators/exp/exp_log';
import { exp_mul } from '../operators/exp/exp_mul';
import { exp_rat } from '../operators/exp/exp_rat';
import { expand_extension } from '../operators/expand/expand_extension';
import { expcos_varargs } from '../operators/expcos/expcos_varargs';
import { expsin_varargs } from '../operators/expsin/expsin_varargs';
import { factor_varargs } from '../operators/factor/factor_varargs';
import { factorial_varargs } from '../operators/factorial/factorial_varargs';
import { float_varargs } from '../operators/float/float_varargs';
import { floor_varargs } from '../operators/floor/floor_varargs';
import { flt_extension, is_flt } from '../operators/flt/flt_extension';
import { for_varargs } from '../operators/for/for_varargs';
import { gamma_varargs } from '../operators/gamma/gamma_varargs';
import { gcd_varargs } from '../operators/gcd/gcd_varargs';
import { heterogenous_canonical_order_lhs_assoc } from '../operators/helpers/heterogenous_canonical_order_lhs_assoc';
import { hermite_varargs } from '../operators/hermite/hermite_varargs';
import { hilbert_varargs } from '../operators/hilbert/hilbert_varargs';
import { hyp_extension } from '../operators/hyp/hyp_extension';
import { imag_add } from '../operators/imag/imag_add';
import { imag_any } from '../operators/imag/imag_any';
import { imag_arctan_rat } from '../operators/imag/imag_arctan_rat';
import { imag_cos } from '../operators/imag/imag_cos';
import { imag_exp } from '../operators/imag/imag_exp';
import { imag_flt } from '../operators/imag/imag_flt';
import { imag_imu } from '../operators/imag/imag_imu';
import { imag_log_rat } from '../operators/imag/imag_log_rat';
import { imag_mul } from '../operators/imag/imag_mul';
import { imag_mul_i_times_any } from '../operators/imag/imag_mul_i_times_any';
import { imag_pow_e_rat } from '../operators/imag/imag_pow_e_rat';
import { imag_pow_e_sym } from '../operators/imag/imag_pow_e_sym';
import { imag_pow_rat_rat } from '../operators/imag/imag_pow_rat_rat';
import { imag_pow_z_negone } from '../operators/imag/imag_pow_z_negone';
import { imag_rat } from '../operators/imag/imag_rat';
import { imag_sin } from '../operators/imag/imag_sin';
import { imag_sym } from '../operators/imag/imag_sym';
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
import { inv_inv } from '../operators/inv/inv_inv';
import { is_complex_any } from '../operators/iscomplex/is_complex_any';
import { is_complex_sym } from '../operators/iscomplex/is_complex_sym';
import { isprime_varargs } from '../operators/isprime/isprime_varargs';
import { is_real_pow_any_negone } from '../operators/isreal/isreal_pow_any_negone';
import { is_real_abs } from '../operators/isreal/is_real_abs';
import { is_real_add } from '../operators/isreal/is_real_add';
import { is_real_any } from '../operators/isreal/is_real_any';
import { isreal_holomorphic, is_real_cos } from '../operators/isreal/is_real_cos';
import { is_real_flt } from '../operators/isreal/is_real_flt';
import { is_real_imag } from '../operators/isreal/is_real_imag';
import { is_real_imu } from '../operators/isreal/is_real_imu';
import { is_real_mul } from '../operators/isreal/is_real_mul';
import { is_real_pow_e_sym } from '../operators/isreal/is_real_pow_e_syml';
import { is_real_pow_imu_rat } from '../operators/isreal/is_real_pow_imu_rat';
import { is_real_pow_rat_rat } from '../operators/isreal/is_real_pow_rat_rat';
import { is_real_pow_sym_rat } from '../operators/isreal/is_real_pow_sym_rat';
import { is_real_rat } from '../operators/isreal/is_real_rat';
import { is_real_real } from '../operators/isreal/is_real_real';
import { is_real_sin } from '../operators/isreal/is_real_sin';
import { make_predicate_sym_operator } from '../operators/isreal/is_real_sym';
import { iszero_any } from '../operators/iszero/iszero_any';
import { iszero_rat } from '../operators/iszero/iszero_rat';
import { laguerre_varargs } from '../operators/laguerre/laguerre_varargs';
import { lcm_varargs } from '../operators/lcm/lcm_varargs';
import { lco_2_any_any } from '../operators/lco/lco_2_any_any';
import { lco_2_blade_blade } from '../operators/lco/lco_2_blade_blade';
import { legendre_varargs } from '../operators/legendre/legendre_varargs';
import { log_exp } from '../operators/log/log_exp';
import { log_flt } from '../operators/log/log_flt';
import { log_mul } from '../operators/log/log_mul';
import { log_pow } from '../operators/log/log_pow';
import { log_rat } from '../operators/log/log_rat';
import { log_sym } from '../operators/log/log_sym';
import { log_varargs } from '../operators/log/log_varargs';
import { mod_varargs } from '../operators/mod/mod_varargs';
import { mul_2_any_flt } from '../operators/mul/mul_2_any_flt';
import { mul_2_any_rat } from '../operators/mul/mul_2_any_rat';
import { mul_2_blade_blade } from '../operators/mul/mul_2_blade_blade';
import { mul_2_blade_rat } from '../operators/mul/mul_2_blade_rat';
import { mul_2_flt_any } from '../operators/mul/mul_2_flt_any';
import { mul_2_flt_flt } from '../operators/mul/mul_2_flt_flt';
import { mul_2_flt_imu } from '../operators/mul/mul_2_flt_imu';
import { mul_2_flt_mul_2_flt_any } from '../operators/mul/mul_2_flt_mul_2_flt_any';
import { mul_2_flt_rat } from '../operators/mul/mul_2_flt_rat';
import { mul_2_flt_uom } from '../operators/mul/mul_2_flt_uom';
import { mul_2_hyp_rat } from '../operators/mul/mul_2_hyp_rat';
import { mul_2_hyp_sym } from '../operators/mul/mul_2_hyp_sym';
import { mul_2_imu_flt } from '../operators/mul/mul_2_imu_flt';
import { mul_2_imu_imu } from '../operators/mul/mul_2_imu_imu';
import { mul_2_mul_2_any_cons_sym } from '../operators/mul/mul_2_mul_2_any_cons_sym';
import { mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any } from '../operators/mul/mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any';
import { mul_2_mul_2_any_sym_imu } from '../operators/mul/mul_2_mul_2_any_sym_imu';
import { mul_2_mul_2_any_sym_mul_2_imu_sym } from '../operators/mul/mul_2_mul_2_any_sym_mul_2_imu_sym';
import { mul_2_mul_2_any_X_pow_2_X_rat } from '../operators/mul/mul_2_mul_2_any_X_pow_2_X_rat';
import { mul_2_mul_2_any_Z_pow_2_A_any } from '../operators/mul/mul_2_mul_2_any_Z_pow_2_A_any';
import { mul_2_mul_2_rat_any_mul_2_rat_any } from '../operators/mul/mul_2_mul_2_rat_any_mul_2_rat_any';
import { mul_2_mul_2_sym_imu_sym } from '../operators/mul/mul_2_mul_2_sym_imu_sym';
import { mul_2_pow_2_xxx_any_pow_2_xxx_any } from '../operators/mul/mul_2_pow_2_xxx_any_pow_2_xxx_any';
import { mul_2_pow_2_xxx_rat_xxx } from '../operators/mul/mul_2_pow_2_xxx_rat_xxx';
import { mul_2_rat_any } from '../operators/mul/mul_2_rat_any';
import { mul_2_rat_blade } from '../operators/mul/mul_2_rat_blade';
import { mul_2_rat_flt } from '../operators/mul/mul_2_rat_flt';
import { mul_2_rat_rat } from '../operators/mul/mul_2_rat_rat';
import { mul_2_rat_sym } from '../operators/mul/mul_2_rat_sym';
import { mul_2_rat_tensor } from '../operators/mul/mul_2_rat_tensor';
import { mul_2_sym_blade } from '../operators/mul/mul_2_sym_blade';
import { mul_2_sym_imu } from '../operators/mul/mul_2_sym_imu';
import { mul_2_sym_mul_2_rat_any } from '../operators/mul/mul_2_sym_mul_2_rat_any';
import { mul_2_sym_num } from '../operators/mul/mul_2_sym_num';
import { mul_2_sym_rat } from '../operators/mul/mul_2_sym_rat';
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
import { number_fn } from '../operators/number/number_fn';
import { numerator_fn } from '../operators/numerator/numerator_fn';
import { or_varargs } from '../operators/or/or_varargs';
import { outer_2_any_any } from '../operators/outer/outer_2_any_any';
import { outer_2_any_mul_2_scalar_any } from '../operators/outer/outer_2_any_mul_2_scalar_any';
import { outer_2_blade_blade } from '../operators/outer/outer_2_blade_blade';
import { outer_2_mul_2_scalar_any_any } from '../operators/outer/outer_2_mul_2_scalar_any_any';
import { outer_2_sym_sym } from '../operators/outer/outer_2_sym_sym';
import { outer_2_tensor_tensor } from '../operators/outer/outer_2_tensor_tensor';
import { Eval_polar } from '../operators/polar/polar';
import { pow_2_imu_rat } from '../operators/pow/pow_2_imu_rat';
import { pow_2_pow_2_e_any_rat } from '../operators/pow/pow_2_pow_2_e_any_rat';
import { pow_e_any } from '../operators/pow/pow_e_any';
import { pow_e_log } from '../operators/pow/pow_e_log';
import { pow_e_rat } from '../operators/pow/pow_e_rat';
import { pow_rat_rat } from '../operators/pow/pow_rat_rat';
import { pow_rat_sym } from '../operators/pow/pow_rat_sym';
import { pred_any } from '../operators/pred/pred_any';
import { pred_rat } from '../operators/pred/pred_rat';
import { make_printmode_keyword } from '../operators/printing/make_printmode_keyword';
import { make_printmode_operator } from '../operators/printing/make_printmode_operator';
import { product_varargs } from '../operators/product/product_varargs';
import { Eval_quote } from '../operators/quote/quote_varargs';
import { quotient_varargs } from '../operators/quotient/quotient_varargs';
import { rank_varargs } from '../operators/rank/rank_varargs';
import { rat_extension } from '../operators/rat/rat_extension';
import { rationalize_fn } from '../operators/rationalize/rationalize_fn';
import { rco_2_any_any } from '../operators/rco/rco_2_any_any';
import { rco_2_any_mul_2_scalar_any } from '../operators/rco/rco_2_any_mul_2_scalar_any';
import { rco_2_blade_blade } from '../operators/rco/rco_2_blade_blade';
import { rco_2_mul_2_scalar_any_any } from '../operators/rco/rco_2_mul_2_scalar_any_any';
import { real_add } from '../operators/real/real_add';
import { real_any } from '../operators/real/real_any';
import { real_arctan_rat } from '../operators/real/real_arctan_rat';
import { real_cos } from '../operators/real/real_cos';
import { real_exp } from '../operators/real/real_exp';
import { real_flt } from '../operators/real/real_flt';
import { real_holomorphic } from '../operators/real/real_holomorphic';
import { real_imag } from '../operators/real/real_imag';
import { real_imu } from '../operators/real/real_imu';
import { real_log_imu } from '../operators/real/real_log_imu';
import { real_log_rat } from '../operators/real/real_log_rat';
import { real_mul } from '../operators/real/real_mul';
import { real_pow_rat_rat } from '../operators/real/real_pow_rat_rat';
import { real_rat } from '../operators/real/real_rat';
import { real_real } from '../operators/real/real_real';
import { real_sym } from '../operators/real/real_sym';
import { Eval_rect } from '../operators/rect/rect';
import { rect_mul_rat_any } from '../operators/rect/rect_mul_rat_any';
import { rect_pow_exp_imu } from '../operators/rect/rect_pow_exp_imu';
import { roots_varargs } from '../operators/roots/roots_varargs';
import { round_varargs } from '../operators/round/round_varargs';
import { script_last_0 } from '../operators/script_last/script_last';
import { sgn_any } from '../operators/sgn/sgn_any';
import { sgn_flt } from '../operators/sgn/sgn_flt';
import { sgn_rat } from '../operators/sgn/sgn_rat';
import { shape_varargs } from '../operators/shape/shape_varargs';
import { simplify_varargs } from '../operators/simplify/simplify_fn';
import { simplify_mul_2_blade_mul_2_blade_any } from '../operators/simplify/simplify_mul_2_blade_mul_2_blade_any';
import { sin_add } from '../operators/sin/sin_add';
import { sin_any } from '../operators/sin/sin_any';
import { sin_flt } from '../operators/sin/sin_flt';
import { sin_hyp } from '../operators/sin/sin_hyp';
import { sin_mul } from '../operators/sin/sin_mul';
import { sin_rat } from '../operators/sin/sin_rat';
import { sin_sym } from '../operators/sin/sin_sym';
import { sinh_any } from '../operators/sinh/sinh_any';
import { sinh_flt } from '../operators/sinh/sinh_flt';
import { sinh_rat } from '../operators/sinh/sinh_rat';
import { sinh_sym } from '../operators/sinh/sinh_sym';
import { sqrt_any } from '../operators/sqrt/sqrt_any';
import { sqrt_rat } from '../operators/sqrt/sqrt_rat';
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
import { AND, APPROXRATIO, CHECK, CLEAR, CLEARALL, NROOTS, POLAR, PREDICATE_IS_REAL, QUOTE, RECT, TESTGE, TESTGT, TESTLE, TESTLT } from '../runtime/constants';
import { defs, PRINTMODE_ASCII, PRINTMODE_HUMAN, PRINTMODE_INFIX, PRINTMODE_LATEX, PRINTMODE_SEXPR } from '../runtime/defs';
import { MATH_INNER, MATH_LCO, MATH_MUL, MATH_OUTER, MATH_POW, MATH_RCO } from '../runtime/ns_math';
import { Eval_power } from '../scripting/eval_power';
import { Eval_and, Eval_test, Eval_testeq, Eval_testge, Eval_testgt, Eval_testle, Eval_testlt, Eval_testne } from '../test';
import { one, zero } from '../tree/rat/Rat';
import { ExtensionEnv } from "./ExtensionEnv";
export function define_std_operators($: ExtensionEnv) {
    // 
    const MATH_ADD = native_sym(Native.add);
    const COS = native_sym(Native.cos);
    const EXP = native_sym(Native.exp);
    const FACTORIAL = native_sym(Native.factorial);
    const SIN = native_sym(Native.sin);
    const TEST = native_sym(Native.test);
    const TESTEQ = native_sym(Native.test_eq);
    const TESTNE = native_sym(Native.test_ne);

    $.setSymbolOrder(MATH_ADD, new AddComparator());
    $.setSymbolOrder(MATH_MUL, new MulComparator());

    $.defineOperator(make_lhs_distrib_expand_law(MATH_MUL, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_MUL, MATH_ADD));

    $.defineOperator(make_lhs_distrib_expand_law(MATH_INNER, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_INNER, MATH_ADD));

    $.defineOperator(add_2_add_2_any_mul_2_rat_sym);

    $.defineOperator(add_2_flt_flt);
    $.defineOperator(add_2_flt_rat);    // Possibly redundant now that we have (+ Flt U)
    $.defineOperator(add_2_flt_uom);    // You can't add a Flt to a Uom, but you might multiply a Flt be a Uom.
    $.defineOperator(add_2_flt_any);
    $.defineOperator(add_2_rat_blade);
    $.defineOperator(add_2_rat_uom);
    $.defineOperator(add_2_rat_flt);
    $.defineOperator(add_2_rat_rat);
    $.defineOperator(add_2_rat_sym);
    $.defineOperator(add_2_tensor_tensor);
    $.defineOperator(add_2_uom_flt);
    $.defineOperator(add_2_uom_rat);

    // Missing add_sym_flt
    // Missing add_sym_rat
    $.defineOperator(add_2_sym_rat);
    $.defineOperator(add_2_xxx_mul_2_rm1_xxx);
    $.defineOperator(add_2_blade_mul_2_rat_blade);
    $.defineOperator(add_2_add_2_any_any_any_factorize_rhs);

    // Not needed because it only works for binary expressions.
    // $.defineOperator(add_2_add_any);

    $.defineOperator(add_2_mul_2_rat_X_mul_2_rat_X);
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

    $.defineOperator(add_2_sym_sym);

    $.defineOperator(add_2_blade_blade);
    $.defineOperator(add_2_imu_flt);
    $.defineOperator(add_2_any_any_zero_sum);
    $.defineOperator(add_2_any_any_factorize_rhs);
    $.defineOperator(add_varargs);

    $.defineAssociative(MATH_ADD, zero);
    $.defineAssociative(MATH_MUL, one);

    // TODO: See what these do.
    $.defineOperator(pow_2_pow_2_e_any_rat);
    // $.defineOperator(pow_2_pow_2_any_rat_rat);
    $.defineOperator(pow_e_rat);
    $.defineOperator(pow_e_log);
    $.defineOperator(pow_e_any);
    $.defineOperator(pow_rat_sym);
    // $.defineOperator(pow_2_sym_rat);
    $.defineOperator(pow_rat_rat);
    // $.defineOperator(pow_2_rat_mul_2_rat_rat);
    // $.defineOperator(pow_2_flt_rat);
    $.defineOperator(pow_2_imu_rat);
    // $.defineOperator(pow_2_uom_rat);
    // $.defineOperator(pow_2_blade_rat);
    // $.defineOperator(pow_2_any_rat);
    // $.defineOperator(pow_2_any_any);
    // $.defineOperator(pow);
    $.defineConsTransformer(MATH_POW, Eval_power);

    $.defineOperator(mul_2_sym_blade);
    // $.defineOperator(mul_cons_sym);

    $.defineOperator(mul_2_any_flt);
    $.defineOperator(mul_2_any_rat);
    $.defineOperator(mul_2_flt_flt);
    $.defineOperator(mul_2_flt_rat);
    $.defineOperator(mul_2_flt_imu);
    $.defineOperator(mul_2_flt_uom);
    $.defineOperator(mul_2_flt_mul_2_flt_any);
    $.defineOperator(mul_2_flt_any);
    $.defineOperator(mul_2_imu_flt);
    $.defineOperator(mul_2_imu_imu);

    $.defineOperator(mul_2_rat_blade);
    $.defineOperator(mul_2_rat_flt);
    $.defineOperator(mul_2_rat_rat);
    $.defineOperator(mul_2_rat_sym);
    $.defineOperator(mul_2_rat_tensor);
    $.defineOperator(mul_2_rat_any);
    $.defineOperator(mul_2_mul_2_rat_any_mul_2_rat_any);

    $.defineOperator(simplify_mul_2_blade_mul_2_blade_any);

    // The following is only used for right-associating.
    $.defineOperator(mul_2_mul_2_sym_imu_sym);

    // $.defineOperator(mul_2_mul_2_num_any_rat);
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
    $.defineOperator(mul_2_hyp_rat);
    $.defineOperator(mul_2_sym_rat);
    $.defineOperator(mul_2_sym_num);
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
    $.defineOperator(mul_2_uom_rat);
    $.defineOperator(mul_2_uom_flt);
    $.defineOperator(mul_2_uom_uom);

    $.defineOperator(mul_2_blade_rat);
    $.defineOperator(mul_2_blade_blade);
    $.defineOperator(mul_2_sin_cos);
    $.defineOperator(mul_varargs);

    $.defineConsTransformer(APPROXRATIO, Eval_approxratio);
    $.defineOperator(binomial_varargs);
    $.defineConsTransformer(CHECK, Eval_check);

    $.defineOperator(choose_varargs);
    $.defineConsTransformer(CLEAR, Eval_clear);
    $.defineKeyword(CLEARALL, Eval_clearall);

    $.defineOperator(conj_add);
    $.defineOperator(conj_inner);
    $.defineOperator(conj_sym);
    $.defineOperator(conj_rat);
    $.defineOperator(conj_flt);
    $.defineOperator(conj_imu);
    $.defineOperator(conj_blade);
    $.defineOperator(conj_mul);
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
    $.defineOperator(lco_2_any_any);

    $.defineOperator(legendre_varargs);

    $.defineOperator(log_exp);
    $.defineOperator(log_flt);
    $.defineOperator(log_mul);
    $.defineOperator(log_pow);
    $.defineOperator(log_rat);
    $.defineOperator(log_sym);
    $.defineOperator(log_varargs);

    $.defineOperator(mod_varargs);

    $.defineOperator(outer_2_blade_blade);
    $.defineOperator(outer_2_tensor_tensor);
    $.defineOperator(make_lhs_distrib_expand_law(MATH_OUTER, MATH_ADD));
    $.defineOperator(make_rhs_distrib_expand_law(MATH_OUTER, MATH_ADD));
    $.defineOperator(outer_2_mul_2_scalar_any_any);
    // $.defineOperator(outer_2_sym_sym_vector_antisymmetry);
    // $.defineOperator(outer_2_sym_sym_vector_to_geometric);
    $.defineOperator(outer_2_sym_sym);
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

    $.defineOperator(abs_add_blades);
    $.defineOperator(abs_add);
    $.defineOperator(abs_blade);
    $.defineOperator(abs_exp);
    $.defineOperator(abs_pow_any_negone);
    $.defineOperator(abs_flt);
    $.defineOperator(abs_imu);
    $.defineOperator(abs_rat);
    $.defineOperator(abs_tensor);
    $.defineOperator(abs_uom);
    $.defineOperator(abs_sym);
    // $.defineOperator(abs_factorize);
    $.defineOperator(abs_any);

    $.defineOperator(adj_any);

    $.defineOperator(algebra_2_tensor_tensor);
    $.defineConsTransformer(AND, Eval_and);
    $.defineOperator(arccos_varargs);
    $.defineOperator(arccosh_varargs);
    $.defineOperator(arcsin_varargs);
    $.defineOperator(arcsinh_any);

    $.defineOperator(arctan_varargs);

    $.defineOperator(arctanh_varargs);

    $.defineOperator(arg_add);
    $.defineOperator(arg_flt);
    $.defineOperator(arg_imu);
    $.defineOperator(arg_mul);
    $.defineOperator(arg_pow);
    $.defineOperator(arg_rat);
    $.defineOperator(arg_sym);
    $.defineOperator(arg_any);

    $.defineOperator(assign_sym_any);
    $.defineOperator(assign_any_any);

    $.defineOperator(besselj_varargs);
    $.defineOperator(bessely_varargs);

    $.defineOperator(ceiling_flt);
    $.defineOperator(ceiling_rat);
    $.defineOperator(ceiling_cons);

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

    $.defineOperator(exp_add);
    $.defineOperator(exp_flt);
    $.defineOperator(exp_imu);
    $.defineOperator(exp_log);
    $.defineOperator(exp_mul);
    $.defineOperator(exp_rat);
    $.defineOperator(exp);

    $.defineOperator(expand_extension);
    $.defineOperator(expcos_varargs);
    $.defineOperator(expsin_varargs);

    $.defineOperator(factor_varargs);
    $.defineOperator(factorial_varargs);
    $.defineOperator(float_varargs);
    $.defineOperator(floor_varargs);
    $.defineOperator(for_varargs);

    $.defineOperator(hilbert_varargs);

    $.defineOperator(imag_add);
    $.defineOperator(imag_arctan_rat);
    $.defineOperator(imag_cos);
    $.defineOperator(imag_exp);
    $.defineOperator(imag_flt);
    $.defineOperator(imag_imu);
    $.defineOperator(imag_log_rat);
    $.defineOperator(imag_rat);
    $.defineOperator(imag_sin);
    $.defineOperator(imag_sym);
    $.defineOperator(imag_mul_i_times_any);
    $.defineOperator(imag_mul);
    $.defineOperator(imag_pow_e_rat);
    $.defineOperator(imag_pow_e_sym);
    $.defineOperator(imag_pow_rat_rat);
    $.defineOperator(imag_pow_z_negone);
    $.defineOperator(imag_any);

    $.defineOperator(index_varargs);

    $.defineOperator(integral_varargs);

    $.defineOperator(inv_inv);
    $.defineOperator(inv_any);

    $.defineOperator(isprime_varargs);
    $.defineOperator(iszero_rat);
    $.defineOperator(iszero_any);

    $.defineOperator(not_fn);
    $.defineOperator(number_fn);
    $.defineOperator(numerator_fn);
    $.defineConsTransformer(NROOTS, Eval_nroots);
    $.defineOperator(or_varargs);

    $.defineOperator(pred_rat);
    $.defineOperator(pred_any);

    $.defineConsTransformer(POLAR, Eval_polar);

    $.defineOperator(make_printmode_operator('print', () => defs.printMode));
    $.defineOperator(make_printmode_operator('printascii', () => PRINTMODE_ASCII));
    $.defineOperator(make_printmode_operator('printhuman', () => PRINTMODE_HUMAN));
    $.defineOperator(make_printmode_operator('printinfix', () => PRINTMODE_INFIX));
    $.defineOperator(make_printmode_operator('printlatex', () => PRINTMODE_LATEX));
    $.defineOperator(make_printmode_operator('printsexpr', () => PRINTMODE_SEXPR));

    $.defineOperator(make_printmode_keyword('print', () => defs.printMode));
    $.defineOperator(make_printmode_keyword('printascii', () => PRINTMODE_ASCII));
    $.defineOperator(make_printmode_keyword('printhuman', () => PRINTMODE_HUMAN));
    $.defineOperator(make_printmode_keyword('printinfix', () => PRINTMODE_INFIX));
    $.defineOperator(make_printmode_keyword('printlatex', () => PRINTMODE_LATEX));
    $.defineOperator(make_printmode_keyword('printsexpr', () => PRINTMODE_SEXPR));

    $.defineOperator(product_varargs);

    $.defineConsTransformer(QUOTE, Eval_quote);
    $.defineOperator(quotient_varargs);
    $.defineOperator(rationalize_fn);

    $.defineOperator(real_add);
    $.defineOperator(real_arctan_rat);
    $.defineOperator(real_cos);
    $.defineOperator(real_exp);
    $.defineOperator(real_flt);
    $.defineOperator(real_imag);
    $.defineOperator(real_imu);
    $.defineOperator(real_log_imu);
    $.defineOperator(real_log_rat);
    // $.defineOperator(real_mul_i_times_any);
    $.defineOperator(real_mul);
    $.defineOperator(real_pow_rat_rat);
    $.defineOperator(real_rat);
    $.defineOperator(real_real);
    $.defineOperator(real_holomorphic(SIN));
    $.defineOperator(real_sym);
    $.defineOperator(real_any);

    $.defineOperator(is_complex_sym);
    $.defineOperator(is_complex_any);

    $.defineOperator(is_real_abs);
    $.defineOperator(is_real_add);
    $.defineOperator(isreal_holomorphic(COS));
    $.defineOperator(isreal_holomorphic(EXP));
    $.defineOperator(isreal_holomorphic(FACTORIAL));
    $.defineOperator(is_real_cos);
    $.defineOperator(is_real_flt);
    $.defineOperator(is_real_imag);
    $.defineOperator(is_real_imu);
    $.defineOperator(is_real_mul);
    $.defineOperator(is_real_pow_e_sym);
    $.defineOperator(is_real_pow_rat_rat);
    $.defineOperator(is_real_pow_sym_rat);
    $.defineOperator(is_real_pow_imu_rat);
    $.defineOperator(is_real_pow_any_negone);
    $.defineOperator(is_real_rat);
    $.defineOperator(is_real_real);
    $.defineOperator(is_real_sin);
    $.defineOperator(make_predicate_sym_operator(PREDICATE_IS_REAL));
    $.defineOperator(is_real_any);

    $.defineOperator(rect_mul_rat_any);
    $.defineOperator(rect_pow_exp_imu);
    $.defineConsTransformer(RECT, Eval_rect);

    $.defineOperator(roots_varargs);
    $.defineOperator(round_varargs);

    $.defineOperator(script_last_0);

    $.defineOperator(sgn_flt);
    $.defineOperator(sgn_rat);
    $.defineOperator(sgn_any);

    $.defineOperator(shape_varargs);
    $.defineOperator(simplify_varargs);

    $.defineOperator(sinh_flt);
    $.defineOperator(sinh_rat);
    $.defineOperator(sinh_sym);
    $.defineOperator(sinh_any);

    $.defineOperator(succ_rat);
    $.defineOperator(succ_any);

    $.defineOperator(sin_add);
    $.defineOperator(sin_flt);
    $.defineOperator(sin_hyp);
    $.defineOperator(sin_rat);
    $.defineOperator(sin_sym);
    $.defineOperator(sin_mul);
    $.defineOperator(sin_any);

    $.defineOperator(sqrt_rat);
    $.defineOperator(sqrt_any);

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

    $.defineConsTransformer(TEST, Eval_test);

    $.defineOperator(testeq_sym_rat);
    $.defineConsTransformer(TESTEQ, Eval_testeq);
    $.defineConsTransformer(TESTLE, Eval_testle);

    $.defineOperator(testlt_flt_rat);
    $.defineOperator(testlt_rat_rat);
    $.defineOperator(testlt_sym_rat);
    $.defineOperator(testlt_mul_2_any_any_rat);
    $.defineConsTransformer(TESTLT, Eval_testlt);

    $.defineConsTransformer(TESTGE, Eval_testge);

    $.defineOperator(testgt_rat_rat);
    $.defineOperator(testgt_sym_rat);
    $.defineOperator(testgt_mul_2_any_any_rat);
    $.defineConsTransformer(TESTGT, Eval_testgt);

    $.defineConsTransformer(TESTNE, Eval_testne);

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
