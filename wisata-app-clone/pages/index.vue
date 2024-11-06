<template>
  <v-app>
    <v-main>
      <v-container max-width="1032px">
        <BookInputCard />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import BookInputCard from '~/components/layout/BookInputCard.vue';

definePageMeta({
  layout: 'custom',
})
</script>