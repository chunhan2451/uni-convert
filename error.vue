<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
        <!-- Logo -->
        <!-- <img src="/logo.png" alt="App Logo" class="w-32 h-32 mb-6" /> -->

        <!-- Error Message -->
        <h1 class="text-4xl font-bold text-red-500 mb-4">{{ error?.statusCode }} - Oops! Something went wrong.</h1>
        <p class="text-lg text-gray-700 mb-8">{{ error?.message || 'An unexpected error occurred.' }}</p>

        <!-- Back to Home Button -->
        <button class="btn btn-primary bg-primary text-white px-6 py-2 rounded" @click="navigateTo('/')">Back to Home</button>
    </div>
</template>

<script setup>
const error = useError();
</script>
