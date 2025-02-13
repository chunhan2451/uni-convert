import { unitConverters } from "./unit";
import { colorConverters } from "./color";
import { fontConverters } from "./font";
import { timeConverters } from "./time";

export const converters = {
    ...unitConverters,
    ...colorConverters,
    ...fontConverters,
    ...timeConverters,
};
