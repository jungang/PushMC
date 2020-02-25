<template>
  <div class="container">
    <el-row>
      数据源列表
    </el-row>
    <el-row>
      <el-select
        v-model="listArr.listQuery.filter"
        style="margin: 10px 0;"
        @change="filter"
      >
        <el-option label="全部" value="all" />
        <el-option
          v-for="item in MODEL.dataSourceTypeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />

      </el-select>
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
      <el-table-column label="标注状态" class-name="status-col" min-width="50">
        <template slot-scope="{row}">

          {{ row.isLabel ? '已标注': '未标注' }}

        </template>
      </el-table-column>
      <el-table-column label="数据源名称">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据表" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.paths.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            标注
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

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchSourceList, detail } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'List',
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
          sheet: 'business',
          filter: 'all',
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
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
        updatePlanHours: '',
        updatePlanTimes: '',
        describe: '',
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
      rules: {
        type: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        title: [
          { required: true, message: '数据源名称不能为空', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '说明不能为空', trigger: 'blur' },
          { min: 4, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: 'Secret Key不能为空', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        serverAddress: [
          { required: true, message: '服务器地址不能为空', trigger: 'blur' },
          { type: 'url', required: true, message: '服务器地址格式不正确', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        updatePlanHours: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
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
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      console.log('handleFilter...')
      this.listArr.listQuery.page = 1

      this.getList()
    },
    handleUpdate(row) {
      detail({ id: row.id }).then(response => {
        this.$router.push({ name: 'Edit', params: response.data })
      })
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
  }
</style>
