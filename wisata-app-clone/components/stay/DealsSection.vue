<template>
    <!-- Filter Buttons -->
    <v-row class="my-4" justify="center">
        <v-dialog v-model="detailsDialog" width="auto" class="">
            <v-card width="900" max-height="500" class="rounded-lg">
                <div class="d-flex">
                    <div class="image-details">
                        <v-carousel hide-delimiters progress="white">
                            <v-carousel-item v-for="image in detailsData.images"
                                :src="image.links['1000px'].href"></v-carousel-item>
                        </v-carousel>
                    </div>
                    <div class="content-details">
                        <div class="d-flex align-center border-b px-6 py-3">
                            <h3 class="font-weight-regular">Room Details</h3>
                            <v-btn class="ms-auto" icon="mdi-window-close" variant="text" color="primary" height="20px"
                                @click="detailsDialog = false"></v-btn>
                        </div>
                        <div class="px-6 py-3 overflow-y-auto">
                            <div class="d-flex justify-space-between mb-2">
                                <h3>{{ detailsData.roomData.roomName }}</h3>
                            </div>
                            <div class="d-flex mb-2">
                                <div class="mr-3">
                                    <v-icon class="mr-1">mdi-bed-king-outline</v-icon>
                                    {{ detailsData.roomData.roomBed }}
                                </div>
                                <div>
                                    <v-icon class="mr-1">mdi-ruler-square</v-icon>
                                    {{ detailsData.roomData.roomSize }} m²
                                </div>
                            </div>
                            <div class="d-flex justify-space-between mb-2">
                                <h4>Room Amenities</h4>
                            </div>
                            <div class="ml-4">
                                <li v-for="(amenity, idx) in detailsData.amenities" :key="idx">
                                    {{ amenity.name }}
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-dialog>
        <div class="align-center d-flex mr-3">
            <p><v-icon>mdi-filter-outline</v-icon> Filter rooms by</p>
        </div>

        <div class="align-center d-flex">
            <v-btn variant="outlined" border="sm primary" class="mx-2 rounded-pill text-capitalize"
                v-if="activeFiltersCount > 0" @click="clearFilters"
                :append-icon="'mdi-numeric-' + activeFiltersCount + '-circle'" color="primary" density="default">
                Clear All
            </v-btn>
        </div>

        <!-- Filter Buttons Toggle -->
        <div class="align-center d-flex">
            <v-btn-toggle multiple density="compact">
                <v-btn variant="outlined" border="sm" active-color="primary" class="mx-2 rounded-pill text-capitalize"
                    :active="freeBreakfast" @click="toggleFreeBreakfast" prepend-icon="mdi-silverware-fork-knife">
                    Free Breakfast
                </v-btn>
                <v-btn variant="outlined" border="sm" active-color="primary" class="mx-2 rounded-pill text-capitalize"
                    :active="freeCancellation" @click="toggleFreeCancellation"
                    prepend-icon="mdi-credit-card-check-outline">
                    Free Cancellation
                </v-btn>
            </v-btn-toggle>
        </div>
    </v-row>

    <!-- Room Offers -->
    <v-row v-for="(offerGroup, groupIndex) in filteredOffers" :key="groupIndex" cols="12" class="my-4">
        <v-col cols="4">
            <!-- Images Section -->
            <div class="rounded-lg overflow-hidden cursor-pointer" @click="openDetails(offerGroup[0])">
                <v-img :src="offerGroup[0].room_images[0].size_sm" alt="Room Image" class="w-100" height="200px" cover>
                    <v-btn variant="flat" small
                        class="text-none text-caption rounded-md d-flex position-absolute btn-see-photos"
                        prepend-icon="mdi-grid" height="20px" width="100px">See
                        Photos</v-btn>
                </v-img>
                <v-row class="mt-1" no-gutters>
                    <v-col cols="4" v-for="(image, idx) in offerGroup[0].room_images.slice(1, 4)" :key="idx">
                        <v-img :src="image.size_sm" alt="Room Image" height="80px" cover
                            :class="idx === 1 ? 'mx-1' : ''">
                        </v-img>
                    </v-col>
                </v-row>
            </div>
        </v-col>

        <v-col cols="8">
            <!-- Details Section -->
            <div class="border pa-4 rounded-lg">
                <div class="d-flex justify-space-between">
                    <h3>{{ offerGroup[0].room_name }}</h3>
                    <v-btn variant="text" small class="text-none rounded-pill" color="primary" @click="openDetails(offerGroup[0])">See
                        Details</v-btn>
                </div>
                <div class="d-flex mb-1">
                    <div class="mr-3">
                        <v-icon class="mr-1">mdi-bed-king-outline</v-icon>
                        {{ offerGroup[0].room_bed_groups }}
                    </div>
                    <div>
                        <v-icon class="mr-1">mdi-ruler-square</v-icon>
                        {{ offerGroup[0].room_size_sqm }} m²
                    </div>
                </div>

                <!-- Offer Information -->
                <v-row v-for="offer in offerGroup" :key="offer.offer_id" class="mt-3 py-4 px-2 border-t d-block">
                    <div>
                        <div :class="offer.meal_plan_description ? 'text-green' : ''">
                            <v-icon class="mr-1" :color="offer.meal_plan_description ? 'green' : ''">
                                {{ offer.meal_plan_description ? 'mdi-silverware-fork-knife' : 'mdi-silverware-variant'
                                }}
                            </v-icon>
                            {{ offer.meal_plan_description || 'Without breakfast' }}
                        </div>

                        <div :class="offer.cancel_policy_description === 'Non-refundable' ? 'text-red' : 'text-green'">
                            <v-icon class="mr-1"
                                :color="offer.cancel_policy_description === 'Non-refundable' ? 'red' : 'green'">
                                {{ offer.cancel_policy_description === 'Non-refundable' ? 'mdi-credit-card-off-outline'
                                    :
                                    'mdi-credit-card-check-outline' }}
                            </v-icon>
                            {{ offer.cancel_policy_description }}
                        </div>

                        <!-- Pricing Information -->
                        <div class="d-flex justify-space-between align-center mt-2">
                            <div>
                                <div v-if="offer.pricing_data.cashback_pct + offer.pricing_data.bonus_cashback_pct + offer.pricing_data.saving_pct >= 0.1"
                                    class="bg-deep-orange d-inline-block px-2 rounded-sm text-caption mb-2">
                                    SAVE <span class="text-subtitle-2">{{ Math.floor((offer.pricing_data.cashback_pct +
                                        offer.pricing_data.bonus_cashback_pct + offer.pricing_data.saving_pct) * 100)
                                        }}%</span> TODAY!
                                </div>
                                <div class="font-weight-bold">Rp {{ offer.price_total.toLocaleString() }} <span
                                        class="font-weight-light text-subtitle-2">/ night</span><span
                                        class="text-grey">*</span></div>
                                <div class="text-caption text-grey">after tax & fees</div>
                            </div>
                            <v-spacer></v-spacer>
                            <v-btn small class="btn" :href="offer.price_check_href">Book Now</v-btn>
                        </div>

                        <div class="d-flex justify-space-between align-center">
                            <h6 class="font-weight-regular text-grey"><span class="font-weight-bold">*</span>
                                Member-only price, valid in app only</h6>
                            <p class="text-primary text-caption"><v-icon class="mr-1" size="x-small">mdi-star</v-icon>
                                Collect 3 points</p>
                        </div>
                    </div>
                </v-row>
            </div>
        </v-col>
    </v-row>
</template>



<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const availabilityStore = useAvailabilityStore();
const propertyStore = usePropertyStore();
const availabilityData = computed(() => availabilityStore.availabilityData);
const propertyData = computed(() => propertyStore.propertyData);
const detailsDialog = ref(false)
const detailsData = ref({
    images: [],
    roomId: '',
    amenities: [],
    roomData: {
        roomBed: '',
        roomSize: '',
        roomName: ''
    }
})

const openDetails = (offerGroup) => {
    detailsData.value.roomId = offerGroup.room_data.id
    detailsData.value.images = propertyData.value.room[detailsData.value.roomId].images
    detailsData.value.amenities = propertyData.value.room[detailsData.value.roomId].amenities
    detailsData.value.roomData.roomBed = offerGroup.room_bed_groups
    detailsData.value.roomData.roomSize = offerGroup.room_size_sqm
    detailsData.value.roomData.roomName = offerGroup.room_name
    detailsDialog.value = true
};

// Filter state (set initial values based on query parameters)
const freeBreakfast = ref(route.query.free_breakfast === 'true');
const freeCancellation = ref(route.query.free_cancellation === 'true');

// Watch for changes in filters to update the query parameters
watch([freeBreakfast, freeCancellation], () => {
    const updatedQuery = { ...route.query };  // Start with existing query parameters

    // Add only those filters that are `true`
    if (freeBreakfast.value) updatedQuery.free_breakfast = 'true';
    else delete updatedQuery.free_breakfast;

    if (freeCancellation.value) updatedQuery.free_cancellation = 'true';
    else delete updatedQuery.free_cancellation;

    // Update the URL with new query params while preserving others
    router.push({ query: updatedQuery });
});

// Methods to toggle filters
const toggleFreeBreakfast = () => (freeBreakfast.value = !freeBreakfast.value);
const toggleFreeCancellation = () => (freeCancellation.value = !freeCancellation.value);

// Method to clear all filters
const clearFilters = () => {
    freeBreakfast.value = false;
    freeCancellation.value = false;
    router.push({ query: {} });
};

// Count active filters
const activeFiltersCount = computed(() => {
    return [freeBreakfast.value, freeCancellation.value].filter(Boolean).length;
});

// Grouped offers
const groupedOffers = computed(() => {
    const grouped = {};
    availabilityData?.value?.offer_list.forEach(offer => {
        if (!grouped[offer.room_name]) {
            grouped[offer.room_name] = [];
        }
        grouped[offer.room_name].push(offer);
    });
    return Object.values(grouped);
});

// Filtered offers based on selected filters
const filteredOffers = computed(() => {
    // Iterate over each offerGroup
    return groupedOffers.value.map(offerGroup => {
        // Filter offers in the group based on both criteria
        const matchingOffers = offerGroup.filter(offer => {
            const meetsBreakfastCriteria = !freeBreakfast.value || Boolean(offer.meal_plan_description);
            const meetsCancellationCriteria = !freeCancellation.value || offer.cancel_policy_description !== 'Non-refundable';
            return meetsBreakfastCriteria && meetsCancellationCriteria;
        });

        // Return only groups that have at least one matching offer
        return matchingOffers.length > 0 ? matchingOffers : null;
    }).filter(group => group !== null);
});
</script>

<style scoped>
.btn-see-photos {
    bottom: 0;
    left: 0;
    margin: 20px
}

.image-details {
    width: 125%;
    max-width: 56%;
    height: 100%;
    background-color: black
}

.content-details {
    max-width: 44%;
    width: 100%;
    height: 100%;
    background-color: white;
    max-height: 500px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>