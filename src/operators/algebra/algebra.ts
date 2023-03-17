import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { convertLabelsToNative, convertMetricToNative, create_algebra_as_tensor } from "./create_algebra_as_tensor";

export function algebra(metric: Tensor<U>, labels: Tensor<U>, $: ExtensionEnv): Tensor<U> {
    const metricNative = convertMetricToNative(metric);
    const labelsNative = convertLabelsToNative(labels);
    return create_algebra_as_tensor(metricNative, labelsNative, $);
}
