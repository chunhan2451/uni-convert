<template>
    <div v-if="appState.showToast" class="toast toast-end toast-bottom">
        <div class="alert alert-success">
            <span>{{ appState.toastMessage || 'Copied to clipboard!' }}</span>
        </div>
    </div>
</template>
<script setup>
import { useAppState } from '~/composables/states';

const appState = useAppState();
</script>
