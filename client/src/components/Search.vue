<template>
  <form class="form" @submit="findCompanies">
    <input
      class="form__input"
      placeholder="Voorkeur programmeertaal*"
      type="text"
      v-model="language"
    />
    <input
      class="form__input"
      placeholder="25187*"
      type="text"
      v-model="education"
    />
    <input class="form__input" placeholder="Postcode" v-model="zip" />
    <select class="form__input" v-model="radius">
      <option value>0</option>
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="15">20</option>
      <option value="15">25+</option>
    </select>
    <button class="btn btn--primary">search</button>
  </form>
</template>

<script>
export default {
  name: 'Search',
  components: {},
  data: function() {
    return {
      language: '',
      education: '25187',
      radius: '',
      zip: '',
      country: 'Nederland'
    };
  },
  methods: {
    findCompanies: async function(e) {
      e.preventDefault();
      this.$emit('find-companies', {
        language: this.language,
        education: this.education,
        radius: this.radius,
        zip: this.zip,
        country: this.country
      });
      this.clearInputs();
    },
    clearInputs: function() {
      this.language = '';
      this.radius = '';
      this.zip = '';
    }
  }
};
</script>

<style scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form__input {
  background-color: transparent;
  border: 2px solid #3d5a80;
  padding: 12px 20px;
  margin-right: 1rem;
  color: white;
}

option {
  color: #3d5a80;
}

@media screen and (max-width: 768px) {
  * {
    box-sizing: border-box;
  }
  .form {
    flex-flow: column nowrap;
    align-items: flex-start;
    width: 100%;
  }

  .form__input {
    width: 100%;
    margin: 1rem 0;
  }

  .btn {
    margin-top: 1rem;
    width: 100%;
  }
}
</style>
