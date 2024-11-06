<template>
    <div>
        <h1>Stay Details for {{ slug }}</h1>
        <p>Check-in Date: {{ checkinDate }}</p>
        <p>Check-out Date: {{ checkoutDate }}</p>
        <p>Guests per Room: {{ guestsPerRoom }}</p>
        <p>Number of Rooms: {{ rooms }}</p>
        <p v-if="availabilityData">Availability: {{ availabilityData }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAvailabilityStore } from '~/stores/useAvailabilityStore';

const route = useRoute();
const availabilityStore = useAvailabilityStore();

const slug = ref('');
const checkinDate = ref('');
const checkoutDate = ref('');
const guestsPerRoom = ref(2);
const rooms = ref(1);

const fetchAvailability = async () => {
    const propertyId = slug.value.split('-').pop();
    const url = `https://project-technical-test-api.up.railway.app/stay/availability/${propertyId}?checkin=${checkinDate.value}&checkout=${checkoutDate.value}&guest_per_room=${guestsPerRoom.value}&number_of_room=${rooms.value}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        availabilityStore.setAvailabilityData(data);
        console.log(availabilityStore.availabilityData);
    } catch (error) {
        console.error('Error fetching availability:', error);
    }
};

onMounted(() => {
    slug.value = route.params.slug;
    checkinDate.value = route.query.checkin;
    checkoutDate.value = route.query.checkout;
    guestsPerRoom.value = parseInt(route.query.guest_per_room);
    rooms.value = parseInt(route.query.number_of_room);

    fetchAvailability();
});

const availabilityData = computed(() => availabilityStore.availabilityData);
</script>