<template>
  <div id="channelPush" class="container">

    <el-row style="margin-bottom: 10px">
      <el-col :span="20">
        <el-input v-model="keyword" placeholder="输入关键字，例如：涉黄" clearable style="width: 400px" />
        <el-button type="primary" icon="el-icon-search" style="width: 100px" @click="handleSearch">查询</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 10px">
      <el-col :span="16" style="line-height: 40px;">
        业务频道列表：
      </el-col>
      <el-col :span="8" align="right">
        <el-button type="primary" @click="handleCreate">+新建内容推送</el-button>
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
        <el-table-column label="推送状态" align="center" min-width="50">
          <template slot-scope="{row}">

            <el-tag v-if="row.status !== 'deleted'" :type="row.status | statusFilter">
              {{ row.status === 'pushed' ? '已推送': '未推送' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最近推送时间" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.lastPushTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容分类" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.contentType==="notice"?"公告":"新闻" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容标签" align="center" min-width="100">
          <template slot-scope="{row}">
            <el-tag v-for="tag in row.tag" :key="tag" style="margin-right: 10px">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="内容来源" prop="type" width="300" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.contentOrigin==="default"?"默认":"自定义" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道推送名称" prop="type" width="300" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button :disabled="row.status==='pushed'" type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>

            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="'删除 '+row.title + '?'"
              @onConfirm="handleDelete(row,'deleted')"
            >
              <el-button slot="reference" :disabled="row.status==='pushed'" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
            <!--
            <el-button type="primary" size="mini" @click="handleUpdate(row, 'copy')">
              复制
            </el-button>-->
            <!--            <el-button type="primary" size="mini" @click="handleView(row)">
              查看
            </el-button>-->
            <el-button v-if="row.status==='notPush'" type="primary" size="mini" @click="handleUpdate(row,'push')">
              推送
            </el-button>
            <el-button v-if="row.status==='pushed'" type="primary" size="mini" @click="handleUnPush(row, false)">
              取消推送
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
      width="1100px"
      destroy-on-close
      :class="'form'"
      @opened="handleDialogOpened"
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item label="内容推送名称" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>

        <el-form-item label="内容规则" prop="tag">

          <el-row>
            <el-col :span="12">
              <el-button type="primary" @click="handleAddRule">+添加规则条目</el-button>
            </el-col>
            <el-col :span="12" align="right">
              <el-checkbox v-model="additionalOptionShow">高级选项</el-checkbox>
            </el-col>
          </el-row>
          <el-table
            :data="temp.rules"
            width="90%"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="item1.tableKey"
              label="内容类型"
              width="240"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.item1.tableName" size="small" placeholder="请选择" style="width:50%">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="选择"
              width="200"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.operation1" size="small" placeholder="请选择" style="width: 100px">
                  <el-option
                    v-for="item in ruleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="内容标签"
              width="240"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.item2.tableName" size="small" placeholder="请选择" style="width:50%">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button size="mini" type="danger" @click="handleRuleDelete(row,'deleted')">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row v-if="additionalOptionShow">
            高级选项
            <el-table
              :data="temp.additionalOption"
            >
              <el-table-column
                prop="priority"
                label="优先级"
                width="100"
                size="small"
              >
                <template slot-scope="{row}">
                  <el-input v-model="row.priority" size="small" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column
                prop="rule"
                label="规则"
                width="300"
              >
                <template slot-scope="{row}">
                  <el-select v-model="row.rule" size="small" placeholder="请选择" style="width:50%">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="150"
              >
                <el-button size="small">删除</el-button>
                <el-button size="small">添加</el-button>
              </el-table-column>
            </el-table>
          </el-row>

        </el-form-item>

        <el-form-item label="选择发送对象" prop="targetType">
          <el-row>

            <el-radio-group v-model="temp.targetType">
              <el-radio :label="1">按推送对象组</el-radio>
              <el-radio :label="2">按人员</el-radio>
            </el-radio-group>

          </el-row>
          <el-row>
            <el-table
              ref="multipleTable"
              :data="temp.targetes"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
              />
              <el-table-column
                label="名称"
              >
                <template slot-scope="{row}">
                  {{ row.title }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="人数"
              >
                <template slot-scope="{row}">
                  {{ row.amount }}
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="状态"
                show-overflow-tooltip
              >
                <template slot-scope="{row}">
                  <el-tag :type="row.status | statusFilter">
                    {{ row.status === 'enabled' ? '已启用': '未启用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="创建时间"
              >
                <template slot-scope="{row}">
                  {{ row.createDate }}
                </template>
              </el-table-column>
            </el-table>
          </el-row>

        </el-form-item>

        <el-form-item label="推送通道" prop="pushChannel">
          <el-row>
            <el-table
              ref="pushChannelTable"
              :data="channelTypeList.items"
              style="width:400px"
              @selection-change="handleSelectionChangePushChannel"
            >
              <el-table-column
                type="selection"
              />
              <el-table-column
                label="通道类型"
              >
                <template slot-scope="{row}">
                  {{ row.type }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="通道名称"
              >
                <template slot-scope="{row}">
                  {{ row.label }}
                </template>
              </el-table-column>

            </el-table>
          </el-row>

        </el-form-item>

        <el-form-item label="推送模板" prop="templateKey">
          <el-radio v-for=" (item, key) in pushTemplateList" :key="key" v-model="temp.templateKey" :label="item.key"> {{ item.label }} </el-radio>
        </el-form-item>

        <el-form-item label="推送时间" prop="templateKey">
          <el-radio v-model="temp.pushPlan" label="instant">实时</el-radio>

          <el-row>
            推送确认:
            <el-select v-model="temp.pushPlanOption" placeholder="选择推送确认">
              <el-option label="按钮确认" value="1" />
              <el-option label="阅读读秒计时" value="2" />
              <el-option label="不需要确认" value="3" />
            </el-select>
            <el-input v-model="temp.receiptSecond" placeholder="输入秒" style="width: 100px" />
            <span>（短信不支持确认）</span>
          </el-row>
          <el-row>
            推送确认:
            <el-radio v-model="temp.receipt" label="true">需回传</el-radio>
            <el-radio v-model="temp.receipt" label="false">不需回传</el-radio>
            <span>（短信不支持确认）</span>
          </el-row>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ dialogStatus==='view'? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">
          完成
        </el-button>
        <el-button v-if="dialogStatus==='update'" type="primary" @click="updateData()">
          完成
        </el-button>
        <el-button v-if="dialogStatus==='copy'" type="primary" @click="copyData()">
          完成
        </el-button>
        <el-button v-if="dialogStatus==='push'" type="primary" @click="pushData()">
          推送
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyChannel, createSource, dele, contentPushList, push, unPush, searchList, updateChannel } from '@/api/channelPush'
import { subscribe } from '@/api/businessChannel'
import { channelSubscribe, channelType, pushTemplate } from '@/api/common'
import Pagination from '@/components/Pagination'
// import quillConfig from './quill-config.js'

export default {
  name: 'ChannelPush',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        pushed: 'success',
        notPush: 'danger',
        enabled: 'success',
        disabled: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      channelTypeList: [],
      channelSubscribeList: [],
      pushTemplateList: [],
      additionalOptionShow: false,
      ruleOptions: [
        {
          value: '==',
          label: '等于'
        }, {
          value: '!=',
          label: '不等于'
        }, {
          value: '⊆',
          label: '包含'
        }],
      options: [
        {
          value: 'notice',
          label: '公告'
        }, {
          value: 'news',
          label: '新闻'
        }],
      content: `<p>内容部分</p>`,
      // editorOption: quillConfig,  //图片上传
      editorOption: {}, // base64
      isSubhead: false,
      isUrl: false,
      keyword: '',
      tables: [],
      tableKey: 0,
      listType: [
        { key: 12345, label: '新闻' },
        { key: 54321, label: '公告' }
      ],
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
        tag: '',
        category: '',
        title: '',
        subhead: '',
        url: '',
        content: '',
        targetType: 1,
        pushChannels: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        channelPushSet: '频道推送设置（订阅频道）',
        view: '查看',
        update: '编辑',
        copy: '复制',
        push: '推送',
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
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  created() {
    this.getList()
    this.getChannelTypeList()
    this.getChannelSubscribe()
    this.getPushTemplateList()
  },
  methods: {
    handleDialogOpened() {
      const rows = this.channelTypeList.items.filter((item, index) => {
        return this.temp.pushChannels.find((item2, index2) => item2.label === item.label)
      })
      this.pushChannelSelection(rows)
    },
    pushChannelSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.pushChannelTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.pushChannelTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChangePushChannel(val) {
      this.multipleSelection = val
    },
    handleAddRule() {
      console.log(this.temp.rules)
      console.log(this.temp)
      this.temp.rules.push({
        item1: { value: '', tableKey: '', tableName: '' },
        item2: { value: '', tableKey: '', tableName: '' },
        item3: { value: '', tableKey: '', tableName: '' },
        operation1: '==',
        operation2: '=='
      })
      // console.log(this.temp.rules)
    },
    onEditorReady(editor) { // 准备编辑器

    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件

    handleRuleDelete(row) {
      const index = this.temp.rules.indexOf(row)
      this.temp.rules.splice(index, 1)
    },
    getList() {
      this.listLoading = true
      contentPushList(this.listArr.listQuery).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },
    getChannelTypeList() {
      this.listLoading = true
      channelType().then(response => {
        this.channelTypeList = response.data
        this.listLoading = false
      })
    },
    getChannelSubscribe() {
      this.listLoading = true
      channelSubscribe().then(response => {
        this.channelSubscribeList = response.data.items
        this.listLoading = false
      })
    },
    getPushTemplateList() {
      this.listLoading = true
      pushTemplate().then(response => {
        this.pushTemplateList = response.data.items
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listArr.listQuery.page = 1
      this.getList()
    },

    resetTemp() {
      this.isSubhead = false
      this.isUrl = false
      this.temp = {
        id: undefined,
        tag: [],
        category: '',
        title: '',
        subhead: '',
        url: '',
        content: '',
        additionalOption: [],
        pushTemplateList: [],
        targetes: [],
        pushChannels: [],
        rules: []
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
    handleClose() {

    },
    handleSubscribe(row, opt) {
      subscribe(row.id, opt).then(response => {
        this.listLoading = false
        row.status = opt
        console.log(response)
      })
    },
    handleUnPush(row, opt) {
      unPush(row.id, opt).then(response => {
        this.listLoading = false
        row.status = opt ? 'pushed' : 'notPush'
        console.log(response)
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

    handleView(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      // console.log(row.subhead)
      this.isSubhead = !!row.subhead
      this.isUrl = !this.url

      this.dialogStatus = 'view'

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleUpdate(row, opt) {
      // console.log('handleUpdate...')
      /*      if (this.$refs.transfer) {
        console.log(this.$refs.transfer.targetData)
      }*/
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      // console.log(row.subhead)
      this.isSubhead = !!row.subhead
      this.isUrl = !this.url

      this.dialogStatus = opt || 'update'

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    pushData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          push(tempData).then((res) => {
            this.temp.status = 'pushed'
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
              message: '推送成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateChannel(tempData).then(() => {
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

    copyData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          copyChannel(tempData).then((res) => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '完成',
              message: '复制成功',
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

<style lang="scss">
.ql-editor{
  height: 200px;
}
  #channelPush{
    tr{
      button{
        padding: 7px;
        margin-left: 0;
      }
    }
    .form{
      .el-dialog{
        margin-top: 50px !important;
      }
      .el-dialog__body{
        height:700px;
        max-height: 700px;
        overflow-y: scroll;
      }
    }

  }
</style>
