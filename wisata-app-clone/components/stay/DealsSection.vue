<template>
    <!-- Filter Buttons -->
    <v-row class="my-4" justify="center">
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
                    :active="freeCancellation" @click="toggleFreeCancellation" prepend-icon="mdi-credit-card-check-outline">
                    Free Cancellation
                </v-btn>
            </v-btn-toggle>
        </div>
    </v-row>

    <!-- Room Offers -->
    <v-row v-for="(offerGroup, groupIndex) in filteredOffers" :key="groupIndex" cols="12" class="my-4">
        <v-col cols="4">
            <!-- Images Section -->
            <div class="rounded-lg overflow-hidden">
                <v-img :src="offerGroup[0].room_images[0].size_sm" alt="Room Image" class="w-100" height="200px"
                    cover></v-img>
                <v-row class="mt-1" no-gutters>
                    <v-col cols="4" v-for="(image, idx) in offerGroup[0].room_images.slice(1, 4)" :key="idx">
                        <v-img :src="image.size_sm" alt="Room Image" height="80px" cover
                            :class="idx === 1 ? 'mx-1' : ''"></v-img>
                    </v-col>
                </v-row>
            </div>
        </v-col>

        <v-col cols="8">
            <!-- Details Section -->
            <div class="border pa-4 rounded-lg">
                <div class="d-flex justify-space-between">
                    <h3>{{ offerGroup[0].room_name }}</h3>
                    <v-btn variant="text" small class="text-none rounded-pill" color="primary">See Details</v-btn>
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
                                {{ offer.cancel_policy_description === 'Non-refundable' ? 'mdi-credit-card-off-outline' :
                                    'mdi-credit-card-check-outline' }}
                            </v-icon>
                            {{ offer.cancel_policy_description }}
                        </div>

                        <!-- Pricing Information -->
                        <div class="d-flex justify-space-between align-center mt-2">
                            <div>
                                <div
                                    v-if="offer.pricing_data.cashback_pct + offer.pricing_data.bonus_cashback_pct + offer.pricing_data.saving_pct >= 0.1" class="bg-deep-orange d-inline-block px-2 rounded-sm text-caption mb-2">
                                    SAVE <span class="text-subtitle-2">{{ Math.floor((offer.pricing_data.cashback_pct +
                                        offer.pricing_data.bonus_cashback_pct + offer.pricing_data.saving_pct)*100) }}%</span> TODAY!
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
const availabilityData = computed(() => availabilityStore.availabilityData);

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
