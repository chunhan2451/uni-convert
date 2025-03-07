<template>
    <div>
        <!-- Hero Section -->
        <section class="py-16 md:py-24 bg-base-100">
            <div class="container mx-auto px-4 text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-base-content mb-4">Universal Converter</h1>
                <p class="text-lg text-base-content/80 max-w-lg mx-auto mb-8">
                    Simple, fast, and accurate unit conversions for everyday use.
                </p>
                <NuxtLink to="/converter" class="btn btn-primary">Start Converting</NuxtLink>
            </div>
        </section>

        <!-- Main Converter Widget -->
        <section class="py-12 bg-base-100">
            <div class="container mx-auto px-4">
                <div class="card max-w-lg mx-auto bg-base-200 shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title text-xl font-medium mb-4">Quick Convert</h2>

                        <div class="form-control w-full mb-4">
                            <label class="label">
                                <span class="label-text">Conversion Type</span>
                            </label>
                            <select class="select select-bordered w-full">
                                <option disabled selected>Select type</option>
                                <option>Length</option>
                                <option>Weight</option>
                                <option>Temperature</option>
                                <option>Currency</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-1 gap-4 mb-4">
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">From</span>
                                </label>
                                <div class="join w-full">
                                    <input type="number" placeholder="Value" class="input input-bordered join-item w-[65%]" />
                                    <select class="select select-bordered join-item w-[35%]">
                                        <option disabled selected>Unit</option>
                                        <option>Meters</option>
                                        <option>Feet</option>
                                        <option>Inches</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">To</span>
                                </label>
                                <div class="join w-full">
                                    <input
                                        type="number"
                                        placeholder="Result"
                                        class="input input-bordered join-item w-[65%]"
                                        readonly
                                    />
                                    <select class="select select-bordered join-item w-[35%]">
                                        <option disabled selected>Unit</option>
                                        <option>Meters</option>
                                        <option>Feet</option>
                                        <option>Inches</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary w-full">Convert</button>
                    </div>
                </div>
            </div>
        </section>

        
        <section class="py-12">
            <div class="container mx-auto px-4">
                <ConvertColor />
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-12 bg-base-300">
            <div class="container mx-auto px-4">
                <h2 class="text-2xl font-medium text-center mb-8">Features</h2>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Feature 1 -->
                    <div class="card bg-base-100">
                        <div class="card-body">
                            <h3 class="card-title text-lg">Simplicity</h3>
                            <p class="text-base-content/80">Clean interface designed for fast, effortless conversions.</p>
                        </div>
                    </div>

                    <!-- Feature 2 -->
                    <div class="card bg-base-100">
                        <div class="card-body">
                            <h3 class="card-title text-lg">Accuracy</h3>
                            <p class="text-base-content/80">Precise conversion between units with up to 10 decimal places.</p>
                        </div>
                    </div>

                    <!-- Feature 3 -->
                    <div class="card bg-base-100">
                        <div class="card-body">
                            <h3 class="card-title text-lg">Universal</h3>
                            <p class="text-base-content/80">Support for all common unit types and measurements.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
