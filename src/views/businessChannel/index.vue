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
      :width="step==='step1'?'900px':'1300px'"
      @closed="handleDialogClose"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px" class="main-form">

        <div v-if="step==='step1'" class="zone-step-1">
          <el-form-item v-if="dialogStatus==='create'" label="输入名称" prop="title">
            <el-input v-model="temp.title" style="width:400px" />
          </el-form-item>

          <el-form-item label="选择数据源" prop="resourceId">
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

          <el-form-item label="已选全部数据表:" prop="mainTable">
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
                property="sourceTitle"
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
                  <el-button size="mini" type="text" @click="handleTableDelete(row,'deleted')">
                    删除
                  </el-button>
                </template>
              </el-table-column>

            </el-table>

          </el-form-item>

          <el-form-item label="选择标签" prop="tagId">
            <el-select v-model="temp.tagId" class="filter-item" placeholder="请选择">
              <el-option v-for="item in listLabel" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>

        <div v-if="step==='step2'" class="zone-step-2">
          <p>名称： <span>{{ temp.title }}</span></p>
          <p>数据表： <span>{{ temp.tables.length }}</span></p>
          <p>标签： <span>{{ temp.tag }}</span></p>
          <p>频道规则：</p>
          <RulesSel :rules="temp.rules" :main-options="mainOptions" :options="options" />

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
import XcomTagTransfer from '@/components/tagTransfer/index'

export default {
  name: 'BusinessChannel',
  components: { Pagination, XcomTagTransfer, RulesSel, Templates },
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
      searchKey: '',
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
        // pushType: 'business',
        tagId: '',
        tag: '',
        title: '',
        mainTable: {},
        tables: [],
        tablesList: []
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
  async created() {
    await this.getList()
    await this.getSourceList()
    this.getLabel()

    console.log('created..')
    if (this.$route.params.edit) {
      console.log(this.listArr.data)
      console.log(this.$route.params.edit)
      const row = this.listArr.data.find(item => item.id === this.$route.params.edit)
      this.handleUpdate(row)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleAdd() {
      console.log(this.temp.tables)
      console.log(this.$refs.transfer.targetData)
      this.$refs.transfer.targetData.forEach(item => {
        const v = this.temp.tables.find(item2 => item2.id === item.id) // 排重
        if (!v) {
          this.temp.tables.push(item)
        }
      })
    },
    nextStep() {
      console.log('nextStep...')
      console.log(this.temp.mainTable)

      let v = false
      this.$refs['dataForm'].validate((valid) => {
        v = valid
      })
      if (!v) return

      // console.log(v)
      this.options = []

      // console.log(this.temp.mainTable)
      if (this.temp.mainTable) {
        this.temp.mainResourceId = this.temp.mainTable.id
        this.mainOptions = this.temp.mainTable.smColumns

        console.log('this.temp.tables:', this.temp.tables)
        console.log('this.temp.mainTable:', this.temp.mainTable)
        this.temp.tables.forEach((item) => {
          console.log(this.temp.mainTable.sourceId)
          console.log(item.sourceId)
          if (this.temp.mainTable.id !== item.id) {
            this.options = this.options.concat(item.smColumns)
          }
        })

        this.temp.tag = this.listLabel.find(o => o.id === this.temp.tagId).title
        this.step = 'step2'
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
        console.log(this.listArr.data)
      })
    },
    async getSourceList() {
      await fetchSourceList().then(response => {
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
        // pushType: 'business',
        category: 'API',
        title: '',
        tablesList: [],
        mainTable: {},
        tables: [],
        transferStatus: [],
        rules: []

      }
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
      channelDetail({ id: row.id }).then((res) => {
        Object.keys(res.data).forEach(item => {
          this.temp[item] = res.data[item]
        })

        console.log(this.temp)
        console.log(this.temp.mainTable)

        this.temp.id = res.data.id
        this.temp.resourceId = this.temp.resourceId || 1
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
      console.log(this.temp.rules)
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
    max-height: 700px;
    overflow: auto;
  }
}
</style>
