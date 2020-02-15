<template>
  <div id="app">
    <header>
      <div>
        <h1 class="logo">StagemarktScraper</h1>
        <p class="subtitle">Vind een A.O stageplek op voorkeur!</p>
      </div>
      <Search v-on:find-companies="findCompanies" v-bind:filtering="filtering" />
    </header>
    <main v-bind:class="{ flexCenter: loading }">
      <Progress v-if="loading" />
      <span v-else-if="!loading && error.length > 1">{{ error }}</span>
      <Table v-bind:data="data" v-bind:language="language" v-else />
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
      data: null,
      apiUrl: process.env.VUE_APP_API_URL,
      loading: false,
      filtering: false,
      error: "",
      progress: null,
      timeoutId: null,
      language: ""
    };
  },
  methods: {
    findCompanies: async function(_data) {
      try {
        this.error = "";
        this.language = _data.language;
        this.loading = true;
        // This will start the scraping process and give me a progress id to refer too.
        const res = await fetch(`${this.apiUrl}/companies`, {
          method: "POST",
          body: JSON.stringify({ _data }),
          headers: {
            "Content-Type": "application/json"
          }
        });
        // Find all applications
        const { progress } = await res.json();
        this.progress = progress;
        this.loading = false;
        // Filter based on our critera
        this.filtering = true; // Wil be used for search button indicator
        await this.getFilteredEntries();

        // Grabs entries based on education
        // const res2 = await fetch(`${this.apiUrl}/companies/${progress.id}`, {
        //   method: "GET"
        // });
        // const data = await res2.json();
        // // Filter body based on language
        // this.filterBody(data, _data);
        // this.loading = false;
      } catch (err) {
        this.error = "Er ging iets fout...";
        this.loading = false;
        console.error({ msg: this.error });
      }
    },
    getFilteredEntries: async function() {
      this.timeoutId = setTimeout(async () => {
        const res = await fetch(`${this.apiUrl}/poll/${this.progress.id}`);
        const data = await res.json();
        this.data = data;
        if (this.data.finished) {
          clearTimeout(this.timeoutId);
          return (this.filtering = false);
        }
        await this.getFilteredEntries();
      }, 500);
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
