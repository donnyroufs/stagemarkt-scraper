<template>
  <div class="flex">
    <DotLoader color="#fc5130" />
    <p v-if="data != null">
      {{ data.progress.entries.current }} van de
      {{ data.progress.entries.entries }} applicaties doorzocht.
    </p>
  </div>
</template>

<script>
import { DotLoader } from '@saeris/vue-spinners';

export default {
  components: {
    DotLoader
  },
  data: () => {
    return {
      data: null,
      apiUrl: process.env.VUE_APP_API_URL,
      timeoutId: null
    };
  },
  created: async function() {
    await this.getProgress();
  },
  destroyed: async function() {
    clearTimeout(this.timeoutId);
  },
  methods: {
    getProgress: async function() {
      this.timeoutId = setTimeout(async () => {
        // @TODO: id
        const res = await fetch(`${this.apiUrl}/poll/1`);
        const data = await res.json();
        console.log(data);
        console.log(typeof data);
        this.data = data;
        console.log(this.data);
        console.log(typeof this.data);
        console.log(this.data.length);
        this.getProgress();
      }, 500);
    }
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

p {
  margin-top: 2rem;
  font-size: 1.05rem;
}
</style>
