<template>
    <!-- Footer with minimal design -->
    <footer class="bg-base-200 py-8">
        <div class="container mx-auto px-4">
            <!-- Two column layout for desktop, stack for mobile -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Company Info -->
                <div>
                    <div class="flex items-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 mr-2 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                        </svg>
                        <span class="font-medium">UniConvert</span>
                    </div>
                    <p class="text-sm text-base-content/80">Simple unit conversion for everyone</p>
                    <p class="text-sm mt-4">contact@uniconvert.com</p>
                </div>

                <!-- Navigation Links -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="font-medium mb-2">Links</p>
                        <ul class="space-y-1 text-sm">
                            <li><NuxtLink to="/" class="link link-hover">Home</NuxtLink></li>
                            <li>
                                <NuxtLink to="/converter" class="link link-hover">Converter</NuxtLink>
                            </li>
                            <li><NuxtLink to="/about" class="link link-hover">About</NuxtLink></li>
                        </ul>
                    </div>
                    <div>
                        <p class="font-medium mb-2">Legal</p>
                        <ul class="space-y-1 text-sm">
                            <li><NuxtLink to="/terms" class="link link-hover">Terms</NuxtLink></li>
                            <li>
                                <NuxtLink to="/privacy" class="link link-hover">Privacy</NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
