<template>
    <div>
        <h1 class="text-2xl font-bold">{{ converter.name }}</h1>
        <div class="mt-4">
            <input
                v-model="inputValue"
                type="number"
                placeholder="Enter value"
                class="border p-2 rounded"
            />
            <select v-model="fromUnit" class="border p-2 rounded ml-2">
                <option v-for="(unit, key) in converter.units" :key="key" :value="key">
                    {{ unit }}
                </option>
            </select>
            <span class="mx-2">to</span>
            <select v-model="toUnit" class="border p-2 rounded">
                <option v-for="(unit, key) in converter.units" :key="key" :value="key">
                    {{ unit }}
                </option>
            </select>
            <button @click="convert" class="bg-primary text-white p-2 rounded ml-2">Convert</button>
        </div>
        <div v-if="result !== null" class="mt-4">
            <p class="text-lg">Result: {{ result }}</p>
        </div>
    </div>
</template>

<script setup>
import converters from "~/utils/converters";

const route = useRoute();
const converter = converters[route.params.id]; // Get the selected converter

console.log(converter)
const inputValue = ref(0);
const fromUnit = ref(Object.keys(converter.units)[0]);
const toUnit = ref(Object.keys(converter.units)[1]);
const result = ref(null);

const convert = () => {
    result.value = converter.convert(inputValue.value, fromUnit.value, toUnit.value);
};
</script>
