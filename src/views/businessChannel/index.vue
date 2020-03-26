<template>
  <div class="container">
    <el-row type="flex">
      业务频道
    </el-row>

    <el-row>
      <div style="margin-top: 15px;">
        <el-input v-model="listArr.listQuery.searchKey" placeholder="输入关键字，例如：涉黄" clearable style="width: 400px" />
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
        <el-table-column label="ID" prop="id" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务频道名称" prop="type" align="center" min-width="150">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="推送类型" prop="type" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.tag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据表" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.tables === null ? '0' : row.tables.length }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="handleMsgUpdate(row)">
              消息模板
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="text" @click="handleDelete(row,'deleted')">
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
      destroy-on-close
      top="5vh"
      custom-class="bcdialog"
      width="1000px"
      @closed="handleDialogClose"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px" class="main-form">

        <el-row>
          <el-col :span="12">
            <el-form-item label="频道名称" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类标签" prop="tagId">
              <el-select v-model="temp.tagId" class="filter-item" placeholder="请选择">
                <el-option v-for="item in listLabel" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容更新方式">
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="请选择"
            @change="getSourceList"
          >
            <el-option v-for="item in types" :key="item.type" :label="item.title" :value="item.type" />
          </el-select>
        </el-form-item>

        <el-form-item :label="temp.type==='pull'?'主动拉取':'被动接受'">
          <el-table
            ref="singleTable"
            :data="temp.tables || []"
            size="mini"
            style="width: 100%"
            border
            @current-change="handleCurrentChange"
          >
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            />

            <el-table-column label="数据源" align="center">

              <template slot-scope="{row}">
                <el-select
                  v-model="row.sourceId"
                  class="filter-item"
                  placeholder="请选择"
                  size="small"
                  @change="filter(row)"
                >
                  <el-option v-for="item in listSource" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              property="title"
              align="center"
              label="表名"
            >
              <template slot-scope="{row}">
                <el-select
                  v-model="row.id"
                  class="filter-item"
                  placeholder="请选择"
                  size="small"
                  @change="filter2(row)"
                >
                  <el-option v-for="item in row.tablesList" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              v-if="temp.type==='pull'"
              property="isMain"
              label="主表"
              align="center"
              width="70"
            >
              <template slot-scope="{row}">
                <el-radio v-model="temp.mainTable" :label="row"><i /></el-radio>
              </template>
            </el-table-column>

            <el-table-column
              width="70"
              align="center"
              label="操作"
            >
              <template slot-scope="{row}">
                <el-button size="mini" type="text" @click="handleTableDelete(row,'deleted')">
                  删除
                </el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-button v-if="temp.type==='pull'" size="mini" type="primary" @click="addTable">+添加数据表</el-button>

        </el-form-item>

        <el-form-item label="频道规则" prop="type">
          <RulesSel :rules="temp.rules" :main-options="mainOptions" :options="options" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <!--        <el-button v-if="step==='step1'" type="primary" @click="nextStep">
          下一步
        </el-button>
        <el-button v-if="step==='step2'" type="primary" @click="step='step1'">
          上一步
        </el-button>-->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          完成
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="msgFormVisible"
      width="800px"
    >
      <el-form ref="msgForm" :model="temp" label-position="right" label-width="100px" class="main-form">
        <Templates :tmp="temp.tmp" :tables="temp.tables" />
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="msgFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="msgUpdateData()">
          完成
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, channelDetail, createBusinessChannel, update, dele } from '@/api/businessChannel'
import { fetchLabel } from '@/api/category'
import { fetchSourceList, fetchSource } from '@/api/source'
import Pagination from '@/components/Pagination'
import RulesSel from '@/components/RulesSel'
import Templates from '@/components/Templates'

export default {
  name: 'BusinessChannel',
  components: { Pagination, RulesSel, Templates },
  data() {
    return {
      startEdit: false,
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
      searchKey: '',
      tablesList: [],
      tableKey: 0,
      types: [
        {
          title: '主动拉取',
          type: 'pull'
        },
        {
          title: '被动接受',
          type: 'receive'
        }
      ],
      tableData: [],
      listLabel: [],
      listSource: [],
      listArr: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          pushType: 'unknown',
          searchKey: '',
          sort: '+id'
        }
      },
      listLoading: true,
      tempValue: [],
      tempValueMax: 3,
      temp: {
        id: undefined,
        type: 'pull',
        // pushType: 'business',
        tagId: '',
        tag: '',
        title: '',
        mainTable: {
          smColumns: []
        },
        tables: [{}],
        tablesList: [],
        rules: []
      },
      dialogFormVisible: false,
      msgFormVisible: false,
      step: 'step1',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        title: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        mainTable: [
          { required: true, message: '请选择数据表和主表', trigger: 'blur' }
        ],
        tagId: [
          { required: true, message: '请选择标签', trigger: 'blur' }
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
  watch: {
    'temp.mainTable': {
      handler: function(val, oldVal) {
        console.log('---> 2')
        if (!val) return // 保留编辑状态
        if (!oldVal.id) return // 保留编辑状态

        console.log('---> 3')

        this.nextStep()
      }
      // deep: true
    }
  },
  async created() {
    await this.getList()
    await this.getSourceList()
    this.getLabel()

    if (this.$route.params.edit) {
      const row = this.listArr.data.find(item => item.id === this.$route.params.edit)
      this.handleUpdate(row)
    }
  },
  methods: {
    firstView() {
      console.log('firstView...')
      this.temp.tables.forEach(item => {
        if (!item.tablesList) {
          fetchSource(item.sourceId).then(response => {
            this.$set(item, 'tablesList', response.data.paths)
          })
        }
      })
    },
    addTable() {
      this.temp.tables.push({})
      // 默认第一张表为主表
      if (!this.temp.mainTable.id) {
        this.temp.mainTable = this.temp.tables[0]
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleAdd() {
      this.$refs.transfer.targetData.forEach(item => {
        const v = this.temp.tables.find(item2 => item2.id === item.id) // 排重
        if (!v) {
          this.temp.tables.push(item)
        }
      })
    },
    nextStep() {
      console.log('nextStep...')
      if (this.startEdit) {
        this.startEdit = false
      } else {
        this.temp.rules = []
      }
      this.mainOptions = []
      this.options = []

      this.temp.mainResourceId = this.temp.mainTable.id
      this.mainOptions = this.temp.mainTable.smColumns

      this.temp.tables.forEach((item) => {
        if (this.temp.mainTable.id !== item.id) {
          console.log('=============================')
          console.log(item)
          this.options = this.options.concat(item.smColumns)
        }
      })
      console.log('this.mainOptions:', this.mainOptions)
      console.log('this.options:', this.options)
      // console.log('this.rules:', this.rules)

      // console.log('this.temp.mainTable', this.temp.mainTable)
      // console.log('this.temp.mainTable.id', this.temp.mainTable.id)
      // console.log('mainOptions', this.mainOptions)
    },
    typeFilter() {
      console.log('typeFilter...')
      console.log(this.temp.type)
    },
    filter(row) {
      this.$set(row, 'id', '')
      // row.id = ''
      fetchSource(row.sourceId).then(response => {
        this.$set(row, 'tablesList', response.data.paths)
        // row.tablesList = response.data.paths
      })
    },
    filter2(row) {
      row.smColumns = row.tablesList.find(item => item.id === row.id).smColumns
      this.nextStep()
      // console.log('row:', row)
      // console.log('row.id:', row.id)
      // console.log('this.temp.mainTable:', this.temp.mainTable)
      // console.log('this.temp.mainTable.id:', this.temp.mainTable.id)
      // console.log('mainOptions:', this.mainOptions)
    },
    // filter() {
    //   this.getTables()
    // },
    handleTableDelete(row) {
      const index = this.temp.tables.indexOf(row)
      this.temp.tables.splice(index, 1)
    },
    handleRuleDelete(row) {
      const index = this.temp.rules.indexOf(row)
      this.temp.rules.splice(index, 1)
    },
    handleDialogClose() {
      this.tempValue = []
      this.temp.mainTable = {
        smColumns: []
      }
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
      console.log('getTables...')
      fetchSource(this.temp.resourceId).then(response => {
        this.temp.tablesList = response.data.paths
        this.temp.tablesList.forEach(item => {
          item.sourceTitle = response.data.title
        })
      })
    },
    async getList() {
      this.listLoading = true
      fetchList(this.listArr.listQuery).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },

    // 拉去数据源列表
    async getSourceList() {
      this.temp.tables = [{
        smColumns: []
      }]
      this.temp.mainTable = this.temp.tables[0]
      // this.temp.mainTable = this.temp.tables[0]
      // await fetchSourceList({ type: this.temp.type }).then(response => { //类型参数
      await fetchSourceList().then(response => {
        this.listSource = response.data.items
        // this.temp.mainTable = {
        //   smColumns: []
        // }
        this.nextStep()
      })
    },
    handleFilter() {
      this.listArr.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      console.log('resetTemp...')
      this.tempValue = []
      this.temp = {
        id: undefined,
        type: 'pull',
        category: 'API',
        title: '',
        tablesList: [],
        tmp: {},
        mainTable: {
          smColumns: []
        },
        tables: [{
          smColumns: []
        }],
        transferStatus: [],
        rules: [],
        tagId: '',
        tag: ''
      }
      this.temp.mainTable = this.temp.tables[0]
    },
    handleSearch() {
      this.listLoading = true
      this.listArr.listQuery.page = 1

      this.getList()
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
      this.startEdit = true

      channelDetail({ id: row.id }).then((res) => {
      /*  Object.keys(res.data).forEach(item => {
          this.temp[item] = res.data[item]
        })*/

        this.temp = { ...this.temp, ...res.data }
        console.log('channelDetail...')

        this.temp.id = res.data.id
        this.temp.resourceId = this.temp.resourceId || 1
        this.temp.tables.forEach(item => {
          if (item.id === this.temp.mainResourceId) {
            console.log('change mainTable... 1')
            this.temp.mainTable = item
            this.$nextTick(() => {
              console.log('this.temp.rules = res.data.rules')
              this.temp.rules = res.data.rules
            })
          }
        })

        // this.getTables()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.firstView()
        })
      })
    },

    handleMsgUpdate(row) {
      channelDetail({ id: row.id }).then((res) => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.msgFormVisible = true
        this.$nextTick(() => {
          this.$refs['msgForm'].clearValidate()
        })
      })
    },

    handleAddRule() {
      this.temp.rules.push({
        expression: '',
        mainColumnPath: '',
        mainResourceId: this.temp.mainResourceId,
        valueColumnPath: '',
        valueResourceId: ''
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          console.log(this.listSource)
          console.log(this.temp.resourceId)

          console.log(this.temp.mainResourceId)

          this.temp.tag = this.listLabel.find(o => o.id === this.temp.tagId).title
          // this.temp.resourceTitle = this.listSource.find(o => o.id === this.temp.mainResourceId).title
          // this.temp.resourceTitle = this.listSource.find(o => o.id === this.temp.resourceId).title
          this.temp.status = 'enabled'

          this.temp.tablesList.forEach(item => {
            item.resourceId = item.id
            item.resourceTitle = item.title
          })

          this.temp.bookTables = this.temp.tables
          this.temp.bookTables.forEach(item => {

          })

          this.temp.tmp = {
            title: '',
            templateType: 'template',
            content: '',
            arg1: '',
            arg2: '',
            arg3: '',
            arg4: '',
            isURL: false,
            templateURL: ''
          }

          createBusinessChannel(this.temp).then(() => {
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
    msgUpdateData() {
      this.$refs['msgForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)

          update(tempData).then(() => {
            for (const v of this.listArr.data) {
              if (v.id === this.temp.id) {
                const index = this.listArr.data.indexOf(v)
                this.listArr.data.splice(index, 1, this.temp)
                break
              }
            }
            this.msgFormVisible = false
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

      max-height: 80vh;
      overflow: auto;
    }
  }
</style>
