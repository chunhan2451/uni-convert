<template>
    <div class="min-h-screen flex flex-col" data-theme="emerlard">
        <Navbar />
        <main class="flex-grow">
            <NuxtPage />
            <Toast />
        </main>
        <Footer />
    </div>
</template>
<script setup>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import Toast from '~/components/Toast.vue';
</script>
