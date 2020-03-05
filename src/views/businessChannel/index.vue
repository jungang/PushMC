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
            <span>{{ row.tag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据表" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.tables === null ? '0' : row.tables.length }}</span>
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
        hide-on-single-page
        @pagination="getList()"
      />
    </el-row>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      center
      destroy-on-close
      top="5vh"
      custom-class="bcdialog"
      :width="step==='step1'?'900px':'1300px'"
      @closed="handleDialogClose"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px" class="main-form">

        <div v-if="step==='step1'" class="zone-step-1">
          <el-form-item v-if="dialogStatus==='create'" label="输入名称" prop="title">
            <el-input v-model="temp.title" style="width:400px" />
          </el-form-item>

          <el-form-item label="选择数据源" prop="businessSource">
            <el-select
              v-model="temp.resourceId"
              class="filter-item"
              placeholder="请选择"
              @change="filter"
            >
              <el-option v-for="item in listSource" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-row type="flex" class="row-bg" justify="center" style="margin-bottom: 20px">
            <XcomTagTransfer
              ref="transfer"
              v-model="tempValue"
              :props="{
                key: 'id',
                label: 'title'
              }"
              :data="temp.tablesList"
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

          <el-row type="flex" justify="end">
            <el-button type="primary" @click="handleAdd">加入已选</el-button>
          </el-row>

          <el-form-item label="*已选全部数据表：">

            <el-table
              ref="singleTable"
              :data="temp.tables || []"
              highlight-current-row
              style="width: 100%"
              @current-change="handleCurrentChange"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
              />
              <el-table-column
                property="isMain"
                label="主表"
              >
                <template slot-scope="scope">
                  <el-radio v-model="temp.mainTable" :label="scope.row"><i /></el-radio>
                </template>
              </el-table-column>

              <el-table-column
                property="sourceId"
                label="数据源"
                width="120"
              />
              <el-table-column
                property="title"
                label="数据表名"
                width="120"
              />
              <el-table-column
                label="操作"
              >
                <template slot-scope="{row}">
                  <el-button size="mini" type="danger" @click="handleTableDelete(row,'deleted')">
                    删除
                  </el-button>
                </template>
              </el-table-column>

            </el-table>

          </el-form-item>

          <el-form-item label="选择标签" prop="tag">
            <el-select v-model="temp.tagId" class="filter-item" placeholder="请选择">
              <el-option v-for="item in listLabel" :key="item.id" :label="item.title" :value="item.id" />
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
                    v-for="item in mainOptions"
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
              width="200"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.operation1" :disabled="options.length===0" placeholder="请选择" style="width: 100px">
                  <el-option
                    v-for="item in ruleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>            <el-table-column
              prop="name"
              label="选择数据项"
              width="300"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.item2.tableName" :disabled="options.length===0" placeholder="请选择" style="width:50%">
                  <el-option
                    label="常量"
                    value="-2"
                  />
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
                <el-input v-model="row.valueColumnPath" placeholder="请输入内容" style="width:45%" />
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
import { fetchList, channelDetail, searchList, createSource, update, dele } from '@/api/businessChannel'
import { fetchLabel } from '@/api/category'
import { fetchSourceList, fetchSource } from '@/api/source'
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
      mainOptions: [],
      options: [],
      options2: [],
      value: '',
      keyword: '',
      tablesList: [],
      tableKey: 0,
      listLabel: [],
      listSource: [],
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
        pushType: 'business',
        tagId: '',
        tag: '',
        title: '',
        tables: [],
        tablesList: []
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
    this.getSourceList()
    this.getLabel()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleAdd() {
      console.log(this.temp.tables)
      this.$refs.transfer.targetData.forEach(item => {
        const v = this.temp.tables.find(item2 => item2.id === item.id)
        if (!v) {
          this.temp.tables.push(item)
        }
      })
    },
    nextStep() {
      let v = false
      this.$refs['dataForm'].validate((valid) => {
        v = valid
      })

      if (!v) return

      // console.log(v)
      this.options = []
      if (!this.temp.tagId) {
        this.$notify({
          title: '错误',
          message: '请选择标签',
          type: 'error',
          duration: 2000
        })
        return
      }

      // console.log(this.temp.mainTable)
      if (this.temp.mainTable) {
        this.temp.mainResourceId = this.temp.mainTable.sourceId
        this.mainOptions = this.temp.mainTable.smColumns
        this.temp.tables.forEach((item) => {
          if (this.temp.mainTable.sourceId !== item.sourceId) {
            this.options = this.options.concat(item.smColumns)
          }
        })

        this.temp.tag = this.listLabel.find(o => o.id === this.temp.tagId).title
        this.step = 'step2'
      } else {
        this.$notify({
          title: '错误',
          message: '请选择主表',
          type: 'error',
          duration: 2000
        })
      }
    },
    filter() {
      this.getTables()
    },
    handleTableDelete(row) {
      console.log(row)
      const index = this.temp.tables.indexOf(row)
      this.temp.tables.splice(index, 1)
    },
    handleRuleDelete(row) {
      const index = this.temp.rules.indexOf(row)
      this.temp.rules.splice(index, 1)
    },
    handleDialogClose() {
      // console.log('handleDialogClose...')
      this.step = 'step1'
      this.tempValue = []
      // console.log(this.tempValue)
    },
    handleCheckLeft(value, direction) {
    },
    handleCheckRight() {},
    handleChange(value, direction, movedKeys) {},
    getLabel() {
      fetchLabel(this.temp.resourceId).then(response => {
        this.listLabel = response.data.items
      })
    },
    getTables() {
      fetchSource(this.temp.resourceId).then(response => {
        this.temp.tablesList = response.data.paths
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
    getSourceList() {
      fetchSourceList().then(response => {
        this.listSource = response.data.items
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
        pushType: 'business',
        category: 'API',
        title: '',
        tablesList: [],
        tables: [],
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
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      channelDetail({ id: row.id }).then((res) => {
        Object.keys(res.data).forEach(item => {
          this.temp[item] = res.data[item]
        })

        this.temp.id = res.data.id
        this.temp.resourceId = this.temp.resourceId || 1
        this.temp.rules = this.temp.rules || []
        this.temp.tables.forEach(item => {
          if (item.id === this.temp.mainResourceId) {
            this.temp.mainTable = item
          }
        })

        this.getTables()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
          this.temp.resourceTitle = this.listSource.find(o => o.id === this.temp.resourceId).title
          this.temp.status = 'enabled'

          this.temp.tablesList.forEach(item => {
            item.resourceId = item.id
            item.resourceTitle = item.title
          })

          this.temp.bookTables = this.temp.tables
          this.temp.bookTables.forEach(item => {

          })

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

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)

          tempData.tablesList.forEach(item => {
            item.resourceId = item.id
            item.resourceTitle = item.title
          })
          update(tempData).then(() => {
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
      dele({ id: row.id }).then(response => {
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

<style lang="scss">
.bcdialog{
  .el-dialog__body{
    max-height: 700px;
    overflow: auto;
  }
}
</style>
