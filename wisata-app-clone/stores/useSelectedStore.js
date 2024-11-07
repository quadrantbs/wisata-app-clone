import { defineStore } from "pinia";

export const useSelectedStore = defineStore("selected", {
  state: () => ({
    selectedData: null,
  }),
  actions: {
    setSelectedData(data) {
      this.selectedData = data;
    },
  },
});
