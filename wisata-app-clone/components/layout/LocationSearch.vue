<template>
    <div class="location-search">
        <v-menu v-model="menu" :close-on-content-click="false" activator="parent" offset-y>
            <!-- Input Field to trigger the search -->
            <template #activator="{ props }">
                <v-text-field v-model="localLocation.name" label="Where are you going?"
                    prepend-inner-icon="mdi-map-marker" clearable @click:clear="clearLocation" hide-details
                    density="comfortable" variant="outlined" bg-color="white" @input="handleInput" v-bind="props"
                    placeholder="Search for hotels, apartments or villas" color="primary" />
            </template>

            <!-- Loading Indicator -->
            <v-list v-if="isLoading" class="loading-container">
                <v-progress-circular indeterminate color="primary" />
            </v-list>

            <!-- Search Results -->
            <v-list v-if="sortedResults.length" class="results-list">
                <div>
                    <v-list-item v-for="(result, index) in sortedResults" :key="index" @click="selectResult(result)">
                        <div>
                            <!-- Location Type Badge with Icon -->
                            <div :class="['location-badge', getBadgeClass(result.location_type)]">
                                <v-icon :class="getIconClass(result.location_type)" small>
                                    {{ getLocationIcon(result.location_type) }}
                                </v-icon>
                                <span>{{ getLocationTypeLabel(result.location_type) }}</span>
                            </div>
                            <!-- Display Name and Name Suffix -->
                            <v-list-item-title class="result-item">{{ result.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ result.name_suffix }}</v-list-item-subtitle>
                        </div>
                    </v-list-item>
                </div>
            </v-list>
        </v-menu>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    location: { type: String, default: '' },
    type: { type: String, default: '' },
    slug: { type: String, default: '' }
});

const emit = defineEmits(['update:location']);

const menu = ref(false);

const locations = ref([]);
const properties = ref([]);
const isLoading = ref(false);
const loadingTimeout = ref(null);
const localLocation = ref({ name: '', type: '', slug: '' });

watch(localLocation, (newValue) => {
    emit('update:location', newValue);
});

const clearLocation = () => {
    localLocation.value = { name: '', type: '', slug: '' };
    locations.value = [];
    properties.value = [];
};

const sortedResults = computed(() => {
    const combined = [...locations.value, ...properties.value];
    return combined.sort((a, b) => b.fuzzy_ratio - a.fuzzy_ratio);
});

const handleInput = (event) => {
    localLocation.value.name = event.target.value;

    if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value);
    }
    if (!sortedResults.value.length) {
        isLoading.value = true;
    }

    loadingTimeout.value = setTimeout(() => {
        fetchData();
    }, 1000);
};

const fetchData = async () => {
    if (localLocation.value.name.length < 3) {
        locations.value = [];
        properties.value = [];
        menu.value = false;
        isLoading.value = false;
        return;
    }

    menu.value = true;

    try {
        const locationResponse = await fetch(`https://project-technical-test-api.up.railway.app/location/search?query=${localLocation.value.name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const propertyResponse = await fetch(`https://project-technical-test-api.up.railway.app/property/search?query=${localLocation.value.name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!locationResponse.ok || !propertyResponse.ok) {
            throw new Error('Network response was not ok');
        }

        locations.value = await locationResponse.json();
        properties.value = await propertyResponse.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isLoading.value = false;
    }
};

const selectResult = (result) => {
    if (result && typeof result === 'object') {
        localLocation.value = {
            name: result.name,
            type: result.location_type,
            slug: result.slug
        };
        menu.value = false;
    } else {
        console.warn('Invalid result:', result);
    }
};

const getLocationIcon = (type) => {
    const icons = {
        city: 'mdi-city',
        point_of_interest: 'mdi-map-marker-star',
        province_state: 'mdi-map',
        neighborhood: 'mdi-home-group',
        property: 'mdi-office-building',
    };
    return icons[type] || 'mdi-map-marker';
};

const getLocationTypeLabel = (type) => {
    const labels = {
        city: 'City',
        point_of_interest: 'Landmark',
        province_state: 'Area',
        neighborhood: 'Neighborhood',
        property: 'Hotel',
    };
    return labels[type] || 'Unknown';
};

const getBadgeClass = (type) => {
    return type === 'property' ? 'property-badge' : 'default-badge';
};

const getIconClass = (type) => {
    return type === 'property' ? 'icon-green' : 'icon-purple';
};
</script>

<style scoped>
.location-search {
    width: 100%;
    position: relative;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 100%;
    background-color: white;
}


.results-list {
    max-height: 420px;
    overflow-y: auto;
    width: 100%;
    /* max-width: 280px; */
}

.result-item {
    color: black;
}

/* Badge styles */
.location-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.property-badge {
    background-color: #e0f7e9;
    /* Light green */
    color: #388e3c;
    /* Dark green */
    width: fit-content;
}

.default-badge {
    background-color: #f3e5f5;
    /* Light purple */
    color: #6a1b9a;
    /* Dark purple */
    width: fit-content;
}

.icon-green {
    color: #388e3c;
    /* Dark green for property icon */
}

.icon-purple {
    color: #6a1b9a;
    /* Dark purple for other types */
}
</style>
