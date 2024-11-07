import { defineStore } from "pinia";

export const usePropertyStore = defineStore("property", {
  state: () => ({
    propertyData: null,
  }),
  actions: {
    setPropertyData(data) {
      this.propertyData = data;
    },
  },
});
