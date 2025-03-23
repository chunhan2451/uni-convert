<!-- components/Convert/Units/DataSpeedConverter.vue -->
<template>
    <BaseConverter :category="category" title="Data Transfer & Internet Speed Converter" />
    <!-- <div class="container mx-auto p-4">
        <details class="bg-base-200 rounded-lg" open>
            <summary class="p-3 font-medium cursor-pointer hover:bg-base-300 rounded-lg">Data Speed Conversion Table</summary>
            <div class="p-4 pt-2">
                <div class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Multiply By</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Megabits per second (Mbps)</td>
                                <td>Megabytes per second (MBps)</td>
                                <td>0.125</td>
                            </tr>
                            <tr>
                                <td>Megabits per second (Mbps)</td>
                                <td>Gigabits per second (Gbps)</td>
                                <td>0.001</td>
                            </tr>
                            <tr>
                                <td>Megabytes per second (MBps)</td>
                                <td>Megabits per second (Mbps)</td>
                                <td>8</td>
                            </tr>
                            <tr>
                                <td>Megabytes per second (MBps)</td>
                                <td>Gigabits per second (Gbps)</td>
                                <td>0.008</td>
                            </tr>
                            <tr>
                                <td>Gigabits per second (Gbps)</td>
                                <td>Megabits per second (Mbps)</td>
                                <td>1000</td>
                            </tr>
                            <tr>
                                <td>Gigabits per second (Gbps)</td>
                                <td>Megabytes per second (MBps)</td>
                                <td>125</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-4 text-sm">
                    <h3 class="font-bold mb-2">Conversion Formulas:</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>1 Byte = 8 bits</li>
                        <li>1 Megabyte (MB) = 8 Megabits (Mb)</li>
                        <li>1 Gigabit (Gb) = 1,000 Megabits (Mb)</li>
                        <li>1 Gigabyte (GB) = 8 Gigabits (Gb) = 8,000 Megabits (Mb)</li>
                    </ul>
                </div>
            </div>
        </details>

        <div class="text-sm mt-6 text-base-content/70">
            <p class="mb-2">Common internet speeds:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Standard home broadband: 30-100 Mbps</li>
                <li>Fiber optic internet: 100-1000 Mbps (1 Gbps)</li>
                <li>5G mobile data: 50-300 Mbps</li>
                <li>4G mobile data: 10-50 Mbps</li>
            </ul>
        </div>
    </div> -->
</template>

<script setup>
import { unitConvertCategories } from '~/utils/unit';
import BaseConverter from '../BaseConverter.vue';

// Get the category from unitConvertCategories
const category = unitConvertCategories.find((cat) => cat.id === 'dataspeed');
</script>
