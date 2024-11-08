<template>
    <v-row class="property-catalog ">
        <v-col cols="4" class="">
            <v-img :src="propertyData?.catalog?.hero_image_url?.md" :alt="propertyData?.name" width="
            168px" :aspect-ratio="1" cover class="rounded-circle catalog-image" />
        </v-col>
        <v-col cols="8" class="catalog-data ">
            <div class="d-flex align-center ">
                <h1 class="title">{{ propertyData?.name }}</h1>
                <div class="d-flex align-center" style="margin-left: 8px;">
                    <v-icon v-if="propertyData" v-for="i in Math.floor(propertyData?.catalog.star_rating)" :key="i"
                        color="yellow-darken-2" size="18px">
                        mdi-star
                    </v-icon>
                </div>
            </div>
            <p class="text-capitalize subtitle">{{ propertyData?.type }}</p>
            <p class="paragraph mb-2">{{ propertyData?.address_line }}, {{ propertyData?.name_suffix }} {{
                propertyData?.catalog.postal_code }}</p>
            <div v-if="propertyData?.catalog.review_rating" class="d-flex reviews">
                <v-progress-circular :model-value="propertyData?.catalog.review_rating" color="purple"><template
                        v-slot:default> {{ propertyData?.catalog.review_rating }}
                    </template></v-progress-circular>
                <p class="ml-2">{{ reviewPredicate }} · {{ propertyData?.catalog.review_count }} review<span
                        v-if="propertyData?.catalog.review_count > 1">s</span></p>
            </div>
        </v-col>
    </v-row>
    <v-tabs v-model="tab" align-tabs="center" color="primary" class="border-t">
        <v-tab prepend-icon="mdi-tag-outline" value="deals">Deals</v-tab>
        <v-tab prepend-icon="mdi-grid" value="photos">Photos</v-tab>
        <v-tab prepend-icon="mdi-information-outline" value="info">Info</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
        <v-tabs-window-item value="deals">
            <DealsSection :fetchingAvailability="fetchingAvailability" />
        </v-tabs-window-item>
        <v-tabs-window-item value="photos">
            <PhotosSection />
        </v-tabs-window-item>
        <v-tabs-window-item value="info">
            <InfoSection />
        </v-tabs-window-item>
    </v-tabs-window>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAvailabilityStore } from '~/stores/useAvailabilityStore';
import DealsSection from '~/components/stay/DealsSection.vue';
import PhotosSection from '~/components/stay/PhotosSection.vue';
import InfoSection from '~/components/stay/InfoSection.vue';

const route = useRoute();
const availabilityStore = useAvailabilityStore();
const propertyStore = usePropertyStore();

const slug = ref('');
const checkinDate = ref('');
const checkoutDate = ref('');
const guestsPerRoom = ref(2);
const rooms = ref(1);
const propertyId = ref(null);
const tab = ref('deals');
const fetchingAvailability = ref(false);

const fetchAvailability = async () => {
    const url = `https://project-technical-test-api.up.railway.app/stay/availability/${propertyId.value}?checkin=${checkinDate.value}&checkout=${checkoutDate.value}&guest_per_room=${guestsPerRoom.value}&number_of_room=${rooms.value}`;
    try {
        availabilityStore.setAvailabilityData(null);
        fetchingAvailability.value = true;
        // console.log('Fetching availability:', fetchingAvailability.value);
        const response = await fetch(url);
        const data = await response.json();
        availabilityStore.setAvailabilityData(data);
    } catch (error) {
        console.error('Error fetching availability:', error);
    } finally {
        fetchingAvailability.value = false;
        // console.log('Fetching availability:', fetchingAvailability.value);
    }
};

const fetchProperty = async () => {
    const url = `https://project-technical-test-api.up.railway.app/property/content?id=${propertyId.value}&include=image&include=room&include=important_info&include=general_info`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        propertyStore.setPropertyData(data[propertyId.value]);
    } catch (error) {
        console.error('Error fetching property:', error);
    }
};

watchEffect(() => {
    slug.value = route.params.slug;
    checkinDate.value = route.query.checkin;
    checkoutDate.value = route.query.checkout;
    guestsPerRoom.value = parseInt(route.query.guest_per_room);
    rooms.value = parseInt(route.query.number_of_room);
    propertyId.value = slug.value?.split('-').pop();
    fetchAvailability();
    fetchProperty();
});

const propertyData = computed(() => propertyStore.propertyData);
const reviewPredicate = computed(() => {
    if (!propertyData.value || !propertyData.value.catalog) return 'No Rating';

    const rating = propertyData.value.catalog.review_rating;

    if (rating >= 90) {
        return 'Excellent';
    } else if (rating >= 75) {
        return 'Very Good';
    } else if (rating >= 60) {
        return 'Good';
    } else if (rating >= 40) {
        return 'Average';
    } else if (rating >= 20) {
        return 'Poor';
    } else {
        return 'Very Poor';
    }
});
</script>

<style scoped>
.property-image {
    /* width: 40% */
}

.property-catalog {
    /* display: flex; */
    /* flex-direction: row; */
    /* justify-content: flex-start; */
    /* align-items: center; */
    margin-bottom: 1rem;
    margin-top: 0.5rem;
}

.catalog-image {
    margin: 0 auto;
}

.title {
    font-size: 20px;
}

.subtitle {
    font-size: 15px;
    color: grey;
    font-family: Roboto;
}

.paragraph {
    font-size: 15px;
    font-family: Roboto;
}

.reviews {
    align-items: center;
}
</style>