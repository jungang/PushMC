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
        @sort-change="sortChange"
      >
        <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id')" min-width="50">
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
            <span>{{ row.tables.length }}</span>
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
      width="900px"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item v-if="dialogStatus==='create'" label="输入名称" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>

        <el-row type="flex" class="row-bg" justify="center" style="margin-bottom: 20px">
          <XcomTagTransfer
            ref="transfer"
            v-model="tempValue"
            :data="temp.tables"
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
            <el-option v-for="item in MODEL.dataSourceTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          下一步
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@//utils/index.js'
import { fetchList, fetchTables, searchList, createSource, updateSource, dele } from '@/api/businessChannel'
import Pagination from '@/components/Pagination'
import XcomTagTransfer from '@/components/tagTransfer/index'

const DataSourceModel = {
  dataSourceTypeOptions: [
    { key: 'api', display_name: 'API' },
    { key: 'api2', display_name: 'API_2' },
    { key: 'api3', display_name: 'API_3' },
    { key: 'api4', display_name: 'API_4' }
  ]
}

export default {
  name: 'BusinessChannel',
  components: { Pagination, XcomTagTransfer },
  data() {
    return {
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
      MODEL: DataSourceModel,
      tempValue: [],
      tempValueMax: 3,
      temp: {
        id: undefined,
        tag: '',
        title: '',
        tables: []
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
  created() {
    this.getList()
    this.getTables()
  },
  methods: {
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
      this.listLoading = true
      fetchTables().then(response => {
        this.tables = response.data
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
      this.tempValue = []
      this.temp = {
        id: undefined,
        category: 'API',
        title: '****',
        tables: deepClone(this.tables)

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
      console.log(row)
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
