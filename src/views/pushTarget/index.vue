<template>
  <div id="push_target" class="container">
    <el-row type="flex">
      推送对象
    </el-row>
    <el-row type="flex" justify="end">
      <el-button type="primary" style="margin-bottom: 10px" @click="handleCreate">+新建</el-button>
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
        <el-table-column label="序号" prop="index" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" min-width="80">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人数" prop="type" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.amount }}</span>
          </template>
        </el-table-column>
        <!--
        <el-table-column label="状态" align="center" min-width="50">
          <template slot-scope="{row}">

            <el-tag v-if="row.status !== 'deleted'" :type="row.status | statusFilter">
              {{ row.status === 'enabled' ? '启用': '未启用' }}
            </el-tag>
          </template>
        </el-table-column>-->

        <el-table-column label="创建时间" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <!--            <el-button v-if="row.status!='enabled'" type="success" size="mini" @click="handleModifyStatus(row,'enabled')">
              启用
            </el-button>
            <el-button v-if="row.status==='enabled'" size="mini" @click="handleModifyStatus(row,'disabled')">
              停用
            </el-button>-->
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
      width="700px"
      top="100px"
      @opened="dialogOpened"
      @close="dialogClose"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px" class="main-form">

        <el-form-item label="推送对象组名称：" prop="title">
          <el-input v-model="temp.title" placeholder="输入对象组名称" style="width:400px" />
        </el-form-item>

        <!--       <el-radio-group v-model="tabTo" style="margin-bottom: 30px;">
          <el-radio-button label="department">按组织结构</el-radio-button>
          <el-radio-button label="personnel">按人员</el-radio-button>
        </el-radio-group>-->
        <PickPersons ref="pickPersons" :data.sync="temp.smGroupItems" :tunnel="temp.tunnelId" />

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
import { fetchList, detail, createGroup, update, dele, changeStatus } from '@/api/pushTarget'
import { department, domain, searchPersons } from '@/api/common'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import PickPersons from '@/components/pickPersons'
import { searchList } from '@/api/pushContent'

export default {
  name: 'PushChannel',
  components: { Pagination, PickPersons },
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
      searchKey: '',
      personWord: '',
      dynamicTags: [],
      checkAll: false,
      checkedPerson: [],
      currentRow: {},
      plaza: [],
      treePersons: [],
      isIndeterminate: true,
      filterText: '',
      domainData: [],
      departmentData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tabTo: 'department',
      tableKey: 0,
      tableKey2: 0,
      multipleSelection: [],
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
        tunnelId: 1,
        title: '',
        smGroupItems: []
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
    ]),
    MODEL: function() {
      return this.$store.state.publicData.model
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  async created() {
    // await this.getDepartmentData()
    this.getList()
  },
  methods: {
    handleSearch() {
      this.listLoading = true
      this.listArr.listQuery.page = 1
      searchList(this.searchKey).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('handleSelectionChange...')
    },

    addPersons() {
      this.dynamicTags = this.dynamicTags.concat(this.plaza)
      this.dynamicTags = this.dynamicTags.concat(this.multipleSelection)

      this.dynamicTags = Array.from(new Set(this.dynamicTags)) // 去重
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    resetChecked() {
    },
    dialogOpened() {
    },
    getPersonsList() {
      searchPersons(this.personsArr.listQuery).then(res => {
        console.log('..................................!!!!!')
        // console.log(res)
        this.personsArr.items = res.data.items
        this.personsArr.total = res.data.total
        this.listLoading = false
      })
    },

    dialogClose() {
      this.plaza = []
      this.tabTo = 'department'
      // this.$refs.tree.setCheckedKeys([])
    },

    handleCheckAllChange(val) {
      this.checkedPerson = val ? this.plaza : []
      this.isIndeterminate = false
    },
    handlecheckedPersonChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.plaza.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.plaza.length
    },

    handleChangeCheck(arg, status, arg3) {
      console.log('handleChangeCheck...')
      this.treePersons = []
    },

    handleCheck(status, nodes) {
      nodes.checkedNodes.forEach((item) => {
        item.smGroupItems.forEach((person) => {
          // console.log(person)
          this.treePersons.push(person)
          // this.temp.treePersons.push(person)
        })
      })
      console.log(this.plaza.length)
      this.plaza = this.treePersons
      this.checkedPerson = this.treePersons
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async getDepartmentData() {
      await domain({ domain: 'gocom' }).then(response => {
        this.domainData = response.data.items
      })
      await department({ domain: 'xykj' }).then(response => {
        this.departmentData = response.data
        // console.log(this.departmentData)
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
        this.listLoading = false
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        tunnelId: 1,
        category: 'API',
        title: '',
        smGroupItems: []
      }
      this.dynamicTags = []
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
          // this.temp.smGroupItems = this.dynamicTags
          this.temp.smGroupItems = this.$refs.pickPersons.dynamicTags
          this.temp.status = 'enabled'

          this.temp.tunnelId = this.$refs.pickPersons.personsArr.tunnelId
          this.temp.smGroupItems.forEach(item => {
            item.type = item.type || '1'
            item.itemId = item.itemId || item.userid
            item.itemName = item.itemName || item.truename
          })

          createGroup(this.temp).then(() => {
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

    handleUpdate(row) {
      detail({ id: row.id }).then((res) => {
        this.temp = res.data
        this.treePersons = []
        this.currentRow = row
        this.dynamicTags = [...row.smGroupItems]
        this.checkAll = true
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },

    updateData() {
      // this.temp.smGroupItems = this.dynamicTags
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.smGroupItems = this.$refs.pickPersons.dynamicTags

          this.temp.smGroupItems.forEach(item => {
            item.type = item.type || '1'
            item.itemId = item.itemId || item.userid
            item.itemName = item.itemName || item.truename

            console.log(item)
          })

          const tempData = Object.assign({}, this.temp)
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
  .checkZone{
    >label{
      margin-left: 10px;
    }
    .el-checkbox-group{
      padding: 10px;
      height: 300px;
      overflow-y: scroll;
    }
  }
</style>

<style lang="scss">
  #push_target{
/*    .el-tabs__header{
      display: none;
    }*/
  }
</style>
