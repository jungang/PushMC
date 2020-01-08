<template>
  <div class="container">
    <el-row type="flex">
      推送对象
    </el-row>
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="handleCreate">+新建</el-button>
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
        <el-table-column label="序号" prop="index" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" min-width="80">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人数" prop="type" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.amount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" min-width="50">
          <template slot-scope="{row}">

            <el-tag v-if="row.status !== 'deleted'" :type="row.status | statusFilter">
              {{ row.status === 'enabled' ? '启用': '未启用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
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
      width="700px"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item label="推送对象" prop="title">
          <el-input v-model="temp.title" placeholder="输入对象组名称" style="width:400px" />
        </el-form-item>

        <el-radio-group v-model="tabTo" style="margin-bottom: 30px;">
          <el-radio-button label="department">按组织结构</el-radio-button>
          <el-radio-button label="personnel">按人员</el-radio-button>
        </el-radio-group>

        <el-tabs v-model="tabTo" type="card">
          <el-tab-pane label="按组织结构" name="department">

            <el-row>
              <el-col :span="12">

                <el-input
                  v-model="filterText"
                  placeholder="输入关键字进行过滤"
                />

                <el-tree
                  ref="tree"
                  :data="departmentData"
                  class="department-tree"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  :filter-node-method="filterNode"
                  highlight-current
                  @check-change="handleCheck"
                />

              </el-col>
              <el-col :span="12" style="padding: 10px">

                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;" />
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
                </el-checkbox-group>

              </el-col>
            </el-row>

          </el-tab-pane>
          <el-tab-pane label="按人员" name="personnel">
            按人员
          </el-tab-pane>
        </el-tabs>

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
import { fetchList, createSource, update, dele } from '@/api/pushTarget'
import { department } from '@/api/common'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { changeStatus } from '@/api/source'

export default {
  name: 'PushChannel',
  components: { Pagination },
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
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: ['上海', '北京', '广州', '深圳'],
      isIndeterminate: true,
      filterText: '',
      departmentData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tabTo: 'department',
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
      temp: {
        id: undefined,
        type: '',
        describe: '',
        title: ''
      },
      dialogFormVisible: false,
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
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  async created() {
    await this.getDepartmentData()
    this.getList()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },

    handleCheck(arg, status, arg3) {
      console.log('handleCheck...')
      console.log(arg, status, arg3)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async getDepartmentData() {
      await department().then(response => {
        this.departmentData = response.data
        console.log(this.departmentData)
        this.listLoading = false
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

    handleModifyStatus(row, status) {
      changeStatus(row.id, status).then(response => {
        this.$message({
          message: '操作完成',
          type: 'success'
        })
        row.status = status

        // 删除行
        /*        if (status === 'deleted') {
          for (const v of this.listArr[this.currentTab].data) {
            if (v.id === row.id) {
              const index = this.listArr[this.currentTab].data.indexOf(v)
              this.listArr[this.currentTab].data.splice(index, 1)
              break
            }
          }
        }*/

        this.listLoading = false
      })
    },
    sortChange(data) {
      console.log(data)
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listArr.listQuery.sort = '+id'
      } else {
        this.listArr.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        category: 'API',
        title: '****'
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
.department-tree{
  height: 300px;
  overflow-y: scroll;
}
</style>
