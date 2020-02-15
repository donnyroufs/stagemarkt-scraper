<template>
  <div id="app">
    <header>
      <div>
        <h1 class="logo">StagemarktScraper</h1>
        <p class="subtitle">Vind een A.O stageplek op voorkeur!</p>
      </div>
      <Search v-on:find-companies="findCompanies" />
    </header>
    <main v-bind:class="{ flexCenter: loading }">
      <Progress v-if="loading" />
      <span v-else-if="!loading && error.length > 1">{{ error }}</span>
      <Table v-bind:data="searchResults" v-else />
    </main>
  </div>
</template>

<script>
import Search from "./components/Search";
import Table from "./components/Table";
import Progress from "./components/Progress";

export default {
  name: "App",
  components: {
    Search,
    Table,
    Progress
  },
  data: () => {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      searchResults: [],
      loading: false,
      error: ""
    };
  },
  methods: {
    findCompanies: async function(_data) {
      try {
        this.error = "";
        this.loading = true;
        const res = await fetch(`${this.apiUrl}/companies`, {
          method: "POST",
          body: JSON.stringify({ _data }),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        // Filter body based on language
        this.filterBody(data, _data);
        this.loading = false;
      } catch (err) {
        this.error = "Er ging iets fout...";
        this.loading = false;
        console.error({ msg: this.error });
      }
    },
    filterBody: async function(data, _data) {
      this.searchResults =
        data.details.filter(({ body }) => {
          if (body === undefined || body == null) return;
          return body.toLowerCase().includes(_data.language.toLowerCase());
        }) || [];
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

.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 143px);
  width: 100%;
}
.logo {
  color: #e0fbfc;
  padding-bottom: 0.3rem;
  margin-bottom: 0;
}

.subtitle {
  margin: 0;
  padding: 0;
  color: white;
  opacity: 0.7;
  font-size: 0.95rem;
}

@media screen and (max-width: 768px) {
  header {
    flex-flow: column nowrap;
  }
}
</style>
