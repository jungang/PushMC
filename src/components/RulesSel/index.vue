<template>

  <div>

    <!--    mainOptions:{{mainOptions}}-->
    <!--    options:{{ options }}-->

    <el-table
      :data="rules"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50"
      />
      <el-table-column
        prop="item1.tableKey"
        label="左侧"
        align="center"
        width="200"
      >
        <template slot-scope="{row}">
          <el-select v-model="row.mainColumnPath" placeholder="请选择">
            <el-option
              v-for="item in mainOptions"
              :key="item.id"
              :label="item.pathTitle"
              :value="item.path"
            />
          </el-select>
          <!--          <el-input v-model="row.mainColumnPathValue" placeholder="请输入内容" style="width:60px" />-->
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="运算符"
        align="center"
      >
        <template slot-scope="{row}">
          <el-select v-model="row.expression" placeholder="请选择">
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
        label="右侧"
        align="center"
        width="280"
      >
        <template slot-scope="{row}" style="text-align: left">
          <el-select
            v-model="row.valueColumn"
            placeholder="请选择"
            style="width:150px"
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
              :value="item.id"
            />
          </el-select>

          <el-input v-model="row.valueColumnPathValue" :disabled="row.valueColumn !== '-2'" placeholder="请输入" style="width:100px" />

        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" @click="handleRuleDelete(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col :span="12">
        <el-button type="primary" :disabled="mainOptions.length === 0" size="mini" @click="handleAddRule">+添加规则条目</el-button>
      </el-col>
    </el-row>

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
          value: 'equal',
          label: 'equal'
        }, {
          value: 'unequal',
          label: 'unequal'
        }, {
          value: 'like',
          label: 'like'
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
    handleSel(row) {
      if (row.valueColumn === '-2') {
        row.valueResourceId = ''
      } else {
        this.options.forEach(item => {
          if (item.id === row.valueColumn) {
            row.valueResourceId = item.resourceId
            row.valueColumnPath = item.path
          }
        })
      }
      console.log(row)
    },
    handleAddRule() {
      console.log(this.mainOptions)
      console.log(this.options)
      if (this.mainOptions.length > 0) {
        this.rules.push({
          expression: '',
          mainColumnPath: '',
          mainColumnPathValue: '',
          mainResourceId: this.mainOptions[0].resourceId,
          valueColumn: '-2',
          valueColumnPath: '',
          valueColumnPathValue: '',
          valueResourceId: ''
        })
        console.log(this.rules)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
