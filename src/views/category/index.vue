<template>
  <div class="container">
    <el-row type="flex" justify="end" style="margin-bottom: 10px">
      <el-button type="primary" style="margin-right: 10px" @click="handleCreateCategory">添加分类</el-button>
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
        hide-on-single-page
        @pagination="getList()"
      />
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item label="输入标签名" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>

        <el-form-item label="选择分类" prop="categoryId">
          <el-select v-model="temp.categoryId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in categoryArr" :key="item.id" :label="item.title" :value="item.id" />
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
import { fetchList, createTag, saveCategory, fetchCategory, updateTag, dele } from '@/api/category'
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
      categoryArr: [],
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
        amount: 0,
        category: '',
        id: 0,
        origin: 'CUSTOM',
        categoryId: '',
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
        categoryId: [
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
    getCategory() {
      fetchCategory().then(response => {
        this.categoryArr = response.data.items
      })
    },
    handleFilter() {
      this.listArr.listQuery.page = 1
      this.getList()
    },

    resetTemp() {
      this.temp = {
        amount: 0,
        category: '',
        id: 0,
        origin: 'CUSTOM',
        categoryId: '',
        title: ''
      }
    },
    handleCreateCategory() {
      this.temp.title = ''
      this.dialogStatus = 'create'
      this.dialogCategoryVisible = true
    },

    handleCreateTag() {
      this.getCategory()

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
          console.log(this.temp)
          console.log(this.categoryArr)
          this.temp.category = this.categoryArr.find(item => {
            if (item.id === this.temp.categoryId) {
              return item
            }
          }
          ).title

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
      saveCategory({ title: this.temp.title }).then(() => {
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
      this.getCategory()
      this.temp = Object.assign({}, row) // copy obj
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

          tempData.origin = 'CUSTOM'
          tempData.amount = 0
          tempData.category = this.listArr.data.find(item => {
            if (item.id === tempData.categoryId) {
              return item
            }
          }
          ).title

          updateTag(tempData).then(() => {
            this.getList()
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
