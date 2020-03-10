<template>

  <div>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="handleAddRule">+添加规则条目</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="rules"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
      />
      <el-table-column
        prop="item1.tableKey"
        label="选择数据项"
        width="300"
        align="center"
      >
        <template slot-scope="{row}">
          <el-select v-model="row.mainColumnPath" placeholder="请选择" style="width:150px">
            <el-option
              v-for="item in mainOptions"
              :key="item.id"
              :label="item.pathTitle"
              :value="item.path"
            />
          </el-select>
          <el-input v-if="!options.length" v-model="row.valueColumnPath" placeholder="请输入内容" style="width:100px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="条件"
        width="150"
        align="center"
      >
        <template slot-scope="{row}">
          <el-select v-model="row.expression" :disabled="options.length===0" placeholder="请选择" style="width: 100px">
            <el-option
              v-for="item in ruleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="选择数据项"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <el-select
            v-model="row.pathTitle"
            :disabled="options.length===0"
            placeholder="请选择"
            style="width:50%"
            @change="handleSel(row)"
          >
            <el-option
              label="常量"
              value="-2"
            />
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.pathTitle"
              :value="`${item.pathTitle}--${item.path}--${item.resourceId}`"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleRuleDelete(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'RulesSel',
  props: {
    rules: {
      required: true,
      type: Array
    },
    mainOptions: {
      required: true,
      type: Array
    },
    options: {
      required: false,
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      ruleOptions: [
        {
          value: '==',
          label: '=='
        }, {
          value: '!=',
          label: '!='
        }, {
          value: '>',
          label: '>'
        }, {
          value: '<',
          label: '<'
        }]
    }
  },
  computed: { },
  watch: {
    mainOptions: function(val) {
      console.log('mainOptions...')
      console.log(this.rules)
    }
  },
  created() {
  },
  methods: {
    handleRuleDelete(row) {
      const index = this.rules.indexOf(row)
      this.rules.splice(index, 1)
    },
    handleSel(val) {
      console.log(val)
      val.valueResourceId = val.pathTitle.split('--')[2]
      val.valueColumnPath = val.pathTitle.split('--')[1]
      val.pathTitle = val.pathTitle.split('--')[0]
    },
    handleAddRule() {
      if (this.mainOptions.length > 0) {
        this.rules.push({
          expression: 'equal',
          mainColumnPath: '',
          mainResourceId: this.mainOptions[0].resourceId,
          valueColumnPath: '',
          valueResourceId: -2
        })
        console.log(this.rules)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
