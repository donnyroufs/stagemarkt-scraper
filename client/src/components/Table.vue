<template>
  <VueGoodTable :columns="columns" :rows="rows" theme="nocturnal" />
</template>

<script>
import { VueGoodTable } from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";

export default {
  name: "Table",
  props: {
    data: Object,
    language: String
  },
  components: {
    VueGoodTable
  },
  watch: {
    data: function(data) {
      if (data.progress) {
        this.filterBody();
      }
    }
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
  },
  methods: {
    filterBody: async function() {
      if (this.data.progress == null || this.data.progress.length <= 0) {
        return null;
      }
      this.rows =
        this.data.progress.filter(({ body }) => {
          if (body === undefined || body == null) return;
          return body.toLowerCase().includes(this.language.toLowerCase());
        }) || [];
    }
  }
};
</script>

<style scoped>
</style>