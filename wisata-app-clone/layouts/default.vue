<template>
    <v-app>
        <Header />
        <v-main class="mainRef">
            <v-container class="container">
                <NuxtPage />
            </v-container>
            <Footer />
        </v-main>
    </v-app>
</template>

<script setup>
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue'

</script>

<style scoped></style>