<template>
    <div class="book-input-card">
        <div class="input-group d-flex">
            <LocationSearch :location="localLocation" @update:location="localLocation = $event" />
        </div>

        <div class="input-group d-flex">
            <v-menu v-model="dateDialog" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                    <v-text-field v-model="dateRangeText" v-bind="props" readonly prepend-inner-icon="mdi-calendar"
                        label="Check In - Check Out" hide-details density="comfortable" variant="outlined"
                        bg-color="white" />
                </template>
                <v-card>
                    <v-date-picker v-model="localDateRange" multiple="range" @update:model-value="updateDateRange" hide-header>
                    </v-date-picker>
                    <v-card-title class="text-subtitle-1 pa-4">Choose Date Range</v-card-title>
                    <v-card-actions class="pa-4">
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" @click="dateDialog = false">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </div>

        <div class="input-group d-flex">
            <v-menu v-model="guestRoomDialog" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" v-model="guestRoomText" readonly prepend-inner-icon="mdi-account-group"
                        label="Guests & Rooms" hide-details density="comfortable" variant="outlined" bg-color="white" />
                </template>
                <v-card min-width="300">
                    <v-card-title class="text-subtitle-1 pa-4">Set Guests & Rooms</v-card-title>
                    <v-card-text>
                        <div class="d-flex flex-column gap-4">
                            <div class="d-flex justify-space-between align-center my-2">
                                <span>Guests/Room</span>
                                <div>
                                    <v-btn icon="mdi-minus" size="small" variant="flat" rounded
                                        @click="updateGuests(guests - 1)"></v-btn>
                                    <span class="mx-2">{{ guests }}</span>
                                    <v-btn icon="mdi-plus" size="small" variant="flat" rounded
                                        @click="updateGuests(guests + 1)"></v-btn>
                                </div>
                            </div>

                            <div class="d-flex justify-space-between align-center my-2">
                                <span>Rooms</span>
                                <div>
                                    <v-btn icon="mdi-minus" size="small" variant="flat" rounded
                                        @click="updateRooms(rooms - 1)"></v-btn>
                                    <span class="mx-2">{{ rooms }}</span>
                                    <v-btn icon="mdi-plus" size="small" variant="flat" rounded
                                        @click="updateRooms(rooms + 1)"></v-btn>
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
        </div>

        <div class="search-btn-wrapper">
            <v-btn class="bg-primary text-none" color="white" prepend-inner-icon="mdi-magnify" variant="text"
                @click="performSearch">
                Search
            </v-btn>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import LocationSearch from './LocationSearch.vue';

const props = defineProps({
    location: { type: String, default: '' },
    dateRange: { type: Array, default: () => [] },
    guests: { type: Number, default: 2 },
    rooms: { type: Number, default: 1 }
});

const emit = defineEmits(['update:location', 'update:dateRange', 'update:guests', 'update:rooms',
    'update:dateRangeText']);

const dateDialog = ref(false);
const guestRoomDialog = ref(false);

const localLocation = computed({
    get: () => props.location,
    set: (value) => emit('update:location', value)
});
const localDateRange = ref(props.dateRange);

const clearLocation = () => { localLocation.value = ''; };
const updateDateRange = () => {
    const formattedText = dateRangeText.value;
    emit('update:dateRange', localDateRange.value);
    emit('update:dateRangeText', formattedText);
};

const updateGuests = (value) => emit('update:guests', Math.max(1, Math.min(10, parseInt(value, 10) || 1)));
const updateRooms = (value) => emit('update:rooms', Math.max(1, Math.min(8, parseInt(value, 10) || 1)));

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    const [month, day, year] = formattedDate.replace(',', '').split(' ');
    return { day, month, year };
};

const dateRangeText = computed(() => {
    if (localDateRange.value.length >= 2) {
        const startDate = formatDate(new Date(localDateRange.value[0]));
        const endDate = formatDate(new Date(localDateRange.value[localDateRange.value.length - 1]));
        if (startDate.year === endDate.year) {
            return startDate.month === endDate.month
                ? `${startDate.day} - ${endDate.day} ${startDate.month} ${startDate.year}`
                : `${startDate.day} ${startDate.month} - ${endDate.day} ${endDate.month} ${startDate.year}`;
        } else {
            return `${startDate.day} ${startDate.month} ${startDate.year} - ${endDate.day} ${endDate.month} ${endDate.year}`;
        }
    } else if (localDateRange.value.length === 1) {
        const singleDate = formatDate(new Date(localDateRange.value[0]));
        return `${singleDate.day} ${singleDate.month} ${singleDate.year}`;
    }
    return '';
});

const guestRoomText = computed(() => {
    const guestDescription = props.guests === 1 ? 'Single Room'
        : props.guests === 2 ? 'Double Room'
            : props.guests === 3 ? 'Triple Room'
                : `Group of ${props.guests}`;
    return `${guestDescription}, ${props.rooms} Room${props.rooms > 1 ? 's' : ''}`;
});

const performSearch = () => {
    console.log('Searching for:', {
        location: localLocation.value,
        dateRange: dateRangeText.value,
        guests: props.guests,
        rooms: props.rooms
    });
};
</script>

<style scoped>
.input-group {
    margin-bottom: 16px;
    width: 100%;
    margin: 8px;
}

.book-input-card {
    padding: 16px;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    overflow-y: visible;
}
</style>
