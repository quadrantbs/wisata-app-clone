<template>
    <v-app-bar app fixed elevate-on-scroll height="64" class="elevation-0">
        <v-container class="d-flex align-center justify-space-between container">
            <div class="d-flex flex-start align-center">
                <nuxt-link to="/" class="d-flex align-center">
                    <img src="/img/logo.png" alt="app-logo" height="42" />
                </nuxt-link>
            </div>

            <v-dialog v-model="searchDialog" :close-on-content-click="false" elevation-10>
                <template v-slot:activator="{ props }">
                    <div class="d-flex align-center flex-fill justify-center">
                        <v-btn class="appsearchbar-btn" v-bind="props" style="height: 40px; max-width: 70%;">
                            <v-icon left>mdi-magnify</v-icon>
                            <v-responsive max-width="50%">
                                <span class="text-truncate">{{ location }}</span>
                            </v-responsive>
                            <span>&nbsp;&nbsp;·&nbsp;&nbsp;{{ dateRangeText }}</span>
                        </v-btn>
                    </div>
                </template>
                    <BookInputCard />
            </v-dialog>

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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BookInputCard from './BookInputCard.vue'
import SignInCard from './SignInCard.vue'

// State
const searchDialog = ref(false)
const signInDialog = ref(false)
const location = ref('')
const dateRangeText = ref('')

// Route access
const route = useRoute()

// Fetch data on mount
onMounted(async () => {
    const slug = route.params.slug
    const checkin = route.query.checkin
    const checkout = route.query.checkout

    // Fetch location
    try {
        const response = await fetch(`https://project-technical-test-api.up.railway.app/property/search?query=${slug}`)
        const data = await response.json()

        if (data && data.length > 0) {
            location.value = data[0].name
        } else {
            location.value = 'Location not found'
        }
    } catch (error) {
        console.error("Error fetching location:", error)
        location.value = 'Location not available'
    }

    if (checkin && checkout) {
        const startDate = formatDate(new Date(checkin));
        const endDate = formatDate(new Date(checkout));
        if (startDate.year === endDate.year) {
            dateRangeText.value = startDate.month === endDate.month
                ? `${startDate.day} - ${endDate.day} ${startDate.month} ${startDate.year}`
                : `${startDate.day} ${startDate.month} - ${endDate.day} ${endDate.month} ${startDate.year}`;
        } else {
            dateRangeText.value = `${startDate.day} ${startDate.month} ${startDate.year} - ${endDate.day} ${endDate.month} ${endDate.year}`;
        }
    } else if (checkin && !checkout) {
        const singleDate = formatDate(new Date(checkin));
        dateRangeText.value = `${singleDate.day} ${singleDate.month} ${singleDate.year}`;
    }
})
</script>

<style scoped>

.appsearchbar-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 70%;
    background-color: #f5f5f5;
    border-radius: 5px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
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
    max-width: 150px;
}

.signin-btn {
    background-color: #007aff;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
}

.searchnav-wrapper {
    /* width: 100vw; */
    /* max-width: 1032px; */
}
</style>
