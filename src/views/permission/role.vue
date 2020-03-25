<template>
  <div class="container">
    <el-row style="margin-bottom: 10px">
      <el-col :span="16" style="line-height: 40px;">
        权限管理：
      </el-col>
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
        <el-table-column label="角色名称" prop="type" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="角色分配" prop="type" width="300" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.member }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="300" width="300" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button :disabled="row.status==='pushed'" type="text" size="mini" @click="handleUpdate(row)">
              编辑权限
            </el-button>
            <el-button type="text" size="mini" @click="handleView(row)">
              查看
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
      :class="'form'"
      @open="handleDialogOpened"
      @closed="handleDialogClose"
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" class="main-form">
        <el-form-item label="角色名称" prop="title"> {{ temp.title }} </el-form-item>

        <el-checkbox-group v-model="checkedPermissions" @change="handleCheckedCitiesChange">
          <el-checkbox
            v-for="item in permissionsTree.items"
            :key="item.id"
            :label="item.id"
            border
            :disabled="dialogStatus==='view'"
            class="permission"
          >{{ item.title }}</el-checkbox>
        </el-checkbox-group>

        <!--        <el-tree
          ref="tree"
          :data="permissionsTree"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        />-->

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ dialogStatus==='view'? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">
          确定
        </el-button>
        <el-button v-if="dialogStatus==='update'" type="primary" @click="updateData()">
          完成
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { create, dele, fetchList, updatePermis, allPermission } from '@/api/permission'
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      checkedPermissions: [],
      permissionsTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
        smPermissions: [],
        id: undefined,
        title: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '编辑',
        create: '新建角色'
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
    this.getAllPermissions()
  },
  methods: {
    handleCheckedCitiesChange(value) {
      console.log(value)
    },
    handleDialogOpened() {
      this.temp.smPermissions = this.temp.smPermissions || []
      this.checkedPermissions = this.temp.smPermissions.map(item => item.id)
    },
    handleDialogClose() {
      // this.$refs.tree.setCheckedKeys([])
    },
    setCheckedKeys() {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.temp.permissions)
      } else {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.temp.permissions)
        })
      }
    },
    getAllPermissions() {
      this.listLoading = true
      allPermission().then(response => {
        this.permissionsTree = response.data
        console.log(this.permissionsTree.items)
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
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        smPermissions: [],
        permissions: []
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
          create(this.temp).then(() => {
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

    handleView(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleUpdate(row, opt) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = opt || 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.smPermissions = []
          console.log(this.checkedPermissions)
          this.checkedPermissions.forEach(item => {
            console.log(item)
            this.permissionsTree.items.forEach(item2 => {
              if (item2.id === item) {
                this.temp.smPermissions.push(item2)
              }
            })
          })

          const tempData = Object.assign({}, this.temp)
          updatePermis(tempData).then(() => {
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
    }
  }

}
</script>

<style lang="scss">
.permission {
  margin:2px !important;
width: 250px;
}

</style>
