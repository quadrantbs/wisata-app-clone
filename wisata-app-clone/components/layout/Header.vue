<template>
    <v-app-bar app fixed elevate-on-scroll height="64" class="elevation-0 headerRef">
        <v-container class="d-flex align-center justify-space-between container">
            <div class="d-flex flex-start align-center">
                <nuxt-link to="/" class="d-flex align-center">
                    <img src="/img/logo.png" alt="app-logo" height="42" />
                </nuxt-link>
            </div>

            <v-dialog 
            v-model="searchDialog"
            :close-on-content-click="false"
            contained
            attach=".mainRef"
            location-strategy="connected"
            origin="top"
            offset="10 0"
            >
                <template v-slot:activator="{ props }">
                    <div class="d-flex align-center flex-fill justify-center">
                        <v-btn class="appsearchbar-btn" v-bind="props" style="height: 40px; max-width: 70%;">
                            <v-icon left>mdi-magnify</v-icon>
                            <v-responsive>
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
                        <div>
                            <v-btn class="btn" v-bind="props">
                                Sign in
                            </v-btn>
                        </div>
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
import { ref, onMounted, watch } from 'vue'
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
const selectedStore = useSelectedStore()

// Fetch Property Data
const fetchPropertyData = async (slug) => {
    try {
        const response = await fetch(`https://project-technical-test-api.up.railway.app/property/search?query=${slug}`)
        const data = await response.json()

        if (data && data.length > 0) {
            location.value = data[0].name
            selectedStore.setSelectedData(data[0])
        } else {
            location.value = 'Location not found'
        }
    } catch (error) {
        console.error("Error fetching location:", error)
        location.value = 'Location not available'
    }
}

// Update Date Range
const updateDateRange = (checkin, checkout) => {
    dateRangeText.value = formatRangeDate(checkin, checkout)
}

// Fetch data on mount
onMounted(() => {
    const { slug } = route.params
    fetchPropertyData(slug)
})

// Watch for changes in the route params (slug, checkin, checkout)
watch(
    () => ({
        slug: route.params.slug,
        checkin: route.query.checkin,
        checkout: route.query.checkout
    }),
    (newParams) => {
        const { slug, checkin, checkout } = newParams

        // Fetch property data again when slug changes
        fetchPropertyData(slug)

        // Update date range whenever checkin or checkout changes
        updateDateRange(checkin, checkout)
    },
    { immediate: true } // Ensure it runs on initial mount as well
)

// Close search dialog when route changes
watch(
    () => [route.params, route.query],
    () => {
        searchDialog.value = false; // Close dialog on route param or query change
    }
)
</script>


<style scoped>
.appsearchbar-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    /* max-width: 70%; */
    width: 100%;
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

.searchnav-wrapper {
    /* width: 100vw; */
    /* max-width: 1032px; */
}
</style>
