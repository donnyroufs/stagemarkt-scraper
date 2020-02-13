<template>
  <div id="app">
    <header>
      <h1 class="logo">
        Stagemarkt - Scraper
      </h1>
      <Search v-on:find-companies="findCompanies" />
    </header>
    <main v-bind:class="{ flexCenter: loading }">
      <DotLoader color="#fc5130" v-if="loading" />
      <Table v-bind:data="searchResults" v-else />
    </main>
  </div>
</template>

<script>
import Search from "./components/Search";
import Table from "./components/Table";
import { DotLoader } from "@saeris/vue-spinners";

export default {
  name: "App",
  components: {
    Search,
    Table,
    DotLoader
  },
  data: function() {
    return {
      searchResults: [],
      loading: false
    };
  },
  methods: {
    findCompanies: async function(_data) {
      this.loading = true;
      const res = await fetch("http://stagemarkt.herokuapp.com/companies", {
        method: "POST",
        body: JSON.stringify({ _data }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      // Filter body based on language
      this.searchResults =
        data.details.filter(({ body }) => {
          if (body === undefined || body == null) return;
          return body.includes(_data.language);
        }) || [];
      this.loading = false;
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background: #e0fbfc;
  color: #000;
}
#app {
  display: flex;
  flex-flow: column nowrap;
}
header {
  padding: 2rem;
  background: #293241;
  display: flex;
  justify-content: space-between;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fc5130;
  padding: 12px 32px;
  font-weight: bold;
  outline: 0;
  border: 0;
  text-transform: uppercase;
  color: white;
  cursor: pointer;
}

main {
}
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 143px);
  width: 100%;
}
.logo {
  color: #e0fbfc;
}

@media screen and (max-width: 768px) {
  .header {
    flex-flow: column nowrap;
  }
}
</style>
