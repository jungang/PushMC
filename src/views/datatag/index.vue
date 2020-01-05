<template>
  <div class="container">
    <el-tabs type="border-card" value="business" @tab-click="handleTabClick">
      <el-tab-pane label="业务数据" name="business">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-table
              ref="singleTable"
              :key="businessTableKey"
              v-loading="listLoading"
              :data="listArr[currentTab].data"
              highlight-current-row
              style="width: 100%"
              @current-change="handleCurrentChange"
            >
              <el-table-column
                property="title"
                label="数据表列表"
              />
            </el-table>
            <pagination
              small
              layout="prev, pager, next"
              :total="listArr[currentTab].total"
              @pagination="getList(currentTab)"
            />
          </el-col>
          <el-col :span="18">
            <div v-if="listArr.business.transfer.length > 0" style="text-align: center">
              <XcomTagTransfer
                ref="transfer"
                v-model="value"
                type="dataTag"
                class="main-transfer"
                style="text-align: left; display: inline-block"
                :titles="['属性字段', '标注结果']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                :data="listArr.business.transfer"
                @change="handleChange"
              >
                <span slot-scope="{ h, option }" style="display: block">
                  {{ option.label }}

                </span>
                <!--            <el-button slot="left-footer" class="transfer-footer" size="small">操作</el-button>-->
                <!--            <el-button slot="right-footer" class="transfer-footer" size="small">操作</el-button>-->
              </XcomTagTransfer>

              <el-row style="margin-top: 20px">
                <el-button>取消</el-button>
                <el-button type="primary" @click="openDailog">保存并应用</el-button>
              </el-row>
            </div>
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="渠道数据" name="channel">

        <el-row :gutter="20">
          <el-col :span="6">
            <el-table
              ref="singleTable"
              :key="businessTableKey"
              v-loading="listLoading"
              :data="listArr[currentTab].data"
              highlight-current-row
              style="width: 100%"
              @current-change="handleCurrentChange"
            >
              <el-table-column
                property="title"
                label="数据表列表"
              />
            </el-table>
            <pagination
              small
              layout="prev, pager, next"
              :total="listArr[currentTab].total"
              @pagination="getList(currentTab)"
            />
          </el-col>
          <el-col :span="18">

            <div v-if="listArr.channel.transfer.length > 0" style="text-align: center">
              <XcomTagTransfer
                ref="transfer"
                v-model="value"
                class="main-transfer"
                style="text-align: left; display: inline-block"
                :titles="['属性字段', '标注结果']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                :data="listArr.channel.transfer"
                @change="handleChange"
              >
                <span slot-scope="{ h, option }" style="display: block">
                  {{ option.label }}
                </span>
              </XcomTagTransfer>

              <el-row style="margin-top: 20px">
                <el-button>取消</el-button>
                <el-button type="primary" @click="openDailog">保存并应用</el-button>
              </el-row>
            </div>
          </el-col>
        </el-row>

      </el-tab-pane>

    </el-tabs>

    <el-dialog
      title="保存并应用"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <p>数据源  <el-tag>{{ saveQuery.title }} </el-tag>中</p>
      <p> 共有业务数据信息项 <el-tag>{{ saveQuery.sourceData.length + saveQuery.targetData.length }}  </el-tag> 项，
        共打标签<el-tag> {{ saveQuery.targetData.length }} </el-tag>个，
        剩余<el-tag> {{ saveQuery.sourceData.length }} </el-tag>个未打</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { fetchList, fetchPv, createSource, updateSource, changeStatus } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { deepClone } from '@//utils/index.js'
import XcomTagTransfer from '@/components/tagTransfer/index'
import { fetchList, saveTag } from '@/api/datatag' // waves directive

export default {
  name: 'DataTag',
  components: { Pagination, XcomTagTransfer },
  directives: { waves },
  data() {
    return {
      dialogVisible: false,
      businessTableKey: 0,
      channelTableKey: 0,
      tableData: [
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        },
        {
          title: '王小虎'
        }],
      currentRow: {
        multProperties: []
      },
      currentTab: 'business',
      listArr: {
        business: {
          data: [],
          total: 0,
          transfer: [],
          listQuery: {
            sheet: 'business',
            page: 1,
            limit: 20,
            importance: undefined,
            title: undefined,
            type: undefined,
            sort: '+id'
          }
        },
        channel: {
          data: [],
          total: 0,
          transfer: [],
          listQuery: {
            sheet: 'channel',
            page: 1,
            limit: 20,
            importance: undefined,
            title: undefined,
            type: undefined,
            sort: '+id'
          }
        },
        businessTransfer: [],
        channelTransfer: []
      },
      value: [],
      listLoading: true,
      dialogStatus: '',
      saveQuery: {
        sourceData: [],
        targetData: [],
        prefix: '',
        title: ''
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
    this.getList('business')
    this.getList('channel')
  },
  methods: {
    openDailog() {
      this.saveQuery = this.$refs.transfer.getQuery()
      this.saveQuery.title = this.currentRow.title
      this.dialogVisible = true
    },
    handleSave() {
      this.listLoading = true
      this.currentRow.prefix = this.saveQuery.prefix
      this.currentRow.dataSource = this.currentTab

      this.saveQuery.targetData.forEach(item => {
        console.log(item.key)
        const index = this.currentRow.multProperties.findIndex((t, i, arr) => t.key === item.key)
        this.currentRow.multProperties[index].newLabel = item.label
      })

      console.log(this.currentRow.multProperties)
      saveTag(this.currentRow).then(res => {
        this.listLoading = false
        this.$notify({
          title: '完成',
          message: '保存完成',
          type: 'success',
          duration: 2000
        })
      })

      this.dialogVisible = false
    },
    getList(sheetStr) {
      sheetStr = sheetStr || 'business'
      this.listLoading = true
      fetchList(this.listArr[sheetStr].listQuery).then(response => {
        // this.list = response.data.items
        this.listArr[sheetStr].data = response.data.items
        // this.total = response.data.total
        this.listArr[sheetStr].total = response.data.total
        // console.log(this.listArr)
        // Just to simulate the time of the request
        // setTimeout(() => {
        this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      if (val) {
        this.listArr[this.currentTab].transfer = deepClone(val.multProperties)
        this.currentRow = val
      } else {
        console.log('handleCurrentChange...')
        this.listArr[this.currentTab].transfer = []
      }
      this.value = []
    },
    handleTabClick(tab, event) {
      this.currentTab = tab.name
    },
    handleChange(value, direction, movedKeys) {
    }
  }

}
</script>

<style lang="scss" scoped>
.main-transfer{
  min-width: 840px;
}
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }

</style>
