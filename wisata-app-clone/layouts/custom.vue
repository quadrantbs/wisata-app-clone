<template>
    <v-app>
        <HomeHeader />
        <v-main>
            <v-container class="container">
                <NuxtPage />
            </v-container>
        </v-main>
        <Footer />
    </v-app>
</template>

<script setup>
import Footer from '~/components/layout/Footer.vue';
import HomeHeader from '~/components/layout/HomeHeader.vue';

</script>

<style scoped>

</style>