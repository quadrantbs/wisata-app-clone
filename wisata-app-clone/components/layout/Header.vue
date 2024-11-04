<template>
    <v-app-bar app fixed elevate-on-scroll height="64" class="elevation-0">
        <v-container class="d-flex align-center justify-space-between container">
            <div class="d-flex flex-start align-center">
                <nuxt-link to="/" class="d-flex align-center">
                    <img src="/img/logo.png" alt="app-logo" height="42" />
                </nuxt-link>
            </div>

            <div class="d-flex align-center flex-fill justify-center">
                <v-btn class="appsearchbar-btn" style="height: 40px; max-width: 70%;">
                    <v-icon left>mdi-magnify</v-icon>
                    <span class="text-truncate">Fairmont Jakarta</span>
                    <span>&nbsp;&nbsp;·&nbsp;&nbsp;4 – 8 Mar 2025</span>
                </v-btn>
            </div>

            <div class="d-flex justify-end">
                <v-menu v-model="dialog" max-width="400" :close-on-content-click="false" origin="right top" offset="16px -75px">
                    <template v-slot:activator="{ props }">
                        <v-btn color="white" class="signin-btn" v-bind="props">
                            Sign in
                        </v-btn>
                    </template>

                    <v-card class="signin-card">
                        <SignInCard />
                    </v-card>
                </v-menu>
            </div>
        </v-container>
    </v-app-bar>
</template>

<script>
import SignInCard from './SignInCard.vue';

export default {
    name: 'Header',
    components: {
        SignInCard
    },
    data() {
        return {
            dialog: false
        };
    }
};
</script>

<style scoped>
.container {
    max-width: 1032px;
    padding: 8px 16px;
}

.appsearchbar-btn {
    background-color: #f5f5f5;
    border-radius: 5px;
    width: 100%;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
    max-width: 590px;
}

.appsearchbar-btn .v-icon {
    font-size: 16px;
    height: 16px;
    width: 16px;
}

.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.signin-btn {
    background-color: #007aff;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
}

.signin-card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
