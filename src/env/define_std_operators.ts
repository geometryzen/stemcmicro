import { hash_binop_cons_atom, HASH_BLADE, HASH_FLT, HASH_RAT, HASH_SYM } from '../hashing/hash_info';
import { abs_any } from '../operators/abs/abs_any';
import { abs_rat } from '../operators/abs/abs_rat';
import { abs_sym_real } from '../operators/abs/abs_sym_real';
import { add_2_add_2_any_any_any } from '../operators/add/add_2_add_2_any_any_any';
import { add_2_add_2_any_any_any_factorize_rhs } from '../operators/add/add_2_add_2_any_any_any_factorize_rhs';
import { add_2_add_2_any_imag_imag } from '../operators/add/add_2_add_2_any_imag_imag';
import { add_2_add_2_any_imag_real } from '../operators/add/add_2_add_2_any_imag_real';
import { add_2_add_2_rat_mul_2_rat_any_add_2_rat_any } from '../operators/add/add_2_add_2_any_mul_2_rat_any_add_2_rat_any';
import { add_2_add_2_any_mul_2_rat_sym_mul_2_rat_sym } from '../operators/add/add_2_add_2_any_mul_2_rat_sym_mul_2_rat_sym';
import { add_2_add_2_any_mul_2_rat_sym } from '../operators/add/add_2_add_2_any_sym_mul_2_rat_sym';
import { add_2_add_2_sym_sym_sym } from '../operators/add/add_2_add_2_sym_sym_sym';
import { add_2_add_2_sym_xxx_xxx } from '../operators/add/add_2_add_2_sym_xxx_xxx';
import { add_2_any_add } from '../operators/add/add_2_any_add';
import { add_2_any_add_2_any_any } from '../operators/add/add_2_any_add_2_any_any';
import { add_2_any_any } from '../operators/add/add_2_any_any';
import { add_2_any_any_factorize_rhs } from '../operators/add/add_2_any_any_factorize_rhs';
import { add_2_any_any_zero_sum } from '../operators/add/add_2_any_any_zero_sum';
import { add_2_any_mul_2_rat_any } from '../operators/add/add_2_any_mul_2_rat_any';
import { add_2_assoc_lhs_canonical_ordering } from '../operators/add/add_2_assoc_lhs_canonical_ordering';
import { add_2_assoc_lhs_factorize_blades } from '../operators/add/add_2_assoc_lhs_factorize_blades';
import { add_2_assoc_rhs_canonical_ordering } from '../operators/add/add_2_assoc_rhs_canonical_ordering';
import { add_2_blade_blade } from '../operators/add/add_2_blade_blade';
import { add_2_blade_mul_2_rat_blade } from '../operators/add/add_2_blade_mul_2_rat_blade';
import { add_2_canonical_ordering } from '../operators/add/add_2_canonical_ordering';
import { add_2_cons_rat } from '../operators/add/add_2_cons_rat';
import { add_2_flt_flt } from '../operators/add/add_2_flt_flt';
import { add_2_flt_rat } from '../operators/add/add_2_flt_rat';
import { add_2_flt_uom } from '../operators/add/add_2_flt_uom';
import { add_2_imag_real } from '../operators/add/add_2_imag_real';
import { add_2_imu_flt } from '../operators/add/add_2_imu_flt';
import { add_2_mul_2_any_blade_mul_2_any_blade } from '../operators/add/add_2_mul_2_any_blade_mul_2_any_blade';
import { add_2_mul_2_any_imu_sym } from '../operators/add/add_2_mul_2_any_imu_sym';
import { add_2_mul_2_any_vector_mul_2_any_vector } from '../operators/add/add_2_mul_2_any_vector_mul_2_any_vector';
import { add_2_mul_2_inner_2_sym_sym_sym_mul_2_sym_outer_2_sym_sym } from '../operators/add/add_2_mul_2_inner_sym_sym_sym_mul_2_sym_outer_2_sym_sym';
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
import { add_2_sym_mul_2_sym_rat } from '../operators/add/add_2_sym_mul_2_sym_rat';
import { add_2_sym_rat } from '../operators/add/add_2_sym_rat';
import { add_2_sym_sym } from '../operators/add/add_2_sym_sym';
import { add_2_uom_flt } from '../operators/add/add_2_uom_flt';
import { add_2_uom_rat } from '../operators/add/add_2_uom_rat';
import { add_2_xxx_mul_2_rm1_xxx } from '../operators/add/add_2_xxx_mul_2_rm1_xxx';
import { add_2_zzz_mul_2_rat_aaa } from '../operators/add/add_2_zzz_mul_2_rat_aaa';
import { adj_any } from '../operators/adj/adj_any';
import { algebra_2_tensor_tensor } from '../operators/algebra/algebra_2_mat_mat';
import { and_varargs } from '../operators/and/and_varargs';
import { arcsin_varargs } from '../operators/arcsin/arcsin_varargs';
import { arcsinh_any } from '../operators/arcsinh/arcsinh_any';
import { arctan_varargs } from '../operators/arctan/arctan_varargs';
import { arg_varargs } from '../operators/arg/arg_varargs';
import { assign_any_any } from '../operators/assign/assign_any_any';
import { assign_sym_any } from '../operators/assign/assign_sym_any';
import { bladeExtensionBuilder } from '../operators/blade/BladeExtension';
import { is_blade } from '../operators/blade/is_blade';
import { boo } from '../operators/boo/BooExtension';
import { ceiling_any } from '../operators/ceiling/ceiling_any';
import { ceiling_flt } from '../operators/ceiling/ceiling_flt';
import { ceiling_rat } from '../operators/ceiling/ceiling_rat';
import { clock_any } from '../operators/clock/clock_any';
import { cofactor_varargs } from '../operators/cofactor/cofactor_varargs';
import { conj_any } from '../operators/conj/conj_any';
import { conj_blade } from '../operators/conj/conj_blade';
import { conj_flt } from '../operators/conj/conj_flt';
import { conj_imaginary_unit } from '../operators/conj/conj_imag';
import { conj_inner } from '../operators/conj/conj_inner';
import { conj_rat } from '../operators/conj/conj_rat';
import { conj_sym } from '../operators/conj/conj_sym';
import { cons } from '../operators/cons/ConsExtension';
import { contract_varargs } from '../operators/contract/contract_varargs';
import { cos_add_2_any_any } from '../operators/cos/cos_add_2_any_any';
import { cos_any } from '../operators/cos/cos_any';
import { cos_hyp } from '../operators/cos/cos_hyp';
import { cos_mul_2_any_imu } from '../operators/cos/cos_mul_2_any_imu';
import { cos_sym } from '../operators/cos/cos_sym';
import { cosh_sym } from '../operators/cosh/cosh_sym';
import { cross_add_2_any_any_any } from '../operators/cross/cross_add_2_any_any_any';
import { cross_any_add_2_any_any } from '../operators/cross/cross_any_add_2_any_any';
import { cross_any_any } from '../operators/cross/cross_any_any';
import { cross_any_mul_2_scalar_any } from '../operators/cross/cross_any_mul_2_scalar_any';
import { cross_blade_blade } from '../operators/cross/cross_blade_blade';
import { cross_mul_2_scalar_any_any } from '../operators/cross/cross_mul_2_scalar_any_any';
import { defint } from '../operators/defint/defint';
import { denominator_fn } from '../operators/denominator/denominator_fn';
import { derivative_2_mul_any } from '../operators/derivative/derivative_2_mul_any';
import { derivative_2_pow_any } from '../operators/derivative/derivative_2_pow_any';
import { derivative_fn } from '../operators/derivative/derivative_fn';
import { d_to_derivative } from '../operators/derivative/d_to_derivative';
import { det_any } from '../operators/det/det_any';
import { factorize_lhs_distrib } from '../operators/distrib/factorize_lhs_distrib';
import { inner_lhs_distrib_over_add_expand } from '../operators/distrib/inner_lhs_distrib_over_add_expand';
import { inner_rhs_distrib_over_add_expand } from '../operators/distrib/inner_rhs_distrib_over_add_expand';
import { lco_2_add_2_any_any_any } from '../operators/distrib/lco_2_add_2_any_any_any';
import { lco_2_any_add_2_any_any } from '../operators/distrib/lco_2_any_add_2_any_any';
import { mul_lhs_distrib_over_add_expand } from '../operators/distrib/mul_lhs_distrib_over_add_expand';
import { mul_rhs_distrib_over_add_expand } from '../operators/distrib/mul_rhs_distrib_over_add_expand';
import { mul_rhs_distrib_over_add_factor } from '../operators/distrib/mul_rhs_distrib_over_add_factor';
import { outer_2_add_2_any_any_any } from '../operators/distrib/outer_2_add_2_any_any_any';
import { outer_2_any_add_2_any_any } from '../operators/distrib/outer_2_any_add_2_any_any';
import { rco_2_add_2_any_any_any } from '../operators/distrib/rco_2_add_2_any_any_any';
import { rco_2_any_add_2_any_any } from '../operators/distrib/rco_2_any_add_2_any_any';
import { errExtensionBuilder } from '../operators/err/ErrExtension';
import { exp_any } from '../operators/exp/exp_any';
import { exp_flt } from '../operators/exp/exp_flt';
import { exp_rat } from '../operators/exp/exp_rat';
import { factorize_ab_minus_two_a_dot_b } from '../operators/factorize/factorize_ab_minus_two_a_dot_b';
import { factorize_geometric_product_add } from '../operators/factorize/factorize_geometric_product_add';
import { factorize_geometric_product_lhs_assoc } from '../operators/factorize/factorize_geometric_product_lhs_assoc';
import { factorize_geometric_product_sub } from '../operators/factorize/factorize_geometric_product_sub';
import { float_cons } from '../operators/float/float_cons';
import { float_flt } from '../operators/float/float_flt';
import { float_imu } from '../operators/float/float_imu';
import { float_mul_2_flt_sym } from '../operators/float/float_mul_2_flt_sym';
import { float_rat } from '../operators/float/float_rat';
import { float_sym } from '../operators/float/float_sym';
import { float_sym_pi } from '../operators/float/float_sym_pi';
import { floor_varargs } from '../operators/floor/floor_varargs';
import { is_flt, op_flt } from '../operators/flt/FltExtension';
import { heterogenous_canonical_order } from '../operators/helpers/heterogenous_canonical_order';
import { heterogenous_canonical_order_lhs_assoc } from '../operators/helpers/heterogenous_canonical_order_lhs_assoc';
import { hilbert_varargs } from '../operators/hilbert/hilbert_varargs';
import { hypExtensionBuilder } from '../operators/hyp/HypExtension';
import { imuExtensionBuilder } from '../operators/imu/ImuExtension';
import { index_varargs } from '../operators/index/index_varargs';
import { inner } from '../operators/inner/inner';
import { inner_2_any_any } from '../operators/inner/inner_2_any_any';
import { inner_2_any_imu } from '../operators/inner/inner_2_any_imu';
import { inner_2_any_real } from '../operators/inner/inner_2_any_real';
import { inner_2_imu_any } from '../operators/inner/inner_2_imu_any';
import { inner_2_imu_imu } from '../operators/inner/inner_2_imu_imu';
import { inner_2_imu_rat } from '../operators/inner/inner_2_imu_rat';
import { inner_2_mul_2_scalar_vector_vector } from '../operators/inner/inner_2_mul_2_scalar_vector_vector';
import { inner_2_num_num } from '../operators/inner/inner_2_num_num';
import { inner_2_rat_imu } from '../operators/inner/inner_2_rat_imu';
import { inner_2_rat_sym } from '../operators/inner/inner_2_rat_sym';
import { inner_2_real_any } from '../operators/inner/inner_2_real_any';
import { inner_2_sym_sym } from '../operators/inner/inner_2_sym_sym';
import { inner_2_vector_mul_2_scalar_vector } from '../operators/inner/inner_2_vector_mul_2_scalar_vector';
import { inner_2_vec_scalar } from '../operators/inner/inner_2_vec_scalar';
import { inner_2_vec_vec } from '../operators/inner/inner_2_vec_vec';
import { integral_varargs } from '../operators/integral/integral_varargs';
import { inv_any } from '../operators/inv/inv_any';
import { iszero_any } from '../operators/iszero/iszero_any';
import { iszero_rat } from '../operators/iszero/iszero_rat';
import { lco_2_any_any } from '../operators/lco/lco_2_any_any';
import { lco_2_any_mul_2_scalar_any } from '../operators/lco/lco_2_any_mul_2_scalar_any';
import { lco_2_blade_blade } from '../operators/lco/lco_2_blade_blade';
import { lco_2_mul_2_scalar_any_any } from '../operators/lco/lco_2_mul_2_scalar_any_any';
import { associate_right_mul_2_mul_2_any_any_any } from '../operators/mul/associate_right_mul_2_mul_2_any_any_any';
import { canonicalize_mul_2_mul_2_sym_sym_sym } from '../operators/mul/canonicalize_mul_2_mul_2_sym_sym_sym';
import { canonicalize_mul_2_sym_mul_2_sym_sym } from '../operators/mul/canonicalize_mul_2_sym_mul_2_sym_sym';
import { implicate_mul_2_mul_2_any_any_any } from '../operators/mul/implicate_mul_2_mul_2_any_any_any';
import { implicate_mul_2_mul_2_sym_sym_sym } from '../operators/mul/implicate_mul_2_mul_2_sym_sym_sym';
import { implicate_mul_2_sym_mul_2_sym_sym } from '../operators/mul/implicate_mul_2_sym_mul_2_sym_sym';
import { mul_varargs } from '../operators/mul/mul';
import { mul_2_any_any } from '../operators/mul/mul_2_any_any';
import { mul_2_any_mul } from '../operators/mul/mul_2_any_mul';
import { mul_2_any_mul_2_any_any } from '../operators/mul/mul_2_any_mul_2_any_any';
import { mul_2_blade_blade } from '../operators/mul/mul_2_blade_blade';
import { mul_2_blade_flt } from '../operators/mul/mul_2_blade_flt';
import { mul_2_blade_rat } from '../operators/mul/mul_2_blade_rat';
import { mul_2_blade_sym } from '../operators/mul/mul_2_blade_sym';
import { mul_2_cons_rat } from '../operators/mul/mul_2_cons_rat';
import { mul_2_flt_flt } from '../operators/mul/mul_2_flt_flt';
import { mul_2_flt_imu } from '../operators/mul/mul_2_flt_imu';
import { mul_2_flt_mul_2_flt_any } from '../operators/mul/mul_2_flt_mul_2_flt_any';
import { mul_2_flt_rat } from '../operators/mul/mul_2_flt_rat';
import { mul_2_flt_uom } from '../operators/mul/mul_2_flt_uom';
import { mul_2_hyp_rat } from '../operators/mul/mul_2_hyp_rat';
import { mul_2_hyp_sym } from '../operators/mul/mul_2_hyp_sym';
import { mul_2_imu_any } from '../operators/mul/mul_2_imu_any';
import { mul_2_imu_imu } from '../operators/mul/mul_2_imu_imu';
import { mul_2_mul_2_aaa_bbb_bbb } from '../operators/mul/mul_2_mul_2_aaa_bbb_bbb';
import { mul_2_mul_2_any_blade_blade } from '../operators/mul/mul_2_mul_2_any_blade_blade';
import { mul_2_mul_2_any_imu_any } from '../operators/mul/mul_2_mul_2_any_imu_any';
import { mul_2_mul_2_any_imu_imu } from '../operators/mul/mul_2_mul_2_any_imu_imu';
import { mul_2_mul_2_any_imu_sym } from '../operators/mul/mul_2_mul_2_any_imu_sym';
import { mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any } from '../operators/mul/mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any';
import { mul_2_mul_2_any_sym_imu } from '../operators/mul/mul_2_mul_2_any_sym_imu';
import { mul_2_mul_2_any_sym_mul_2_imu_sym } from '../operators/mul/mul_2_mul_2_any_sym_mul_2_imu_sym';
import { mul_2_mul_2_any_sym_sym } from '../operators/mul/mul_2_mul_2_any_sym_sym';
import { mul_2_mul_2_any_X_pow_2_X_rat } from '../operators/mul/mul_2_mul_2_any_X_pow_2_X_rat';
import { mul_2_mul_2_any_Z_pow_2_A_any } from '../operators/mul/mul_2_mul_2_any_Z_pow_2_A_any';
import { mul_2_mul_2_num_any_rat } from '../operators/mul/mul_2_mul_2_num_any_rat';
import { mul_2_mul_2_rat_any_mul_2_rat_any } from '../operators/mul/mul_2_mul_2_rat_any_mul_2_rat_any';
import { mul_2_mul_2_rat_sym_sym } from '../operators/mul/mul_2_mul_2_rat_sym_sym';
import { mul_2_mul_2_sym_imu_sym } from '../operators/mul/mul_2_mul_2_sym_imu_sym';
import { mul_2_one_any } from '../operators/mul/mul_2_one_any';
import { mul_2_pow_2_sym_any_pow_2_sym_any } from '../operators/mul/mul_2_pow_2_sym_any_pow_2_sym_any';
import { mul_2_pow_2_xxx_any_pow_2_xxx_any } from '../operators/mul/mul_2_pow_2_xxx_any_pow_2_xxx_any';
import { mul_2_pow_2_xxx_rat_xxx } from '../operators/mul/mul_2_pow_2_xxx_rat_xxx';
import { mul_2_pow_2_zzz_rat_aaa } from '../operators/mul/mul_2_pow_2_zzz_rat_aaa';
import { mul_2_rat_any } from '../operators/mul/mul_2_rat_any';
import { mul_2_rat_blade } from '../operators/mul/mul_2_rat_blade';
import { mul_2_rat_flt } from '../operators/mul/mul_2_rat_flt';
import { mul_2_rat_mul_2_rat_any } from '../operators/mul/mul_2_rat_mul_2_rat_any';
import { mul_2_rat_mul_2_sym_sym } from '../operators/mul/mul_2_rat_mul_2_sym_sym';
import { mul_2_rat_rat } from '../operators/mul/mul_2_rat_rat';
import { mul_2_rat_sym } from '../operators/mul/mul_2_rat_sym';
import { mul_2_scalar_blade } from '../operators/mul/mul_2_scalar_blade';
import { mul_2_scalar_mul_2_scalar_any } from '../operators/mul/mul_2_scalar_mul_2_scalar_any';
import { mul_2_sym_add_2_sym_sym } from '../operators/mul/mul_2_sym_add_2_sym_sym';
import { mul_2_sym_blade } from '../operators/mul/mul_2_sym_blade';
import { mul_2_sym_flt } from '../operators/mul/mul_2_sym_flt';
import { mul_2_sym_imu } from '../operators/mul/mul_2_sym_imu';
import { mul_2_sym_inner_2_sym_sym } from '../operators/mul/mul_2_sym_inner_2_sym_sym';
import { mul_2_sym_mul_2_rat_any } from '../operators/mul/mul_2_sym_mul_2_rat_any';
import { mul_2_sym_num } from '../operators/mul/mul_2_sym_num';
import { mul_2_sym_pow_2_sym_two } from '../operators/mul/mul_2_sym_pow_2_sym_two';
import { mul_2_sym_rat } from '../operators/mul/mul_2_sym_rat';
import { mul_2_sym_sym } from '../operators/mul/mul_2_sym_sym';
import { mul_2_sym_sym_general } from '../operators/mul/mul_2_sym_sym_general';
import { mul_2_uom_flt } from '../operators/mul/mul_2_uom_flt';
import { mul_2_uom_rat } from '../operators/mul/mul_2_uom_rat';
import { mul_2_uom_uom } from '../operators/mul/mul_2_uom_uom';
import { mul_2_X_pow_2_X_rat } from '../operators/mul/mul_2_X_pow_2_X_rat';
import { mul_2_zzz_pow_2_aaa_rat } from '../operators/mul/mul_2_zzz_pow_2_aaa_rat';
import { nilExtensionBuilder } from '../operators/nil/NilExtension';
import { not_fn } from '../operators/not/not_fn';
import { number_fn } from '../operators/number/number_fn';
import { numerator_fn } from '../operators/numerator/numerator_fn';
import { or_varargs } from '../operators/or/or_varargs';
import { outer_2_any_any } from '../operators/outer/outer_2_any_any';
import { outer_2_any_mul_2_scalar_any } from '../operators/outer/outer_2_any_mul_2_scalar_any';
import { outer_2_blade_blade } from '../operators/outer/outer_2_blade_blade';
import { outer_2_mul_2_scalar_any_any } from '../operators/outer/outer_2_mul_2_scalar_any_any';
import { outer_2_sym_outer_2_sym_sym } from '../operators/outer/outer_2_sym_outer_2_sym_sym';
import { outer_2_sym_sym } from '../operators/outer/outer_2_sym_sym';
import { outer_2_tensor_tensor } from '../operators/outer/outer_2_tensor_tensor';
import { polar_varargs } from '../operators/polar/polar_varargs';
import { pow } from '../operators/pow/pow';
import { pow_2_any_any } from '../operators/pow/pow_2_any_any';
import { pow_2_any_rat } from '../operators/pow/pow_2_any_rat';
import { pow_2_cons_rat } from '../operators/pow/pow_2_cons_rat';
import { pow_2_flt_rat } from '../operators/pow/pow_2_flt_rat';
import { pow_2_imu_rat } from '../operators/pow/pow_2_imu_rat';
import { pow_2_pow_2_e_any_rat } from '../operators/pow/pow_2_pow_2_any_any_rat';
import { pow_2_pow_2_any_rat_rat } from '../operators/pow/pow_2_pow_2_any_rat_rat';
import { pow_2_rat_mul_2_rat_rat } from '../operators/pow/pow_2_rat_mul_2_rat_rat';
import { pow_2_rat_rat } from '../operators/pow/pow_2_rat_rat';
import { pow_2_sym_rat } from '../operators/pow/pow_2_sym_rat';
import { pow_2_uom_rat } from '../operators/pow/pow_2_uom_rat';
import { pow_2_e_any } from '../operators/pow/pow_e_any';
import { pred_any } from '../operators/pred/pred_any';
import { pred_rat } from '../operators/pred/pred_rat';
import { printlist_1_any } from '../operators/printlist/printlist_1_any';
import { printlist_keyword } from '../operators/printlist/printlist_keyword';
import { quote_varargs } from '../operators/quote/quote_varargs';
import { is_rat, rat } from '../operators/rat/RatExtension';
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
import { shape_varargs } from '../operators/shape/shape_varargs';
import { simplify_varargs } from '../operators/simplify/simplify_fn';
import { simplify_mul_2_blade_mul_2_blade_any } from '../operators/simplify/simplify_mul_2_blade_mul_2_blade_any';
import { sin_add_2_any_any } from '../operators/sin/sin_add_2_any_any';
import { sin_any } from '../operators/sin/sin_any';
import { sin_hyp } from '../operators/sin/sin_hyp';
import { sin_mul_2_any_imu } from '../operators/sin/sin_mul_2_any_imu';
import { sin_mul_2_rat_any } from '../operators/sin/sin_mul_2_rat_any';
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
import { str } from '../operators/str/StrExtension';
import { succ_any } from '../operators/succ/succ_any';
import { succ_rat } from '../operators/succ/succ_rat';
import { is_sym } from '../operators/sym/is_sym';
import { symExtensionBuilder } from '../operators/sym/SymExtension';
import { sym_math_add } from '../operators/sym/sym_math_add';
import { sym_math_mul } from '../operators/sym/sym_math_mul';
import { sym_math_pi } from '../operators/sym/sym_math_pi';
import { sym_math_pow } from '../operators/sym/sym_math_pow';
import { tan_varargs } from '../operators/tan/tan_varargs';
import { tau } from '../operators/tau/tau';
import { tensorExtensionBuilder } from '../operators/tensor/TensorExtension';
import { testeq_sym_rat } from '../operators/testeq/testeq_sym_rat';
import { testgt_mul_2_any_any_rat } from '../operators/testgt/testgt_mul_2_any_any_rat';
import { testgt_rat_rat } from '../operators/testgt/testgt_rat_rat';
import { testgt_sym_rat } from '../operators/testgt/testgt_sym_rat';
import { testlt_mul_2_any_any_rat } from '../operators/testlt/testlt_mul_2_any_any_rat';
import { testlt_rat_rat } from '../operators/testlt/testlt_rat_rat';
import { testlt_sym_rat } from '../operators/testlt/testlt_sym_rat';
import { add_2_mul_2_cos_sin_mul_2_cos_sin_factoring } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_cos_sin_factoring';
import { add_2_mul_2_cos_sin_mul_2_cos_sin_ordering } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_cos_sin_ordering';
import { add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring';
import { add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_ordering } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_ordering';
import { add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos } from '../operators/trig/add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos';
import { add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring } from '../operators/trig/add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring';
import { add_2_mul_2_sin_cos_mul_2_cos_sin } from '../operators/trig/add_2_mul_2_sin_cos_mul_2_cos_sin';
import { add_2_mul_2_sin_cos_mul_2_mul_2_rat_cos_sin } from '../operators/trig/add_2_mul_2_sin_cos_mul_2_mul_2_rat_cos_sin';
import { add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin } from '../operators/trig/add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin';
import { mul_2_sin_cos } from '../operators/trig/mul_2_sin_cos';
import { typeof_any } from '../operators/typeof/typeof_any';
import { typeof_blade } from '../operators/typeof/typeof_blade';
import { typeof_tensor } from '../operators/typeof/typeof_tensor';
import { is_uom, uomExtensionBuilder } from '../operators/uom/UomExtension';
import { uom_1_str } from '../operators/uom/uom_1_str';
import { MATH_ADD, MATH_LCO, MATH_MUL, MATH_OUTER, MATH_RCO } from '../runtime/ns_math';
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
    /*
    if (options) {
        if (Array.isArray(options.assocs)) {
            for (const assoc of options.assocs) {
                switch (assoc.dir) {
                    case 'L': {
                        $.setAssocL(assoc.sym, true);
                        break;
                    }
                    case 'R': {
                        $.setAssocR(assoc.sym, true);
                        break;
                    }
                }
            }
        }
    }
    */
    $.defineOperator(mul_rhs_distrib_over_add_expand);
    $.defineOperator(mul_lhs_distrib_over_add_expand);

    $.defineOperator(mul_rhs_distrib_over_add_factor);

    $.defineOperator(factorize_lhs_distrib('factorize LHS distrib (*,+)', MATH_MUL, MATH_ADD));

    $.defineOperator(inner_rhs_distrib_over_add_expand);
    $.defineOperator(inner_lhs_distrib_over_add_expand);

    $.defineOperator(factorize_geometric_product_add);
    $.defineOperator(factorize_geometric_product_sub);
    $.defineOperator(factorize_ab_minus_two_a_dot_b);
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
    $.defineOperator(add_2_uom_flt);
    $.defineOperator(add_2_uom_rat);

    // Missing add_sym_flt
    // Missing add_sym_rat
    $.defineOperator(add_2_sym_rat);
    $.defineOperator(add_2_cons_rat);
    $.defineOperator(add_2_xxx_mul_2_rm1_xxx);
    $.defineOperator(add_2_any_mul_2_rat_any);
    $.defineOperator(add_2_blade_mul_2_rat_blade);
    $.defineOperator(add_2_zzz_mul_2_rat_aaa);
    $.defineOperator(add_2_add_2_sym_xxx_xxx);
    $.defineOperator(add_2_add_2_sym_sym_sym);
    $.defineOperator(add_2_add_2_any_imag_real);
    $.defineOperator(add_2_add_2_any_imag_imag);
    $.defineOperator(add_2_canonical_ordering);
    $.defineOperator(add_2_add_2_any_any_any_factorize_rhs);
    $.defineOperator(add_2_assoc_lhs_canonical_ordering);
    $.defineOperator(add_2_assoc_rhs_canonical_ordering);
    $.defineOperator(add_2_assoc_lhs_factorize_blades);
    $.defineOperator(add_2_add_2_any_any_any);

    $.defineOperator(add_2_mul_2_rat_X_mul_2_rat_X);
    $.defineOperator(add_2_mul_2_rat_anX_anX);
    $.defineOperator(add_2_mul_2_rat_zzz_aaa);
    $.defineOperator(add_2_mul_2_any_imu_sym);
    $.defineOperator(add_2_mul_2_sin_cos_mul_2_cos_sin);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_cos_sin_ordering);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_cos_sin_factoring);
    $.defineOperator(add_2_mul_2_sin_cos_mul_2_mul_2_rat_cos_sin);
    $.defineOperator(add_2_mul_2_sin_cos_mul_2_rat_mul_2_cos_sin);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_mul_2_rat_sin_cos);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_ordering);
    $.defineOperator(add_2_mul_2_cos_sin_mul_2_mul_2_rat_cos_sin_factoring);
    $.defineOperator(add_2_mul_2_rat_cos_sin_mul_2_mul_2_cos_sin_factoring);
    $.defineOperator(add_2_mul_2_any_blade_mul_2_any_blade);
    $.defineOperator(add_2_mul_2_any_vector_mul_2_any_vector);
    $.defineOperator(add_2_pow_2_any_any_mul_2_any_any);
    $.defineOperator(add_2_any_add_2_any_any);
    $.defineOperator(add_2_any_add);
    $.defineOperator(add_2_sym_sym);
    $.defineOperator(add_2_sym_mul_2_sym_rat);
    $.defineOperator(add_2_blade_blade);
    $.defineOperator(add_2_mul_2_rat_inner_2_sym_sym_outer_2_sym_sym);
    $.defineOperator(add_2_mul_2_inner_2_sym_sym_sym_mul_2_sym_outer_2_sym_sym);
    $.defineOperator(add_2_imag_real);
    $.defineOperator(add_2_imu_flt);
    $.defineOperator(add_2_any_any_zero_sum);
    $.defineOperator(add_2_any_any_factorize_rhs);
    $.defineOperator(add_2_any_any);

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
    $.defineOperator(pow_2_any_rat);
    $.defineOperator(pow_2_any_any);
    $.defineOperator(pow);

    $.defineOperator(mul_2_sym_blade);
    $.defineOperator(mul_2_one_any);
    // $.defineOperator(mul_cons_sym);

    $.defineOperator(mul_2_flt_flt);
    $.defineOperator(mul_2_flt_rat);
    $.defineOperator(mul_2_flt_imu);
    $.defineOperator(mul_2_flt_uom);
    $.defineOperator(mul_2_flt_mul_2_flt_any);
    $.defineOperator(mul_2_imu_imu);
    $.defineOperator(mul_2_imu_any);

    $.defineOperator(mul_2_rat_blade);
    $.defineOperator(mul_2_rat_flt);
    $.defineOperator(mul_2_rat_rat);
    $.defineOperator(mul_2_rat_sym);
    $.defineOperator(mul_2_rat_mul_2_rat_any);
    $.defineOperator(mul_2_rat_mul_2_sym_sym);
    $.defineOperator(mul_2_rat_any);
    $.defineOperator(mul_2_mul_2_rat_any_mul_2_rat_any);
    $.defineOperator(mul_2_scalar_mul_2_scalar_any);

    $.defineOperator(simplify_mul_2_blade_mul_2_blade_any);

    $.defineOperator(mul_2_mul_2_aaa_bbb_bbb);
    $.defineOperator(canonicalize_mul_2_mul_2_sym_sym_sym);
    $.defineOperator(implicate_mul_2_mul_2_sym_sym_sym);

    // The following is only used for right-associating.
    $.defineOperator(mul_2_mul_2_rat_sym_sym);
    $.defineOperator(mul_2_mul_2_sym_imu_sym);
    $.defineOperator(mul_2_mul_2_any_imu_sym);

    $.defineOperator(mul_2_mul_2_num_any_rat);
    $.defineOperator(mul_2_mul_2_any_imu_imu);
    $.defineOperator(mul_2_mul_2_any_imu_any);
    $.defineOperator(mul_2_mul_2_any_blade_blade);
    $.defineOperator(mul_2_mul_2_any_sym_imu);
    $.defineOperator(mul_2_mul_2_any_sym_sym);
    $.defineOperator(mul_2_mul_2_any_sym_mul_2_imu_sym);
    // Notice how we need three operators in order to provide canonical ordering.
    // TODO: DRY the duplication of hash specification and matching guard functions.
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Flt * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_FLT), MATH_MUL, is_flt, is_uom));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Rat * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_RAT), MATH_MUL, is_flt, is_uom));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Sym * Blade', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM), MATH_MUL, is_sym, is_blade));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Sym * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM), MATH_MUL, is_sym, is_uom));
    $.defineOperator(heterogenous_canonical_order_lhs_assoc('HCOLA Blade * Uom', hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_BLADE), MATH_MUL, is_blade, is_uom));
    $.defineOperator(associate_right_mul_2_mul_2_any_any_any);
    $.defineOperator(implicate_mul_2_mul_2_any_any_any);
    $.defineOperator(mul_2_pow_2_xxx_rat_xxx);
    // $.defineOperator(mul_2_outer_2_sym_sym_sym);
    $.defineOperator(mul_2_zzz_pow_2_aaa_rat);
    $.defineOperator(mul_2_X_pow_2_X_rat);
    $.defineOperator(mul_2_sym_add_2_sym_sym);
    $.defineOperator(mul_2_sym_inner_2_sym_sym);
    // Disable because it is a very strong canonicalizer.
    // $.defineOperator(mul_2_sym_outer_2_sym_sym);
    $.defineOperator(canonicalize_mul_2_sym_mul_2_sym_sym);
    $.defineOperator(implicate_mul_2_sym_mul_2_sym_sym);
    $.defineOperator(mul_2_sym_mul_2_rat_any);
    $.defineOperator(mul_2_sym_pow_2_sym_two);
    $.defineOperator(mul_2_sym_flt);
    $.defineOperator(mul_2_hyp_rat);
    $.defineOperator(mul_2_sym_rat);
    $.defineOperator(mul_2_sym_num);
    $.defineOperator(mul_2_sym_sym_general);
    $.defineOperator(mul_2_sym_sym);
    $.defineOperator(mul_2_sym_imu);
    $.defineOperator(mul_2_pow_2_zzz_rat_aaa);
    $.defineOperator(mul_2_mul_2_any_X_pow_2_X_rat);
    $.defineOperator(mul_2_mul_2_any_Z_pow_2_A_any);

    // Distribution Laws in Factoring direction for symmetric and left-associated.
    // This concept should have an abstraction. 
    $.defineOperator(mul_2_pow_2_xxx_any_pow_2_xxx_any);
    $.defineOperator(mul_2_pow_2_sym_any_pow_2_sym_any);
    $.defineOperator(mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any);

    $.defineOperator(mul_2_any_mul_2_any_any);
    $.defineOperator(mul_2_any_mul);

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

    $.defineOperator(mul_2_blade_flt);
    $.defineOperator(mul_2_blade_rat);
    $.defineOperator(mul_2_blade_sym);
    $.defineOperator(mul_2_blade_blade);
    $.defineOperator(mul_2_scalar_blade);
    $.defineOperator(mul_2_sin_cos);
    $.defineOperator(mul_2_any_any);
    $.defineOperator(mul_2_cons_rat);
    $.defineOperator(mul_varargs);

    $.defineOperator(conj_inner);
    $.defineOperator(conj_sym);
    $.defineOperator(conj_rat);
    $.defineOperator(conj_flt);
    $.defineOperator(conj_imaginary_unit);
    $.defineOperator(conj_blade);
    $.defineOperator(conj_any);

    $.defineOperator(inner_2_num_num);
    $.defineOperator(inner_2_rat_imu);
    $.defineOperator(inner_2_rat_sym);
    $.defineOperator(inner_2_imu_rat);
    $.defineOperator(inner_2_imu_imu);
    $.defineOperator(inner_2_imu_any);
    $.defineOperator(inner_2_sym_sym);
    $.defineOperator(inner_2_vec_scalar);
    $.defineOperator(inner_2_vec_vec);
    $.defineOperator(inner_2_mul_2_scalar_vector_vector);
    $.defineOperator(inner_2_vector_mul_2_scalar_vector);
    $.defineOperator(inner_2_real_any);
    $.defineOperator(inner_2_any_real);
    $.defineOperator(inner_2_any_imu);
    $.defineOperator(inner_2_any_any);
    $.defineOperator(inner);

    $.defineOperator(lco_2_blade_blade);
    $.defineOperator(lco_2_add_2_any_any_any);
    $.defineOperator(lco_2_mul_2_scalar_any_any);
    $.defineOperator(lco_2_any_add_2_any_any);
    $.defineOperator(lco_2_any_mul_2_scalar_any);
    $.defineOperator(lco_2_any_any);

    $.defineOperator(outer_2_blade_blade);
    $.defineOperator(outer_2_add_2_any_any_any);
    $.defineOperator(outer_2_mul_2_scalar_any_any);
    // $.defineOperator(outer_2_sym_sym_vector_antisymmetry);
    // $.defineOperator(outer_2_sym_sym_vector_to_geometric);
    $.defineOperator(outer_2_sym_sym);
    $.defineOperator(outer_2_tensor_tensor);
    $.defineOperator(outer_2_sym_outer_2_sym_sym);
    $.defineOperator(outer_2_any_add_2_any_any);
    $.defineOperator(outer_2_any_mul_2_scalar_any);
    $.defineOperator(outer_2_any_any);

    $.defineOperator(rco_2_blade_blade);
    $.defineOperator(rco_2_add_2_any_any_any);
    $.defineOperator(rco_2_mul_2_scalar_any_any);
    $.defineOperator(rco_2_any_add_2_any_any);
    $.defineOperator(rco_2_any_mul_2_scalar_any);
    $.defineOperator(rco_2_any_any);

    $.defineOperator(boo);
    $.defineOperator(rat);
    $.defineOperator(op_flt);
    $.defineOperator(str);

    $.defineOperator(abs_rat);
    $.defineOperator(abs_sym_real);
    $.defineOperator(abs_any);

    $.defineOperator(adj_any);

    $.defineOperator(algebra_2_tensor_tensor);
    $.defineOperator(and_varargs);
    $.defineOperator(arcsin_varargs);
    $.defineOperator(arcsinh_any);
    $.defineOperator(arctan_varargs);
    $.defineOperator(arg_varargs);

    $.defineOperator(assign_sym_any);
    $.defineOperator(assign_any_any);

    $.defineOperator(ceiling_flt);
    $.defineOperator(ceiling_rat);
    $.defineOperator(ceiling_any);

    $.defineOperator(clock_any);

    $.defineOperator(cofactor_varargs);
    $.defineOperator(contract_varargs);

    $.defineOperator(cos_add_2_any_any);
    $.defineOperator(cos_mul_2_any_imu);
    $.defineOperator(cos_sym);
    $.defineOperator(cos_hyp);
    $.defineOperator(cos_any);

    $.defineOperator(cosh_sym);

    $.defineOperator(cross_blade_blade);
    // Linearity Laws
    $.defineOperator(cross_mul_2_scalar_any_any);
    $.defineOperator(cross_any_mul_2_scalar_any);
    // Distribution Laws of cross over addition.
    $.defineOperator(cross_add_2_any_any_any);
    $.defineOperator(cross_any_add_2_any_any);
    $.defineOperator(cross_any_any);

    $.defineOperator(defint);
    $.defineOperator(denominator_fn);

    $.defineOperator(d_to_derivative);
    $.defineOperator(derivative_2_mul_any);
    $.defineOperator(derivative_2_pow_any);
    // $.defineOperator(derivative_2_any_any);
    $.defineOperator(derivative_fn);

    $.defineOperator(det_any);

    $.defineOperator(exp_flt);
    $.defineOperator(exp_rat);
    $.defineOperator(exp_any);

    $.defineOperator(float_mul_2_flt_sym);
    $.defineOperator(float_cons);
    $.defineOperator(float_sym_pi);
    $.defineOperator(float_sym);
    $.defineOperator(float_flt);
    $.defineOperator(float_rat);
    $.defineOperator(float_imu);
    $.defineOperator(floor_varargs);

    $.defineOperator(hilbert_varargs);

    $.defineOperator(index_varargs);

    $.defineOperator(integral_varargs);
    $.defineOperator(inv_any);

    $.defineOperator(iszero_rat);
    $.defineOperator(iszero_any);

    $.defineOperator(not_fn);
    $.defineOperator(number_fn);
    $.defineOperator(numerator_fn);
    $.defineOperator(or_varargs);

    $.defineOperator(pred_rat);
    $.defineOperator(pred_any);
    $.defineOperator(polar_varargs);

    $.defineOperator(printlist_1_any);
    $.defineOperator(printlist_keyword);
    $.defineOperator(quote_varargs);
    $.defineOperator(rationalize_fn);
    $.defineOperator(real_any);
    $.defineOperator(rect_varargs);
    $.defineOperator(roots_varargs);
    $.defineOperator(round_varargs);

    $.defineOperator(script_last_0);
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
    $.defineOperator(sin_mul_2_rat_any);
    $.defineOperator(sin_mul_2_any_imu);
    $.defineOperator(sin_any);

    $.defineOperator(sqrt_1_rat);
    $.defineOperator(sqrt_1_any);

    $.defineOperator(st_add_2_any_hyp);
    $.defineOperator(st_mul_2_rat_any);
    $.defineOperator(st_rat);
    $.defineOperator(st_sym);
    $.defineOperator(st_any);

    $.defineOperator(tan_varargs);

    $.defineOperator(typeof_tensor);
    $.defineOperator(typeof_blade);
    $.defineOperator(typeof_any);

    $.defineOperator(tau);

    $.defineOperator(testeq_sym_rat);

    $.defineOperator(testlt_rat_rat);
    $.defineOperator(testlt_sym_rat);
    $.defineOperator(testlt_mul_2_any_any_rat);

    $.defineOperator(testgt_rat_rat);
    $.defineOperator(testgt_sym_rat);
    $.defineOperator(testgt_mul_2_any_any_rat);

    $.defineOperator(sym_math_add);
    $.defineOperator(sym_math_mul);
    $.defineOperator(sym_math_pow);
    $.defineOperator(sym_math_pi);

    $.defineOperator(symExtensionBuilder);
    $.defineOperator(tensorExtensionBuilder);
    $.defineOperator(bladeExtensionBuilder);
    $.defineOperator(uomExtensionBuilder);
    $.defineOperator(hypExtensionBuilder);
    $.defineOperator(errExtensionBuilder);
    $.defineOperator(imuExtensionBuilder);

    $.defineOperator(uom_1_str);

    // NIL is implemented as an empty Cons, so it has to be defined before the generic Cons operator.
    $.defineOperator(nilExtensionBuilder);

    // There is no fallback. We migrate everything.
    $.defineOperator(cons);
}
