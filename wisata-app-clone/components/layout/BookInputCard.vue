<template>
    <v-row class="book-input-card border rounded-lg container">
        <v-col cols="12" md="12" lg="4">
            <LocationSearch @update:location="localLocation = $event" />
        </v-col>

        <v-col cols="12" md="6" lg="3">
            <v-menu v-model="dateDialog" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                    <v-text-field v-model="dateRangeText" v-bind="props" readonly prepend-inner-icon="mdi-calendar"
                        label="Check In - Check Out" hide-details density="comfortable" variant="outlined"
                        bg-color="white" color="primary" />
                </template>
                <v-card>
                    <v-date-picker v-model="localDateRange" multiple="range" @update:modelValue="handleDateSelection"
                        hide-header
                        :min="localDateRange[0] && localDateRange.length === 1 ? localDateRange[0] : new Date()">
                    </v-date-picker>
                    <v-card-title class="text-subtitle-2 text-center pa-4">{{ dateSelectionText }}</v-card-title>
                </v-card>
            </v-menu>
        </v-col>

        <v-col cols="12" md="6" lg="3">
            <v-menu v-model="guestRoomDialog" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" v-model="guestRoomText" readonly prepend-inner-icon="mdi-account-group"
                        label="Guests & Rooms" hide-details density="comfortable" variant="outlined" bg-color="white"
                        color="primary" />
                </template>
                <v-card min-width="300">
                    <v-card-title class="text-subtitle-1 pa-4">Set Guests & Rooms</v-card-title>
                    <v-card-text>
                        <div class="d-flex flex-column gap-4">
                            <div class="d-flex justify-space-between align-center my-2">
                                <span>Guests/Room</span>
                                <div>
                                    <v-btn icon="mdi-minus" size="small" variant="flat" rounded
                                        @click="updateGuests(localGuests - 1)"></v-btn>
                                    <span class="mx-2">{{ localGuests }}</span>
                                    <v-btn icon="mdi-plus" size="small" variant="flat" rounded
                                        @click="updateGuests(localGuests + 1)"></v-btn>
                                </div>
                            </div>

                            <div class="d-flex justify-space-between align-center my-2">
                                <span>Rooms</span>
                                <div>
                                    <v-btn icon="mdi-minus" size="small" variant="flat" rounded
                                        @click="updateRooms(localRooms - 1)"></v-btn>
                                    <span class="mx-2">{{ localRooms }}</span>
                                    <v-btn icon="mdi-plus" size="small" variant="flat" rounded
                                        @click="updateRooms(localRooms + 1)"></v-btn>
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" @click="guestRoomDialog = false">
                            Done
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-col>

        <v-col cols="12" md="12" lg="2" class="d-flex justify-center">
            <v-btn class="btn rounded-lg w-100" color="primary" prepend-icon="mdi-magnify" @click="performSearch"
                height="48px">
                Search
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { defineProps } from 'vue';
import LocationSearch from './LocationSearch.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps({
    location: { type: Object, default: { name: '', type: '', slug: '' } },
    dateRange: { type: Array, default: () => [] },
    guests: { type: Number, default: 2 },
    rooms: { type: Number, default: 1 }
});

const emit = defineEmits(['update:location', 'update:dateRange', 'update:guests', 'update:rooms',
    'update:dateRangeText']);

const dateDialog = ref(false);
const guestRoomDialog = ref(false);

const localLocation = ref(props.location);

watch(() => props.location, (newLocation) => {
    localLocation.value = newLocation;
});

const localGuests = ref(props.guests);
const localRooms = ref(props.rooms);

onMounted(() => {
    localGuests.value = props.guests;
    localRooms.value = props.rooms;

    // Check for query parameters only on the stay/[slug] page
    if (route.query.checkin && route.query.checkout) {
        const checkinDate = new Date(route.query.checkin);
        const checkoutDate = new Date(route.query.checkout);

        // Create an array of dates from checkin to checkout (inclusive)
        const dateRange = [];
        let currentDate = checkinDate;

        while (currentDate <= checkoutDate) {
            dateRange.push(new Date(currentDate)); // Push a copy of the current date
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        // Store the date range in localDateRange
        localDateRange.value = dateRange;
    }


    if (route.query.guest_per_room) {
        localGuests.value = parseInt(route.query.guest_per_room);
    }

    if (route.query.number_of_room) {
        localRooms.value = parseInt(route.query.number_of_room);
    }

    // Set default date range if not provided
    if (!localDateRange.value || localDateRange.value.length === 0) {
        localDateRange.value = getDefaultDateRange();
    }
});

const localDateRange = ref(props.dateRange);
const isSelectingCheckIn = ref(true);

// Calculate default date range (2 days after today and the following day)
const getDefaultDateRange = () => {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 2);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 1);

    return [checkIn, checkOut];
};

const handleDateSelection = () => {
    if (isSelectingCheckIn.value) {
        isSelectingCheckIn.value = false;

    } else {
        updateDateRange();
        dateDialog.value = false;
        isSelectingCheckIn.value = true;
    }
};

// Watch for changes to the dateDialog
watch(dateDialog, (newVal) => {
    if (!newVal) {
        if (localDateRange.value.length === 1) {
            const nextDay = new Date(localDateRange.value[0]);
            nextDay.setDate(nextDay.getDate() + 1);
            localDateRange.value.push(nextDay);
            updateDateRange();
        }
    }
});

const dateSelectionText = computed(() => isSelectingCheckIn.value ? "Select Check-In Date" : "Select Check-Out Date");

const updateDateRange = () => {
    emit('update:dateRange', localDateRange.value);
    emit('update:dateRangeText', dateRangeText.value);
};

const updateGuests = (value) => {
    const newGuests = Math.max(1, Math.min(10, parseInt(value, 10)));
    localGuests.value = newGuests;
    emit('update:guests', newGuests)
};

const updateRooms = (value) => {
    const newRooms = Math.max(1, Math.min(8, parseInt(value, 10)));
    localRooms.value = newRooms;
    emit('update:rooms', newRooms)
};

const dateRangeText = computed(() => formatRangeDate(localDateRange.value[0], localDateRange.value[localDateRange.value.length - 1]));

const guestRoomText = computed(() => {
    const guestDescription = localGuests.value === 1 ? 'Single Room'
        : localGuests.value === 2 ? 'Double Room'
            : localGuests.value === 3 ? 'Triple Room'
                : `Group of ${localGuests.value}`;
    return `${guestDescription}, ${localRooms.value} Room${localRooms.value > 1 ? 's' : ''}`;
});

const performSearch = () => {
    const { type, slug } = localLocation.value;

    const checkin = localDateRange.value.length > 0
        ? new Date(localDateRange.value[0]).toLocaleDateString('en-CA')
        : new Date().toLocaleDateString('en-CA');
    const checkout = localDateRange.value.length > 1
        ? new Date(localDateRange.value[localDateRange.value.length - 1]).toLocaleDateString('en-CA')
        : new Date(new Date(localDateRange.value[0]).setDate(new Date(localDateRange.value[0]).getDate() + 1)).toLocaleDateString('en-CA');


    const guest_per_room = localGuests.value;
    const number_of_room = localRooms.value;

    if (type === 'property') {
        router.push({
            path: `/stay/${slug}/`,
            query: {
                checkin,
                checkout,
                guest_per_room,
                number_of_room
            }
        });
    } else {
        router.push({
            path: `/explore/${slug}/`,
            query: {
                checkin,
                checkout,
                guest_per_room,
                number_of_room
            }
        });
    }
};

</script>



<style scoped>
.book-input-card {
    padding: 16px;
    background-color: #ffffff;
    width: 100%;
    overflow-y: visible;
    margin: auto;
    align-items: center;
}
</style>
