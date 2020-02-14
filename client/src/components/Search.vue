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
      <option value="5" selected="selected">5</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="20">20</option>
      <option value="25">25+</option>
    </select>
    <button class="btn btn--primary">
      {{ error ? 'Vul alle velden in' : 'Zoeken' }}
    </button>
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
      radius: '5',
      zip: '',
      country: 'Nederland',
      error: false
    };
  },
  methods: {
    findCompanies: async function(e) {
      e.preventDefault();
      const valid = this.validateInputs();

      if (!valid) {
        return (this.error = true);
      }
      this.error = false;

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
      // For now keep everything there except language.
      this.language = '';
    },
    validateInputs: function() {
      if (
        this.language.length <= 0 ||
        this.education.length <= 0 ||
        this.radius.length <= 0 ||
        this.zip.length <= 0
      ) {
        return false;
      }
      return true;
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
