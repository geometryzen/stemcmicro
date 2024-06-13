import { Tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { convertMetricToNative, convert_tensor_to_strings, create_algebra_as_tensor } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";

export function algebra(metric: Tensor<U>, labels: Tensor<U>, $: ExprContext): Tensor<U> {
    const metricNative = convertMetricToNative(metric);
    const labelsNative = convert_tensor_to_strings(labels);
    return create_algebra_as_tensor(metricNative, labelsNative, $);
}
