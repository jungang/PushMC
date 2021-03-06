<template>
  <div class="container">
    <el-row style="margin-bottom: 10px">
      <el-col :span="16" style="line-height: 40px;">
        用户角色列表：
      </el-col>
      <el-col :span="8" align="right">
        <el-button type="primary" @click="handleCreate">+添加角色</el-button>
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
        <el-table-column label="ID" prop="id" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="type" align="center">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="角色分配" prop="type" show-overflow-tooltip min-width="200" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roster.join(', ') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button :disabled="row.status==='pushed'" type="text" size="mini" @click="handleUpdate(row)">
              管理成员
            </el-button>
            <el-button type="text" size="mini" @click="handlePermis(row)">
              编辑权限
            </el-button>
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="'删除 '+row.title + '?'"
              @onConfirm="handleDelete(row,'deleted')"
            />

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
      :class="'form'"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item label="角色名称" prop="title">
          <el-input v-model="temp.title" :readonly="dialogStatus==='view'" :placeholder="'输入角色名称'" style="width: 90%" />
        </el-form-item>

        <PickPersons ref="pickPersons" :data.sync="temp.persons" :tunnel="temp.tunnelId" />

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ dialogStatus==='view'? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="dialogStatus==='update'" :loading="listLoading" type="primary" @click="updateData()">
          完成
        </el-button>
        <el-button v-if="dialogStatus==='create'" :loading="listLoading" type="primary" @click="createData()">
          完成
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="权限管理"
      :visible.sync="permisFormVisible"
      destroy-on-close
      :class="'form'"
      @open="handleDialogOpened"
    >

      <el-form ref="dataForm" :model="permisTemp" label-position="right" label-width="100px" class="main-form">
        <el-checkbox-group v-model="checkedPermissions">
          <el-checkbox
            v-for="item in permissionsTree"
            :key="item.id"
            :label="item.id"
            border
            :disabled="dialogStatus==='view'"
            class="permission"
          >{{ item.title }}({{ item.type }})</el-checkbox>
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
        <el-button @click="permisFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="permisData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { create, allPermission, dele, fetchList, updatePermis } from '@/api/permission'
import Pagination from '@/components/Pagination'
import PickPersons from '@/components/pickPersons'

export default {
  name: 'User',
  components: { Pagination, PickPersons },
  data() {
    return {
      checkedPermissions: [],
      permissionsTree: [],
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
      permisTemp: {
        smPermissions: [],
        id: undefined,
        title: ''
      },
      temp: {
        id: undefined,
        title: '',
        tunnelId: 1
      },
      rules: {
        title: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      permisFormVisible: false,
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
    getAllPermissions() {
      this.listLoading = true
      allPermission().then(response => {
        this.permissionsTree = response.data.items
        /*        this.permissionsTree = [
          {
            'id': 11,
            'title': '数据源',
            'type': 'menu'
          },
          {
            'id': 12,
            'title': '标签分类',
            'type': 'menu'
          },
          {
            'id': 13,
            'title': '标注',
            'type': 'menu'
          },
          {
            'id': 14,
            'title': '推送频道',
            'type': 'menu'
          },
          {
            'id': 15,
            'title': '推送通道',
            'type': 'menu'
          },
          {
            'id': 16,
            'title': '推送对象',
            'type': 'menu'
          },
          {
            'id': 17,
            'title': '消息推送',
            'type': 'menu'
          },
          {
            'id': 21,
            'title': '推送内容',
            'type': 'menu'
          },
          {
            'id': 22,
            'title': '内容审批',
            'type': 'menu'
          },
          {
            'id': 31,
            'title': '用户权限',
            'type': 'menu'
          },
          {
            'id': 32,
            'title': '推送统计',
            'type': 'menu'
          },
          {
            'id': 101,
            'title': '新建数据源',
            'type': 'act'
          },
          {
            'id': 102,
            'title': 'GoCom组织',
            'type': 'act'
          },
          {
            'id': 103,
            'title': '推送审核',
            'type': 'act'
          },
          {
            'id': 104,
            'title': '新建业务频道',
            'type': 'act'
          },
          {
            'id': 105,
            'title': '消息模版',
            'type': 'act'
          },
          {
            'id': 106,
            'title': '创建标签',
            'type': 'act'
          },
          {
            'id': 107,
            'title': '创建分类',
            'type': 'act'
          },
          {
            'id': 108,
            'title': '渠道推送',
            'type': 'act'
          },
          {
            'id': 109,
            'title': '新建推送通道',
            'type': 'act'
          },
          {
            'id': 110,
            'title': '推送内容',
            'type': 'act'
          }
        ]*/
        console.log(this.permissionsTree)
        this.listLoading = false
      })
    },
    handleCheckedPermisChange() {
      console.log('handleCheckedPermisChange...')
    },
    handleCheckedCitiesChange(value) {
      // console.log(value)
    },
    handleDialogOpened() {
      this.permisTemp.smPermissions = this.permisTemp.smPermissions || []
      this.checkedPermissions = this.permisTemp.smPermissions.map(item => item.id)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listArr.listQuery).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listArr.data.forEach(item => {
          console.log(item.persons)
          item.persons = item.persons || []
          item.tunnelId = item.tunnelId || 1
          item.roster = []
          item.persons.forEach(p => {
            item.roster.push(p.name)
          })
          // console.log(item)
        })
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        tunnelId: 1,
        persons: []
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
          this.temp.persons = this.$refs.pickPersons.dynamicTags
          this.temp.tunnelId = this.$refs.pickPersons.personsArr.tunnelId
          this.temp.smPermissions = []

          // todo

          /*       const data = [{
            roles: [this.temp],
            userId: -1
          }]*/

          delete this.temp.smPermissions
          console.log(this.temp)
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

    handlePermis(row) {
      this.permisTemp = Object.assign({}, row) // copy obj
      this.permisFormVisible = true
    },
    permisData() {
      // console.log('permisData...')
      this.permisTemp.smPermissions = []
      console.log(this.checkedPermissions)
      this.checkedPermissions.forEach(item => {
        // console.log(item)
        this.permissionsTree.forEach(item2 => {
          if (item2.id === item) {
            this.permisTemp.smPermissions.push(item2)
          }
        })
      })

      delete this.permisTemp.persons
      updatePermis(this.permisTemp).then(() => {
        this.getList()
        this.permisFormVisible = false
        this.$notify({
          title: '完成',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
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
          if (!this.temp.persons.length) {
            this.$notify.error({
              title: '错误',
              message: '未添加人员'
            })
            return
          }

          this.temp.persons = this.$refs.pickPersons.dynamicTags
          const tempData = Object.assign({}, this.temp)
          this.listLoading = true

          delete tempData.smPermissions
          console.log(tempData)

          updatePermis(tempData).then(() => {
            this.getList()
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
      dele({ roleId: row.id }).then(response => {
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
