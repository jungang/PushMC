<template>
  <section class="common" />
</template>

<script>

import { mapGetters } from 'vuex'
import { sourceOption } from '@/api/common'
export default {
  name: 'Common',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      console.log('init............')
      this.getDataSourceModel()
    },
    getDataSourceModel() {
      sourceOption().then(response => {
        console.log(response)
      })
    }
  }
}
</script>
