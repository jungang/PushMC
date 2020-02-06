<template>
  <div class="container">
    <el-row type="flex">
      业务频道
    </el-row>

    <el-row>
      <div style="margin-top: 15px;">
        <el-input v-model="keyword" placeholder="输入关键字，例如：涉黄" clearable style="width: 400px" />
        <el-button type="primary" icon="el-icon-search" style="width: 100px" @click="handleSearch">查询</el-button>
      </div>
    </el-row>

    <el-row type="flex" justify="end" style="margin-bottom: 5px;">
      <el-button type="primary" @click="handleCreate">+ 新建业务频道</el-button>
    </el-row>
    <el-row>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="listArr.data"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" prop="id" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务频道名称" prop="type" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.tag | tags }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据表" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,'deleted')">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="listArr.total>0"
        :total="listArr.total"
        :page.sync="listArr.listQuery.page"
        :limit.sync="listArr.listQuery.limit"
        @pagination="getList()"
      />
    </el-row>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      center
      destroy-on-close
      :width="step==='step1'?'900px':'1300px'"
      @closed="handleDialogClose"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <div v-if="step==='step1'" class="zone-step-1">
          <el-form-item v-if="dialogStatus==='create'" label="输入名称" prop="title">
            <el-input v-model="temp.title" style="width:400px" />
          </el-form-item>

          <el-form-item label="选择业务源" prop="businessSource">
            <el-select
              v-model="temp.businessSource"
              class="filter-item"
              placeholder="请选择"
              @change="filter"
            >
              <el-option v-for="item in MODEL.businessSource" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>

          <el-row type="flex" class="row-bg" justify="center" style="margin-bottom: 20px">
            <XcomTagTransfer
              ref="transfer"
              v-model="tempValue"
              :data="temp.tables"
              :left-default-checked="temp.transferStatus"
              :right-default-checked="temp.transferStatus"
              type="businessChannel"
              :titles="['最多选择三张表', '已选数据表']"
              filterable
              :format="{
                noChecked: '0/'+ tempValueMax,
                hasChecked: '${checked}/'+ tempValueMax
              }"
              @left-check-change="handleCheckLeft"
              @right-check-change="handleCheckRight"
              @change="handleChange"
            />
          </el-row>
          <el-form-item label="选择标签" prop="tag">
            <el-select v-model="temp.tag" class="filter-item" placeholder="请选择">
              <el-option v-for="item in MODEL.tags" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
        </div>

        <div v-if="step==='step2'" class="zone-step-2">

          <p>名称： <span>{{ temp.title }}</span></p>
          <p>数据表： <span>{{ tempValue.length }}</span></p>
          <p>标签： <span>{{ temp.tag }}</span></p>
          <p>频道规则：   <el-button type="primary" @click="handleAddRule">+添加规则条目</el-button></p>

          <el-table
            :data="temp.rules"
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
                <el-select v-model="row.item1.tableName" placeholder="请选择" style="width:50%">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
                <el-input v-model="row.item1.value" placeholder="请输入内容" style="width:45%" />
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="条件"
              width="100"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.operation1" placeholder="请选择" style="width: 60px">
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
              width="300"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.item2.tableName" placeholder="请选择" style="width:50%">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
                <el-input v-model="row.item2.value" placeholder="请输入内容" style="width:45%" />
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

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="step==='step1'" type="primary" @click="nextStep">
          下一步
        </el-button>
        <el-button v-if="step==='step2'" type="primary" @click="step='step1'">
          上一步
        </el-button>
        <el-button v-if="step==='step2'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          完成
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@//utils/index.js'
import { fetchList, fetchTables, fetchDataItem, detail, searchList, createSource, updateSource, dele } from '@/api/businessChannel'
import Pagination from '@/components/Pagination'
import XcomTagTransfer from '@/components/tagTransfer/index'

export default {
  name: 'BusinessChannel',
  components: { Pagination, XcomTagTransfer },
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
        }],
      options: [],
      value: '',
      keyword: '',
      tables: [],
      tableKey: 0,
      listArr: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        }
      },
      listLoading: true,
      tempValue: [],
      tempValueMax: 3,
      temp: {
        id: undefined,
        tag: '',
        title: '',
        tables: []
      },
      dialogFormVisible: false,
      step: 'step1',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        category: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        title: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
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
    this.getList()
  },
  methods: {
    nextStep() {
      fetchDataItem(this.$refs.transfer.value).then(response => {
        this.options = response.data.items
        this.step = 'step2'
      })
    },
    filter() {
      this.getTables()
    },
    handleRuleDelete(row) {
      const index = this.temp.rules.indexOf(row)
      this.temp.rules.splice(index, 1)
    },
    handleDialogClose() {
      // console.log('handleDialogClose...')
      this.step = 'step1'
      this.tempValue = []
      console.log(this.tempValue)
    },
    handleCheckLeft(value, direction) {
      console.log(this.$refs.transfer)
      const n = this.tempValue.length + value.length // 当前数量
      if (n === 3) {
        console.log('===3')
        this.temp.tables.map(item => {
          const status1 = !this.tempValue.find(key => key === item.key)
          const status2 = !value.find(key => key === item.key)
          item.disabled = status1 && status2
        })
      } else if (n >= 3) {
        this.$refs.transfer.leftChecked = this.$refs.transfer.leftChecked.filter((item, index) => index < 3 - this.tempValue.length)
        console.log(this.$refs.transfer.leftChecked)
      } else {
        this.temp.tables.map(item => {
          item.disabled = false
        })
      }
    },
    handleCheckRight() {},
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        console.log(this.$refs.transfer.leftChecked)
        console.log(this.$refs.transfer)
        console.log(this.$refs.transfer.value)

        /*        document.querySelectorAll('span.is-checked').forEach(function(item,index) {
          console.log(index)
          document.querySelectorAll('span.is-checked')[index].click()
        })*/
      }
      if (value.length < 3) {
        this.temp.tables.map(item => {
          item.disabled = false
        })
      }

      if (value.length === 3) {
        this.temp.tables.map(item => {
          const status1 = !this.tempValue.find(key => key === item.key)
          const status2 = !value.find(key => key === item.key)
          item.disabled = status1 && status2
        })
      }
    },

    getTables() {
      fetchTables().then(response => {
        this.temp.tables = response.data
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listArr.listQuery).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listArr.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.tempValue = []
      this.temp = {
        id: undefined,
        category: 'API',
        title: '****',
        tables: deepClone(this.tables),
        transferStatus: [],
        rules: []

      }
    },
    handleSearch() {
      this.listLoading = true
      this.listArr.listQuery.page = 1
      searchList(this.keyword).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },
    handleCreate() {
      this.resetTemp()

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleAddRule() {
      this.temp.rules.push({
        item1: { value: '', tableKey: '', tableName: '' },
        item2: { value: '', tableKey: '', tableName: '' },
        item3: { value: '', tableKey: '', tableName: '' },
        operation1: '==',
        operation2: '=='
      })
      // console.log(this.temp.rules)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'jun'
          createSource(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '完成',
              message: '新建数据源',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      // console.log(row)
      detail(row).then((res) => {
        this.temp = res.data.item
        this.getTables()
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateSource(tempData).then(() => {
            for (const v of this.listArr.data) {
              if (v.id === this.temp.id) {
                const index = this.listArr.data.indexOf(v)
                this.listArr.data.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '完成',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      dele(row.id, status).then(response => {
        this.$notify({
          title: '完成',
          message: '删除',
          type: 'success',
          duration: 2000
        })
        const index = this.listArr.data.indexOf(row)
        this.listArr.data.splice(index, 1)
      })
    },
    getSortClass: function(key) {
      const sort = this.listArr.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }

}
</script>

<style lang="scss" scoped>

  .main-dialog{
    color: red;
    .el-dialog{
      min-width: 650px;
    }
  }
  .main-form{
    max-height: 600px;
  }
</style>
