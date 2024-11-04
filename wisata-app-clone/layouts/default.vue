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

<script>
import Footer from '~/components/layout/Footer.vue';
import Header from '~/components/layout/Header.vue'

export default {
    name: 'DefaultLayout',
    components: {
        Header, Footer
    }
}
</script>

<style scoped>
/* Add any custom styling here if needed */
</style>