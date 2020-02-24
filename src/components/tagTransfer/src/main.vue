<template>
  <div :id="type" class="el-transfer">
    <el-row v-if="type==='dataTag'" style="margin-bottom: 10px">
      <el-col :span="11">&nbsp;  </el-col>
      <el-col :span="4"> <el-button size="small" @click="dialogVisible = true"> 自定义前缀 <span style="color:#67C23A"> {{ inputPrefix }}</span></el-button></el-col>
    </el-row>
    <transfer-panel
      ref="leftPanel"
      :type="type"
      v-bind="$props"
      :data="sourceData"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      class="left-panel"
      @checked-change="onSourceCheckedChange"
    >
      <slot name="left-footer" />
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        :disabled="rightChecked.length === 0"
        @click.native="addToLeft"
      >
        <i class="el-icon-arrow-left" />
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        :disabled="leftChecked.length === 0"
        @click.native="addToRight"
      >
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right" />
      </el-button>
    </div>

    <transfer-panel
      v-if="type === 'businessChannel'"
      ref="rightPanel"
      :type="type"
      v-bind="$props"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      :custom-prefix="prefix"
      class="right-panel"
      @checked-change="onTargetCheckedChange"
    >
      <slot name="right-footer" />
    </transfer-panel>
    <transfer-panel
      v-else
      ref="rightPanel"
      :type="type"
      v-bind="$props"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      :is-show-input="true"
      :custom-prefix="prefix"
      class="right-panel"
      @checked-change="onTargetCheckedChange"
    >
      <slot name="right-footer" />
    </transfer-panel>

    <el-dialog
      title="自定义前缀"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-input v-model="inputPrefix" placeholder="请输入前缀" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePrefix">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ElButton from 'element-ui/packages/button'
import Emitter from 'element-ui/src/mixins/emitter'
import Locale from 'element-ui/src/mixins/locale'
import TransferPanel from './transfer-panel.vue'
import Migrating from 'element-ui/src/mixins/migrating'

export default {
  name: 'XcomTagTransfer',

  components: {
    TransferPanel,
    ElButton
  },

  mixins: [Emitter, Locale, Migrating],

  props: {
    type: {
      type: String,
      default() {
        return ''
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    titles: {
      type: Array,
      default() {
        return []
      }
    },
    buttonTexts: {
      type: Array,
      default() {
        return []
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: {
      type: Function,
      default: () => function() {}
    },
    leftDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    renderContent: {
      type: Function,
      default: () => function() {}
    },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    format: {
      type: Object,
      default() {
        return {}
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        }
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    }
  },

  data() {
    return {
      prefix: '',
      inputPrefix: '',
      dialogVisible: false,
      leftChecked: [],
      rightChecked: []
    }
  },

  computed: {
    dataObj() {
      const key = this.props.key
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {})
    },

    sourceData() {
      return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1)
    },

    targetData() {
      if (this.targetOrder === 'original') {
        return this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1)
      } else {
        return this.value.reduce((arr, cur) => {
          const val = this.dataObj[cur]
          if (val) {
            arr.push(val)
          }
          return arr
        }, [])
      }
    },

    hasButtonTexts() {
      return this.buttonTexts.length === 2
    }
  },

  watch: {
    value(val) {
      this.dispatch('ElFormItem', 'el.form.change', val)
    }
  },
  created() {
    // console.log(this.type)
  },
  methods: {
    handlePrefix() {
      this.prefix = this.inputPrefix
      this.dialogVisible = false
    },
    getMigratingConfig() {
      return {
        props: {
          'footer-format': 'footer-format is renamed to format.'
        }
      }
    },

    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val
      if (movedKeys === undefined) return
      this.$emit('left-check-change', val, movedKeys)
    },

    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val
      if (movedKeys === undefined) return
      this.$emit('right-check-change', val, movedKeys)
    },

    addToLeft() {
      const currentValue = this.value.slice()
      this.rightChecked.forEach(item => {
        const index = currentValue.indexOf(item)
        if (index > -1) {
          currentValue.splice(index, 1)
        }
      })
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'left', this.rightChecked)
    },

    addToRight() {
      let currentValue = this.value.slice()
      const itemsToBeMoved = []
      const key = this.props.key
      this.data.forEach(item => {
        const itemKey = item[key]
        if (
          this.leftChecked.indexOf(itemKey) > -1 &&
            this.value.indexOf(itemKey) === -1
        ) {
          itemsToBeMoved.push(itemKey)
        }
      })
      currentValue = this.targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved)
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'right', this.leftChecked)
    },

    clearQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = ''
      } else if (which === 'right') {
        this.$refs.rightPanel.query = ''
      }
    },
    getQuery() {
      return {
        sourceData: this.sourceData,
        targetData: this.targetData,
        prefix: this.prefix
      }
    }
  }
}
</script>

<style lang="scss" scoped>

 #dataTag .right-panel{
    width:400px;
    input{
      width: 100px;
    }
  }

 #businessChannel{
   .left-panel{
     width:300px;
   }
   .right-panel{
     width:300px;
   }
 }

</style>
