<template>
    <div class="min-h-[70vh] flex items-center justify-center p-4">
        <div class="max-w-md w-full text-center">
            <!-- Animated Icon - Increased Size -->
            <div class="mb-10 relative">
                <div
                    class="absolute -z-10 w-80 h-80 rounded-full bg-primary/5 left-1/2 -translate-x-1/2"
                ></div>
                <Icon :name="uiIcons.search" class="text-6xl text-primary/70 mx-auto animate-float" />
            </div>

            <!-- Error Content -->
            <h1 class="text-3xl font-bold text-base-content mb-4">Tool Not Found</h1>

            <p class="text-lg text-base-content/70 mb-8">We couldn't find the converter or tool you're looking for.</p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <NuxtLink to="/converter" class="btn btn-primary btn-lg">
                    <Icon :name="uiIcons.list" class="h-5 w-5 mr-2" />
                    Browse All Tools
                </NuxtLink>
                <NuxtLink to="/" class="btn btn-outline btn-lg">
                    <Icon :name="uiIcons.arrowRight" class="h-5 w-5 mr-2" />
                    Back to Home
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NuxtLink } from '#components';
import { uiIcons } from '~/utils/appConstant';
</script>

<style scoped>
.animate-float {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}
</style>
