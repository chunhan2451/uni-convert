<template>
    <nav class="navbar bg-base-100 container mx-auto">
        <!-- Mobile menu (hamburger) -->
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <Icon :name="uiIcons.list" class="h-5! w-5!" />
                </div>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li>
                        <NuxtLink to="/converter"> Convert </NuxtLink>
                    </li>
                </ul>
            </div>
            <!-- Logo -->
            <NuxtLink to="/" class="btn btn-ghost text-lg">
                <span>UniConvert</span>
            </NuxtLink>
        </div>

        <!-- Desktop menu -->
        <div class="navbar-end hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li><NuxtLink to="/" class="font-medium">Home</NuxtLink></li>
                <li>
                    <NuxtLink to="/converter" class="font-medium">
                        <Icon :name="uiIcons.search" class="h-5 w-5 text-xl" />
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </nav>
</template>
