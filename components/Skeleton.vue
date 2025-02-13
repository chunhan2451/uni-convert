<template>
    <div class="bg-surface rounded-lg shadow-md p-6">
        <!-- Header Skeleton -->
        <div class="flex items-center space-x-4 animate-pulse">
            <div class="w-12 h-12 bg-border rounded-full"></div>
            <div class="flex-1 space-y-2">
                <div class="h-4 bg-border rounded w-3/4"></div>
                <div class="h-4 bg-border rounded w-1/2"></div>
            </div>
        </div>

        <!-- Content Skeleton -->
        <div class="mt-6 space-y-4 animate-pulse">
            <div class="h-4 bg-border rounded"></div>
            <div class="h-4 bg-border rounded w-5/6"></div>
            <div class="h-4 bg-border rounded w-2/3"></div>
        </div>

        <!-- Footer Skeleton -->
        <div class="mt-6 flex justify-between animate-pulse">
            <div class="h-10 bg-border rounded w-24"></div>
            <div class="h-10 bg-border rounded w-24"></div>
        </div>
    </div>
</template>
