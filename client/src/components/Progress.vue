<template>
  <div class="flex">
    <DotLoader color="#fc5130" />
    <p>{{ entries }} applicaties aan het doorzoeken.</p>
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
      entries: 0
    };
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
