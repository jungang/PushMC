<template>
  <div class="container">
    <el-row>
      数据源列表
    </el-row>
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="handleCreate">新建数据源</el-button>
    </el-row>
    <el-tabs type="border-card" value="business" @tab-click="handleTabClick">
      <el-tab-pane label="业务数据源" name="business">
        <el-table
          :key="businessTableKey"
          v-loading="listLoading"
          :data="listArr['business'].data"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id', 'business')" min-width="50">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type" align="center" min-width="50">
            <template slot-scope="{row}">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" class-name="status-col" min-width="50">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">
                {{ row.status === 'enabled' ? '启用': '未启用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="数据源名称" min-width="100">
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
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button v-if="row.status!='enabled'" type="success" size="mini" @click="handleModifyStatus(row,'enabled')">
                启用
              </el-button>
              <el-button v-if="row.status==='enabled'" size="mini" @click="handleModifyStatus(row,'disabled')">
                停用
              </el-button>
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="listArr['business'].total>0"
          :total="listArr['business'].total"
          :page.sync="listArr['business'].listQuery.page"
          :limit.sync="listArr['business'].listQuery.limit"
          @pagination="getList('business')"
        />

      </el-tab-pane>
      <el-tab-pane label="渠道数据源" name="channel">

        <el-table
          :key="channelTableKey"
          v-loading="listLoading"
          :data="listArr['channel'].data"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id', 'channel')" min-width="50">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type" align="center" min-width="50">
            <template slot-scope="{row}">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" class-name="status-col" min-width="50">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">
                {{ row.status === 'enabled' ? '启用': '未启用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="数据源名称" min-width="200">
            <template slot-scope="{row}">
              <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
                停用
              </el-button>
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="listArr['channel'].total>0"
          :total="listArr['channel'].total"
          :page.sync="listArr['channel'].listQuery.page"
          :limit.sync="listArr['channel'].listQuery.limit"
          @pagination="getList('channel')"
        />

      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 500px; margin-left:50px;">

        <el-form-item label="数据源" prop="dataSource">
          <el-select v-model="temp.dataSource" class="filter-item" placeholder="请选择">
            <el-option v-for="item in MODEL.dataSourceTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="数据源名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>

        <el-form-item label="Secret Key" prop="secretKey">
          <el-input v-model="temp.secretKey" />
        </el-form-item>

        <el-form-item label="服务器地址" prop="serverAddress">
          <el-input v-model="temp.serverAddress" placeholder="多个IP间以逗号分隔" />
        </el-form-item>

        <el-form-item label="定时更新" prop="updatePlan">
          <el-select v-model="temp.updatePlanHours" class="filter-item" placeholder="请选择" style="width:150px;">
            <el-option v-for="item in MODEL.updatePlanOptions.hour" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-select v-model="temp.updatePlanTimes" class="filter-item" placeholder="请选择" style="width:100px;">
            <el-option v-for="item in MODEL.updatePlanOptions.times" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="添加路径" prop="paths">

          <el-form-item
            v-for="(path, index) in temp.paths"
            :key="path.key"
            :prop="'paths.' + index + '.value'"
            :rules="{
              required: true, message: '路径不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="path.value" placeholder="输入路径地址" class="dy_path">
              <template slot="prepend">路径 {{ index }}</template>
              <el-button slot="append" icon="el-icon-delete" @click.prevent="removePath(path)" />
            </el-input>

            <el-row>

              <el-input
                v-for="(arg, index) in path.args"
                v-model="arg.value"
                :prop="'args.' + index + '.value'"
                placeholder="参数"
                size="mini"
                class="dy_arg"
              >
                <el-button slot="append" icon="el-icon-delete" @click.prevent="removeArg( path.args, index)"/>
              </el-input>
            </el-row>
            <el-button size="mini" @click="addArg(path)">+添加参数</el-button>

          </el-form-item>

          <el-button @click="addPath">+添加路径</el-button>
        </el-form-item>

        <el-form-item label="说明">
          <el-input
            v-model="temp.introduce"
            :autosize="{ minRows: 4, maxRows: 10}"
            type="textarea"
            maxlength="30"
            show-word-limit
            placeholder="200字"
          />
        </el-form-item>

        </el-form-item></el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const DataSourceModel = {
  dataSourceTypeOptions: [
    { key: 'api', display_name: 'API' },
    { key: 'api2', display_name: 'API_2' },
    { key: 'api3', display_name: 'API_3' },
    { key: 'api4', display_name: 'API_4' }
  ],
  updatePlanOptions:
    {
      hour: [
        { key: '1', display_name: '1小时' },
        { key: '2', display_name: '2小时' },
        { key: '3', display_name: '3小时' },
        { key: '8', display_name: '8小时' }
      ],
      times: [
        { key: '1', display_name: '1' },
        { key: '2', display_name: '2' },
        { key: '3', display_name: '3' },
        { key: '8', display_name: '8' }
      ]
    }
}

// arr to obj, such as { CN : "China", US : "USA" }
const dataSourceTypeKeyValue = DataSourceModel.dataSourceTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        enabled: 'success',
        disabled: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return dataSourceTypeKeyValue[type]
    }
  },
  data() {
    return {
      businessTableKey: 0,
      channelTableKey: 0,
      currentTab: 'business',
      listArr: {
        business: {
          data: [],
          total: 0,
          listQuery: {
            sheet: 'business',
            page: 1,
            limit: 20,
            importance: undefined,
            title: undefined,
            type: undefined,
            sort: '+id'
          }
        },
        channel: {
          data: [],
          total: 0,
          listQuery: {
            sheet: 'channel',
            page: 1,
            limit: 20,
            importance: undefined,
            title: undefined,
            type: undefined,
            sort: '+id'
          }
        }
      },
      total: 0,
      listLoading: true,
      importanceOptions: [1, 2, 3],
      MODEL: DataSourceModel,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        dataSource: '',
        updatePlanHours: '',
        updatePlanTimes: '',
        introduce: '',
        title: '',
        serverAddress: '',
        secretKey: '1111',
        paths: [{
          value: ''
        }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.getList('business')
    this.getList('channel')
  },
  methods: {
    handleTabClick(tab, event) {
      this.currentTab = tab.name
    },
    removePath(item) {
      var index = this.temp.paths.indexOf(item)
      if (index !== -1) {
        this.temp.paths.splice(index, 1)
      }
    },
    removeArg(args, index) {
      console.log(index)
      // var index = this.temp.paths.indexOf(item)
      if (index !== -1) {
        args.splice(index, 1)
      }
    },
    addPath() {
      this.temp.paths.push({
        value: '',
        key: Date.now(),
        args: [
          { value: '',
            key: Date.now()
          }
        ]
      })
      console.log(this.temp)
    },
    addArg(path) {
      console.log(path)
      path.args.push({ value: '',
        key: Date.now()
      })
    },
    getList(sheetStr) {
      this.listLoading = true
      fetchList(this.listArr[sheetStr].listQuery).then(response => {
        // this.list = response.data.items
        this.listArr[sheetStr].data = response.data.items
        // this.total = response.data.total
        this.listArr[sheetStr].total = response.data.total
        // console.log(this.listArr)
        // Just to simulate the time of the request
        // setTimeout(() => {
        this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    handleFilter(sheetStr) {
      this.listQuery.page = 1
      this.getList(sheetStr)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(this.currentTab, order)
      }
    },
    sortByID(sheetStr, order) {
      if (order === 'ascending') {
        this.listArr[sheetStr].listQuery.sort = '+id'
      } else {
        this.listArr[sheetStr].listQuery.sort = '-id'
      }
      this.handleFilter(sheetStr)
    },
    resetTemp() {
      console.log('resetTemp...')
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        paths: [{
          value: '',
          key: Date.now(),
          args: [
            { value: '',
              key: Date.now()
            }
          ]
        }]
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
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
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
    },
    getSortClass: function(key, sheetStr) {
      const sort = this.listArr[sheetStr].listQuery.sort
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

  .el-row{
    margin-bottom: 10px;
  }
.el-tabs{
  /*margin: 30px;*/

}
  .dy_path{
    margin-bottom: 10px;
  }
  .dy_arg{
    width: 190px;
    margin-right: 10px;
  }

</style>
