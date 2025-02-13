<template>
    <header class="p-4">
        <nav class="flex justify-between items-center max-w-7xl mx-auto">
            <!-- Logo -->
            <div class="text-xl font-bold text-primary">Logo</div>

            <!-- Navigation Links -->
            <ul class="flex gap-5">
                <li><NuxtLink to="/" class="text-gray-700 hover:text-primary transition">Home</NuxtLink></li>
                <li><NuxtLink to="/about" class="text-gray-700 hover:text-primary transition">About</NuxtLink></li>
                <li><NuxtLink to="/contact" class="text-gray-700 hover:text-primary transition">Contact</NuxtLink></li>
            </ul>
        </nav>
    </header>
</template>
