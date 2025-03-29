<template>
    <div class="min-h-screen flex flex-col">
        <!-- Hero Section -->
        <div class="hero min-h-screen bg-gradient-to-b from-primary/5 to-base-100 overflow-hidden">
            <div class="container px-4 mx-auto">
                <!-- Mobile View (column layout) -->
                <div class="flex flex-col lg:hidden my-10">
                    <!-- 1. Heading -->
                    <div class="mb-6 text-center">
                        <h1 class="text-4xl sm:text-5xl font-bold mb-2 animate-fade-in">
                            Your daily dose of <span class="text-gradient">conversion</span>.
                        </h1>
                    </div>

                    <!-- 2. Browser Mockup -->
                    <div class="relative w-full max-w-md mx-auto mb-8 animate-float">
                        <div class="device-mockup">
                            <div class="mockup-browser border-primary shadow-xl w-full">
                                <div class="p-4 bg-base-200">
                                    <div class="bg-white rounded-lg mb-3 p-3 shadow-sm hover:shadow-md transition-shadow">
                                        <div class="flex items-center mb-2">
                                            <div class="bg-success/10 rounded-full p-1.5 mr-2">
                                                <Icon :name="uiIcons.categoryIcons.length" class="text-success w-4 h-4" />
                                            </div>
                                            <div class="font-medium text-sm">Length Converter</div>
                                        </div>
                                        <div class="flex justify-between items-end">
                                            <div>
                                                <div class="text-xs text-base-content/70">Meters</div>
                                                <div class="text-base font-medium">1.85</div>
                                            </div>
                                            <div class="text-success">→</div>
                                            <div>
                                                <div class="text-xs text-base-content/70">Feet</div>
                                                <div class="text-base font-medium">6.07</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bg-white rounded-lg mb-3 p-3 shadow-sm hover:shadow-md transition-shadow">
                                        <div class="flex items-center mb-2">
                                            <div class="bg-success/10 rounded-full p-1.5 mr-2">
                                                <Icon :name="uiIcons.categoryIcons.temperature" class="text-success w-4 h-4" />
                                            </div>
                                            <div class="font-medium text-sm">Temperature Converter</div>
                                        </div>
                                        <div class="flex justify-between items-end">
                                            <div>
                                                <div class="text-xs text-base-content/70">Celsius</div>
                                                <div class="text-base font-medium">25°</div>
                                            </div>
                                            <div class="text-success">→</div>
                                            <div>
                                                <div class="text-xs text-base-content/70">Fahrenheit</div>
                                                <div class="text-base font-medium">77°</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                        <div class="flex items-center mb-2">
                                            <div class="bg-success/10 rounded-full p-1.5 mr-2">
                                                <Icon :name="uiIcons.categoryIcons.time" class="text-success w-4 h-4" />
                                            </div>
                                            <div class="font-medium text-sm">Time Zone Converter</div>
                                        </div>
                                        <div class="flex justify-between items-end">
                                            <div>
                                                <div class="text-xs text-base-content/70">New York</div>
                                                <div class="text-base font-medium">14:00</div>
                                            </div>
                                            <div class="text-success">→</div>
                                            <div>
                                                <div class="text-xs text-base-content/70">London</div>
                                                <div class="text-base font-medium">19:00</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Remaining description -->
                    <div class="mx-auto max-w-md px-4">
                        <!-- Added margin-top and padding -->
                        <div class="space-y-4 mb-6 animate-fade-in-delayed">
                            <div class="flex justify-center">
                                <!-- Changed to items-start -->
                                <span class="text-xl mr-4 pt-0.5">⚡</span>
                                <!-- Added pt-0.5 to align icon -->
                                <span class="text-lg font-medium">Simple, fast conversions</span>
                            </div>
                            <div class="flex justify-center">
                                <span class="text-xl mr-4 pt-0.5">🔄</span>
                                <span class="text-lg font-medium">Most common units & formats</span>
                            </div>
                            <div class="flex justify-center">
                                <span class="text-xl mr-4 pt-0.5">✨</span>
                                <span class="text-lg font-medium">Effortless user experience</span>
                            </div>
                        </div>

                        <p class="mb-8 text-lg text-base-content/80 animate-fade-in-delayed text-center px-2">
                            Convert anything with just a few taps. Length, temperature, time, and more - all the conversions you
                            need most!
                        </p>

                        <div class="text-center animate-bounce-subtle">
                            <NuxtLink to="/converter" class="btn btn-primary btn-lg px-8 shadow-lg">
                                Start Converting
                                <Icon :name="uiIcons.arrowRight" class="ml-2 h-5 w-5" />
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Desktop View (centered layout) -->
                <div class="hidden lg:flex justify-center items-center min-h-full">
                    <div class="flex flex-row items-center max-w-6xl mx-auto justify-center gap-12">
                        <!-- Text Content -->
                        <div class="max-w-xl">
                            <h1 class="text-5xl font-bold mb-6">
                                Your daily dose of <span class="text-gradient">conversion</span>.
                            </h1>
                            <div class="space-y-4 mb-8">
                                <div class="flex items-start">
                                    <span class="text-2xl mr-4 pt-0.5">⚡</span>
                                    <span class="text-xl font-medium">Simple, fast conversions</span>
                                </div>
                                <div class="flex items-start">
                                    <span class="text-2xl mr-4 pt-0.5">🔄</span>
                                    <span class="text-xl font-medium">Most common units & formats</span>
                                </div>
                                <div class="flex items-start">
                                    <span class="text-2xl mr-4 pt-0.5">✨</span>
                                    <span class="text-xl font-medium">Effortless user experience</span>
                                </div>
                            </div>
                            <p class="mb-8 text-lg text-base-content/80">
                                Convert anything with just a few taps. Length, temperature, time, and more - all the conversions
                                you need most!
                            </p>
                            <div>
                                <NuxtLink to="/converter" class="btn btn-primary btn-lg px-8 shadow-lg group transition-all">
                                    Start Converting
                                    <Icon :name="uiIcons.arrowRight" class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- Browser Mockup -->
                        <div class="relative w-full max-w-xl animate-float">
                            <div class="absolute -z-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl top-10 left-10"></div>

                            <div class="device-mockup">
                                <div class="mockup-browser border-primary shadow-xl">
                                    <div class="p-5 bg-base-200">
                                        <div class="bg-white rounded-lg mb-3 p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div class="flex items-center mb-3">
                                                <div class="bg-success/10 rounded-full p-2 mr-3">
                                                    <Icon :name="uiIcons.categoryIcons.length" class="text-success w-5 h-5" />
                                                </div>
                                                <div class="font-medium">Length Converter</div>
                                            </div>
                                            <div class="flex justify-between items-end">
                                                <div>
                                                    <div class="text-xs text-base-content/70">Meters</div>
                                                    <div class="text-lg font-medium">1.85</div>
                                                </div>
                                                <div class="text-success text-xl">→</div>
                                                <div>
                                                    <div class="text-xs text-base-content/70">Feet</div>
                                                    <div class="text-lg font-medium">6.07</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="bg-white rounded-lg mb-3 p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div class="flex items-center mb-3">
                                                <div class="bg-success/10 rounded-full p-2 mr-3">
                                                    <Icon
                                                        :name="uiIcons.categoryIcons.temperature"
                                                        class="text-success w-5 h-5"
                                                    />
                                                </div>
                                                <div class="font-medium">Temperature Converter</div>
                                            </div>
                                            <div class="flex justify-between items-end">
                                                <div>
                                                    <div class="text-xs text-base-content/70">Celsius</div>
                                                    <div class="text-lg font-medium">25°</div>
                                                </div>
                                                <div class="text-success text-xl">→</div>
                                                <div>
                                                    <div class="text-xs text-base-content/70">Fahrenheit</div>
                                                    <div class="text-lg font-medium">77°</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="bg-white rounded-lg mb-3 p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div class="flex items-center mb-3">
                                                <div class="bg-success/10 rounded-full p-2 mr-3">
                                                    <Icon :name="uiIcons.categoryIcons.time" class="text-success w-5 h-5" />
                                                </div>
                                                <div class="font-medium">Time Zone Converter</div>
                                            </div>
                                            <div class="flex justify-between items-end">
                                                <div>
                                                    <div class="text-xs text-base-content/70">New York</div>
                                                    <div class="text-lg font-medium">14:00</div>
                                                </div>
                                                <div class="text-success text-xl">→</div>
                                                <div>
                                                    <div class="text-xs text-base-content/70">London</div>
                                                    <div class="text-lg font-medium">19:00</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NuxtLink } from '#components';
import { uiIcons } from '~/utils/appConstant';

// Define SEO metadata
useHead({
    title: 'UniConvert - Your All-in-One Conversion Tool',
    meta: [
        {
            name: 'description',
            content:
                'Convert units, text, files, and more all in one place. Fast, accurate, and easy-to-use converters for everyday needs.',
        },
    ],
});
</script>

<style scoped>
.animate-float {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
    100% {
        transform: translateY(0px);
    }
}

.animate-fade-in {
    animation: fadeIn 1s ease-out;
}

.animate-fade-in-delayed {
    animation: fadeIn 1s ease-out 0.3s both;
}

.animate-bounce-subtle {
    animation: bounceSlight 2s infinite;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounceSlight {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.text-gradient {
    background: linear-gradient(90deg, #10b981, #3b82f6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* Device mockup styling */
.device-mockup {
    transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
    transition: all 0.3s ease;
    filter: drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1));
}

.device-mockup:hover {
    transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}
</style>
