<template>
    <div class="navbar bg-base-100 container mx-auto">
        <!-- Mobile menu (hamburger) -->
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/converter">Converter</NuxtLink></li>
                    <li><NuxtLink to="/about">About</NuxtLink></li>
                </ul>
            </div>
            <!-- Logo -->
            <NuxtLink to="/" class="btn btn-ghost text-lg">
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
                <span>UniConvert</span>
            </NuxtLink>
        </div>

        <!-- Desktop menu -->
        <div class="navbar-end hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li><NuxtLink to="/" class="font-medium">Home</NuxtLink></li>
                <li><NuxtLink to="/converter" class="font-medium">Converter</NuxtLink></li>
                <li><NuxtLink to="/about" class="font-medium">About</NuxtLink></li>
            </ul>
        </div>
    </div>
</template>
