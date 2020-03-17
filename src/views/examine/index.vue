<template>
  <div class="container">

    <el-select
      v-model="list.listQuery.filter"
      @change="filter"
    >
      <el-option label="全部" value="all" />
      <el-option label="已审批" value="approved" />
      <el-option label="待审批" value="unsolved" />
    </el-select>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list.data"
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
      <el-table-column label="审批状态" prop="title" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="channelTag" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleView(row)">
            查看
          </el-button>
          <el-button :disabled="row.status==='examine_pass'" type="primary" size="mini" @click="handleExamine(row)">
            审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="list.total>0"
      :total="list.total"
      :page.sync="list.listQuery.page"
      :limit.sync="list.listQuery.limit"
      hide-on-single-page
      @pagination="getList()"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="750px">

      <el-row class="details">
        <el-col :span="4">内容标题：</el-col><el-col :span="19">   {{ examineDetails.title }}</el-col>
      </el-row>
      <el-row class="details">
        <el-col :span="4">内容分类：</el-col><el-col :span="19">   {{ examineDetails.category }}</el-col>
      </el-row>
      <el-row class="details">
        <el-col :span="4">内容标签：</el-col><el-col :span="19">   {{ examineDetails.tag }}</el-col>
      </el-row>
      <el-row class="details">
        <el-col :span="4">内容正文：</el-col><el-col :span="18" v-html="examineDetails.content" />
      </el-row>
      <el-row class="details">
        <el-col :span="4">创建时间：</el-col><el-col :span="19">   {{ examineDetails.updateTime }}</el-col>
      </el-row>
      <el-row class="details">
        <el-col :span="4">提交人：</el-col><el-col :span="19">     {{ examineDetails.authorName }}</el-col>
      </el-row>
      <el-row class="details">
        <el-col :span="4">审批历史：</el-col><el-col :span="19">   {{ examineDetails.history }}</el-col>

      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button v-if="dialogStatus!=='view'" type="danger" @click="handleAction(false)">
          审批不通过
        </el-button>
        <el-button v-if="dialogStatus!=='view'" type="primary" @click="handleAction('pro_publish')">
          审批通过
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { list, detail, action } from '@/api/examine'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Examine',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        unsolved: '未处理',
        approved: '已审批',
        rejective: '已拒绝'
      }
      return statusMap[status]
    },
    categoryFilter(status) {
      const categoryMap = {
        notice: '公告',
        news: '新闻'
      }
      return categoryMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: {
        data: [],
        total: 0,
        listQuery: {
          filter: 'all',
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        }
      },
      examineDetails: {},
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '审批',
        create: '新建'
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
    filter() {
      this.list.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      list(this.list.listQuery).then(response => {
        this.list.data = response.data.items
        this.list.total = response.data.total
        this.listLoading = false
      })
    },
    handleAction(status) {
      this.listLoading = true
      this.examineDetails.action = status
      const data = {
        id: this.examineDetails.id,
        status: status
      }
      action(data).then(response => {
        this.listLoading = false
        this.dialogFormVisible = false
        this.getList()
      })
    },

    handleView(row) {
      detail({ id: row.id }).then(response => {
        this.examineDetails = response.data
        this.listLoading = false
      })
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
    },
    handleExamine(row) {
      detail({ id: row.id }).then(response => {
        this.examineDetails = response.data
        this.listLoading = false
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    }
  }

}
</script>

<style lang="scss" scoped>
  .details{
    .el-col{
      line-height: 30px;
      display: block;
    }
    .el-col-4{
      text-align: right;
      padding-right: 10px;
    }
    .text{
    }
  }
</style>
