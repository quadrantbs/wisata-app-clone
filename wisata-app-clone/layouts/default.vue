<template>
    <v-app>
        <Header />
        <v-main>
            <v-container>
                <NuxtPage />
            </v-container>
        </v-main>
        <Footer />
    </v-app>
</template>

<script setup>
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue'

</script>

<style scoped>

</style>