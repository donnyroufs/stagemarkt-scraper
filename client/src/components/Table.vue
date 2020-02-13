<template>
  <VueGoodTable :columns="columns" :rows="data" theme="nocturnal" />
</template>

<script>
import { VueGoodTable } from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";

export default {
  name: "Table",
  props: {
    data: Array
  },
  components: {
    VueGoodTable
  },
  data: function() {
    return {
      columns: [
        {
          label: "Bedrijf",
          field: "name"
        },
        {
          label: "Omschrijving",
          field: "body"
        }
      ],
      rows: []
    };
  }
};
</script>

<style scoped>
</style>