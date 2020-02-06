<template>
  <div class="container">
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="handleCreateCategory">添加分类</el-button>
      <el-button type="primary" @click="handleCreateTag">添加标签</el-button>
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
        <el-table-column label="标签名称" prop="type" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签来源" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.origin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签使用" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.creationTime }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item v-if="dialogStatus==='create'" label="输入标签名" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>

        <el-form-item label="选择分类" prop="category">
          <el-select v-model="temp.category" class="filter-item" placeholder="请选择">
            <el-option v-for="item in MODEL.tagCategory" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCategoryVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px" class="main-form">
        <el-form-item v-if="dialogStatus==='create'" label="输入分类名称" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCategoryVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createCategory()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, createTag, saveCategory, updateTag, dele } from '@/api/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

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
    }
  },
  data() {
    return {
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
      dialogCategoryVisible: false,
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
      this.temp = {
        id: undefined,
        category: '',
        title: '****'
      }
    },
    handleCreateCategory() {
      this.dialogStatus = 'create'
      this.dialogCategoryVisible = true
    },
    handleCreateTag() {
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
          createTag(this.temp).then(() => {
            this.getList()
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
    createCategory() {
      saveCategory(this.temp.title).then(() => {
        this.getList()
        this.dialogCategoryVisible = false
        this.$notify({
          title: '完成',
          message: '新建',
          type: 'success',
          duration: 2000
        })
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
          updateTag(tempData).then(() => {
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
