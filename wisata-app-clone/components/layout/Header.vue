<template>
    <v-app-bar app fixed elevate-on-scroll height="64" class="elevation-0">
        <v-container class="d-flex align-center justify-space-between container">
            <div class="d-flex flex-start align-center">
                <nuxt-link to="/" class="d-flex align-center">
                    <img src="/img/logo.png" alt="app-logo" height="42" />
                </nuxt-link>
            </div>

            <v-menu v-model="searchDialog" :close-on-content-click="false" elevation-10>
                <template v-slot:activator="{ props }">
                    <div class="d-flex align-center flex-fill justify-center">
                        <v-btn class="appsearchbar-btn" v-bind="props" style="height: 40px; max-width: 70%;">
                            <v-icon left>mdi-magnify</v-icon>
                            <span class="text-truncate">{{ location }}</span>
                            <span>&nbsp;&nbsp;·&nbsp;&nbsp;{{ dateRangeText }}</span>
                        </v-btn>
                    </div>
                </template>

                <v-card elevation="0" border class="searchnav-wrapper mx-n4 mx-sm-0 px-4 pt-2 rounded-b-lg">
                    <BookInputCard :location="location" :dateRange="dateRange" :guests="guests" :rooms="rooms"
                        @update:location="updateLocation" @update:dateRange="updateDateRange"
                        @update:guests="guests = $event" @update:rooms="rooms = $event"
                        @update:dateRangeText="dateRangeText = $event" />
                </v-card>
            </v-menu>

            <div class="d-flex justify-end">
                <v-menu v-model="signInDialog" max-width="400" :close-on-content-click="false" origin="right bottom"
                    offset="16px 0px" location="right top">
                    <template v-slot:activator="{ props }">
                        <v-btn color="white" class="signin-btn" v-bind="props">
                            Sign in
                        </v-btn>
                    </template>

                    <v-card elevation="0" border>
                        <SignInCard />
                    </v-card>
                </v-menu>
            </div>
        </v-container>
    </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import BookInputCard from './BookInputCard.vue'
import SignInCard from './SignInCard.vue'

const searchDialog = ref(false)
const signInDialog = ref(false)
const location = ref('')
const dateRange = ref([])
const guests = ref(2)
const rooms = ref(1)
const dateRangeText = ref('');

const updateLocation = (newLocation) => {
    location.value = newLocation
}

const updateDateRange = (newRange) => {
    dateRange.value = newRange
}
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

.searchnav-wrapper {
    position: relative;
    /* width: 100vw; */
    max-width: 1032px;
    box-sizing: border-box;
}
</style>
