import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { convert_tensor_to_strings } from "../../helpers/convert_tensor_to_strings";
import { convertMetricToNative, create_algebra_as_tensor } from "./create_algebra_as_tensor";

export function algebra(metric: Tensor<U>, labels: Tensor<U>, $: ExtensionEnv): Tensor<U> {
    const metricNative = convertMetricToNative(metric);
    const labelsNative = convert_tensor_to_strings(labels);
    return create_algebra_as_tensor(metricNative, labelsNative, $);
}
