<template>
    <nav class="navbar bg-base-100 container mx-auto">
        <!-- Mobile menu (hamburger) -->
        <div class="navbar-start">
            <!-- Logo -->
            <NuxtLink to="/" class="btn btn-ghost text-lg">
                <span>UniConvert</span>
            </NuxtLink>
        </div>

        <!-- Desktop menu -->
        <div class="navbar-end lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li>
                    <NuxtLink to="/converter" class="font-medium">
                        <Icon :name="uiIcons.search" class="h-5 w-5 text-xl" />
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script setup>
import { NuxtLink } from '#components';
import { uiIcons } from '~/utils/appConstant';
</script>