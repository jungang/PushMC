<template>
  <div class="container">

    <el-row style="margin-bottom: 10px">

      <el-col :span="12">
        <el-select
          v-model="listArr.listQuery.type"
          style="margin-bottom: 10px"
          @change="filter"
        >
          <el-option label="全部" value="" />
          <el-option label="API" value="API" />
          <el-option label="webhooks" value="webhooks" />
        </el-select>
      </el-col>
      <el-col :span="12" align="right">

        <el-button type="primary" @click="handleCreate">新建数据源</el-button>
      </el-col>

    </el-row>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listArr.data"
      size="small"
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
      <el-table-column label="类型" prop="type" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标注状态" class-name="status-col" min-width="50" align="center">
        <template slot-scope="{row}">

          {{ row.isLabel ? '已标注': '未标注' }}

        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" align="center" min-width="50">
        <template slot-scope="{row}">

          {{ row.status === 'enabled' ? '启用': '未启用' }}

          <el-tag
            v-if="row.status==='deleted'"
            type="danger"
          >
            已删除
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数据源名称" min-width="100" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源描述" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='enabled'" type="text" size="mini" @click="handleModifyStatus(row,'enabled')">
            启用
          </el-button>
          <el-button v-if="row.status==='enabled'" type="text" size="mini" @click="handleModifyStatus(row,'disabled')">
            停用
          </el-button>
          <el-button type="text" size="mini" @click="handleTag(row)">
            标注
          </el-button>
          <el-button v-if="row.status==='deleted'" size="mini" @click="handleModifyStatus(row,'draft')">
            恢复
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="text" @click="handleDelete(row)">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="900px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-row>
          <el-col :span="12">

            <el-form-item label="名称" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="类型" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
                <el-option v-for="item in MODEL.dataSourceTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="temp.type==='API'" label="地址" prop="serverAddress">
              <el-input v-model="temp.serverAddress" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="temp.type==='API'" label="拉取频率" prop="interval">
              <div>
                <el-input v-model="temp.interval" placeholder="请输入内容" style="width: 200px">
                  <template slot="append">分钟</template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="describe">
          <el-input
            v-model="temp.describe"
            :autosize="{ minRows: 3, maxRows: 10}"
            type="textarea"
            maxlength="2000"
            show-word-limit
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="数据表" prop="paths">

          <DynamicInput :data.sync="temp.paths" :type.sync="temp.type" />

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchSourceList, dele, createSource, updateSource, changeStatus, sourceDetail } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DynamicInput from '@/components/DynamicInput'

export default {
  name: 'ComplexTable',
  components: { Pagination, DynamicInput },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        enabled: 'success',
        disabled: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      listArr: {
        data: [],
        total: 0,
        listQuery: {
          sheet: 'business',
          type: '',
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          sort: '+id'
        }
      },
      total: 0,
      listLoading: true,
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        type: '',
        typeTitle: '',
        updatePlanHours: '',
        updatePlanTimes: '',
        describe: '',
        title: '',
        serverAddress: '',
        secretKey: '1111',
        paths: [{
          title: '',
          value: '{}'
        }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        type: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        title: [
          { required: true, message: '数据源名称不能为空', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        interval: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        serverAddress: [
          { required: true, message: '服务器地址不能为空', trigger: 'blur' }
        ],
        paths: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        /*        secretKey: [
          { required: true, message: 'Secret Key不能为空', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],*/
        /*        serverAddress: [
          { required: true, message: '服务器地址不能为空', trigger: 'blur' },
          { type: 'url', required: true, message: '服务器地址格式不正确', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],*/
        /*     updatePlanHours: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],*/
        // eslint-disable-next-line no-dupe-keys
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      },
      downloadLoading: false
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
    filter() {
      this.listArr.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchSourceList(this.listArr.listQuery).then(response => {
        console.log(response)
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    handleFilter() {
      console.log('handleFilter...')
      this.listArr.listQuery.page = 1

      this.getList()
    },

    handleModifyStatus(row, status) {
      changeStatus(row.id, status).then(response => {
        this.$message({
          message: '操作完成',
          type: 'success'
        })
        row.status = status

        // 删除行
        /*        if (status === 'deleted') {
          for (const v of this.listArr.data) {
            if (v.id === row.id) {
              const index = this.listArr.data.indexOf(v)
              this.listArr.data.splice(index, 1)
              break
            }
          }
        }*/

        this.listLoading = false
      })
    },

    handleDelete(row) {
      dele(row.id).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })

        for (const v of this.listArr.data) {
          if (v.id === row.id) {
            const index = this.listArr.data.indexOf(v)
            this.listArr.data.splice(index, 1)
            break
          }
        }

        this.listLoading = false
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        type: 'API',
        title: '',
        status: 'disabled',
        secretKey: '',
        serverAddress: '',
        updatePlanHours: '4',
        updatePlanTimes: '8',
        paths: [],
        describe: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      console.log(this.MODEL.dataSourceTypeOptions)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = 0 // mock a id
          this.temp.dataSourceTitle = this.temp.title
          this.temp.typeTitle = this.temp.type
          this.temp.dataSource = 'business'

          createSource(this.temp).then(() => {
            console.log('createSource...')
            this.getList()
            // this.listArr.data.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '完成',
              message: '新建',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleTag(row) {
      sourceDetail({ id: row.id }).then(response => {
        this.$router.push({ name: 'Edit', params: response.data })
      })
    },
    handleUpdate(row) {
      sourceDetail({ id: row.id }).then(response => {
        this.temp = response.data
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

          console.log(tempData)

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
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
    overflow-y: scroll;
    padding-right: 30px;
  }
</style>
