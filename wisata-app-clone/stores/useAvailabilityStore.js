import { defineStore } from "pinia";

export const useAvailabilityStore = defineStore("availability", {
  state: () => ({
    availabilityData: null,
  }),
  actions: {
    setAvailabilityData(data) {
      this.availabilityData = data;
    },
  },
});
