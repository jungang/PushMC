<template>
  <section class="common" />
</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'Common',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    MODEL: function() {
      return this.$store.state.publicData.model
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {}
  }
}
</script>
