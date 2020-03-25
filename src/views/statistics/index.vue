<template>
  <div class="container">

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list_bc.data"
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
      <el-table-column label="推送名称" prop="title" align="center">
        <template slot-scope="{row}">
          <span>{{ row.channelTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="channelTag" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.channelLabel }}</span>1
        </template>
      </el-table-column>
      <el-table-column label="表格数量" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.channelTableNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.channelAuthor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.channelOrigin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送匹配" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.channelMappingNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送状态" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.channelPushStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送成功" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.channelSuccessNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送失败" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.channelFailNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送确认" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.feedback === null ? '0': row.feedback }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近推送" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.channelListTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="handleView(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="list_bc.total>0"
      :total="list_bc.total"
      :page.sync="list_bc.listQuery.page"
      :limit.sync="list_bc.listQuery.limit"
      hide-on-single-page
      @pagination="getBusinessChannelList()"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1200px">

      <el-table
        v-loading="listLoading"
        :data="detailList.data"
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
        <el-table-column label="频道消息" prop="title" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sendData.SendTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送时间" prop="channelTag" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="推送人数" prop="channelTag" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.sendNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="阅读确认" prop="channelTag" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.readerNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row}">

            <!--            <el-button type="text" size="mini" @click="handleDetailView(row)">
              查看
            </el-button>-->

            <el-button size="mini" type="text" icon="el-icon-document" @click="handleDownload(row)">
              导出
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="detailList.total>0"
        :total="detailList.total"
        :page.sync="detailList.listQuery.page"
        :limit.sync="detailList.listQuery.limit"
        hide-on-single-page
        @pagination="getDetail()"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { businessChannelList, contentList, pipeList, detail, download } from '@/api/statistics'
import { parseTime } from '@/utils'
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
      list: null,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      downloadLoading: false,
      toTab: 'first',
      tableKey: 0,
      list_bc: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          group: 'default'
        }
      },
      list_c: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          group: 'default'
        }
      },
      list_p: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          group: 'default'
        }
      },
      detailList: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          channelId: 0,
          sort: '+id',
          group: 'default'
        }
      },
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '编辑',
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
    this.getBusinessChannelList()
  },
  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleDownload(row) {
      this.downloadLoading = true
      download(row).then(response => {
        console.log(response.data.items)
        import('@/vendor/Export2Excel').then(excel => {
          const keys = Object.keys(response.data.items[0])
          const tHeader = keys
          const data = this.formatJson(keys, response.data.items)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },

    getPipeList() {
      this.listLoading = true
      pipeList(this.list_p.listQuery).then(response => {
        this.list_p.data = response.data.items
        this.list_p.total = response.data.total
        this.listLoading = false
      })
    },
    getContentList() {
      this.listLoading = true
      contentList(this.list_c.listQuery).then(response => {
        this.list_c.data = response.data.items
        this.list_c.total = response.data.total
        this.listLoading = false
      })
    },
    getBusinessChannelList() {
      this.listLoading = true
      businessChannelList(this.list_bc.listQuery).then(response => {
        this.list_bc.data = response.data.items
        this.list_bc.total = response.data.total
        this.listLoading = false
      })
    },

    handleView(row) {
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.detailList.data = []
      console.log('row:', row)
      this.detailList.listQuery.channelId = row.channelId
      this.getDetail()
    },

    getDetail() {
      detail(this.detailList.listQuery).then(res => {
        this.detailList.total = res.data.total
        this.detailList.data = res.data.items
        this.detailList.data.forEach(item => {
          item.sendData = JSON.parse(item.sendData)
          console.log(item.sendData)
        })
      })
    },

    handleDetailView(row) {
      // this.dialogStatus = 'view'
      // this.dialogFormVisible = true
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
