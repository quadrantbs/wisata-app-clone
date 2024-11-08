<template>
    <div class="d-flex flex-wrap justify-space-between mt-8 mb-16">
        <v-col v-for="(photo, index) in data.image" :key="index" cols="4" class="photo-item">
            <img v-bind="photo" :src="photo.loaded ? photo.url.lg : null" :alt="photo.caption" class="photo-image"
                @click="openCarousel(index)" @error="handleImageError(index)" ref="imageRefs" />
        </v-col>

        <!-- Carousel Modal -->
        <v-dialog v-model="isCarouselOpen" max-width="800px">
            <v-card>
                <v-carousel :model-value="currentImageIndex" @update:model-value="updateCurrentIndex"
                    hide-delimiters="">
                    <v-carousel-item v-for="(photo, index) in data.image" :key="index">
                        <img :src="photo.url.lg" :alt="photo.caption" class="photo-carousel" />
                    </v-carousel-item>
                </v-carousel>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const propertyStore = usePropertyStore();
const fallbackImage = '/img/fallback-global.png';
const data = ref(propertyStore.propertyData);
const imageRefs = ref([]);
const isCarouselOpen = ref(false);
const currentImageIndex = ref(0);

// Define observer outside lifecycle functions
let observer;

const handleImageError = (index) => {
    const photo = data.value.image[index];
    photo.url.lg = fallbackImage;
};

const loadImage = (entry) => {
    if (entry.isIntersecting) {
        const imageElement = entry.target;
        const index = imageElement.dataset.index;
        const photo = data.value.image[index];
        photo.loaded = true;
        observer.unobserve(imageElement);
    }
};

const openCarousel = (index) => {
    currentImageIndex.value = index;
    isCarouselOpen.value = true;
};

const updateCurrentIndex = (index) => {
    currentImageIndex.value = index;
};

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => loadImage(entry));
    }, { rootMargin: '100px' });

    imageRefs.value.forEach((imageElement, index) => {
        imageElement.dataset.index = index;
        observer.observe(imageElement);
    });
});

onBeforeUnmount(() => {
    if (observer && imageRefs.value.length > 0) {
        imageRefs.value.forEach(imageElement => observer.unobserve(imageElement));
    }
});
</script>


<style scoped>
.photo-item {
    padding: 12px;
}

.photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    aspect-ratio: 1;
}

.photo-carousel {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: transparent;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
}

@media (max-width: 960px) {
    .photo-item {
        padding: 0;
    }
}
</style>
