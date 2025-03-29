<template>
    <div class="min-h-screen flex items-center justify-center bg-base-100 p-4">
        <div class="max-w-md w-full text-center m-auto p-4">
            <!-- Animated Error Icon -->
            <div class="mb-10 relative">
                <div class="absolute -z-10 w-80 h-80 rounded-full bg-primary/5 left-1/2 -translate-x-1/2"></div>
                <div class="relative mx-auto">
                    <Icon :name="uiIcons.warning" class="text-6xl text-primary mx-auto animate-bounce-gentle" />
                </div>
            </div>

            <!-- Error Content -->
            <h1 class="text-4xl font-bold text-base-content mb-4">{{ error?.statusCode || '404' }} - Oops!</h1>
            <p class="text-xl text-base-content/80 mb-6">We hit a bump in the road</p>
            <p class="text-base text-base-content/70 mb-10">Don't worry, it's not your fault. Let's get you back on track.</p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="btn btn-primary btn-lg" @click="navigateTo('/')">
                    <Icon :name="uiIcons.arrowRight" class="h-5 w-5 mr-2" />
                    Back to Home
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { uiIcons } from '~/utils/appConstant';

const error = useError();
</script>

<style scoped>
.animate-bounce-gentle {
    animation: bounceGentle 2.5s ease-in-out infinite;
}

@keyframes bounceGentle {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}
</style>
