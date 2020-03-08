<template>
  <div id="channelPush" class="container">

    <el-row style="margin-bottom: 10px">
      <el-col :span="20">
        <el-input v-model="listArr.listQuery.searchKey" placeholder="输入关键字，例如：涉黄" clearable style="width: 400px" />
        <el-button type="primary" icon="el-icon-search" style="width: 100px" @click="handleSearch">查询</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 10px">
      <el-col :span="16" style="line-height: 40px;">
        业务频道列表：
      </el-col>
      <el-col :span="8" align="right">
        <el-button type="primary" @click="showSubscribePanel">频道订阅</el-button>
        <el-button type="primary" @click="handleCreate">+自定义业务频道</el-button>
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
        <el-table-column label="频道推送状态" align="center" min-width="50">
          <template slot-scope="{row}">
            <span :style="{color:row.pushStatus === 'pushed'?'green':'red'}">
              {{ row.pushStatus === 'pushed' ? '已推送': '未推送' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="业务频道名称" prop="type" width="300" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center" min-width="100">
          <template slot-scope="{row}">
            {{ row.tag }}
          </template>
        </el-table-column>
        <el-table-column label="来源" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.origin }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button :disabled="row.pushStatus==='pushed'" type="primary" size="mini" @click="handleUpdate(row)">
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
              <el-button slot="reference" :disabled="row.pushStatus==='pushed'" type="danger" size="mini">删除</el-button>
            </el-popconfirm>

            <el-button type="primary" size="mini" @click="handleUpdate(row, 'copy')">
              复制
            </el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row, 'view')">
              查看
            </el-button>
            <el-button v-if="row.pushStatus==='notuse'" type="primary" size="mini" @click="handleUpdate(row,'push')">
              推送
            </el-button>
            <el-button v-if="row.pushStatus==='pushed'" type="primary" size="mini" @click="handleUnPush(row, false)">
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
        hide-on-single-page
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

        <el-form-item label="频道名称" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>

        <el-form-item label="选择频道" prop="category">
          <el-select v-model="temp.channelId" class="filter-item" placeholder="请选择" @change="handleChannelFilter">
            <el-option v-for="item in channelListArr.items" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="数据表" prop="title">
          {{ temp.channel.tables.length }}
        </el-form-item>

        <el-form-item label="频道标签" prop="tag">
          <el-tag>{{ temp.channel.tag }}</el-tag>
        </el-form-item>

        <el-form-item label="频道规则" prop="tag">

          <el-row>
            <el-col :span="12">
              <el-button type="primary" @click="handleAddRule">+添加规则条目</el-button>
            </el-col>
            <!--            <el-col :span="12" align="right">
              <el-checkbox v-model="additionalOptionShow">高级选项</el-checkbox>
            </el-col>-->
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
              label="选择数据项"
              width="340"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.item1.tableName" placeholder="请选择" style="width:50%">
                  <el-option
                    v-for="item in mainOptions"
                    :key="item.id"
                    :label="item.pathTitle"
                    :value="item.id"
                  />
                </el-select>
                <el-input v-model="row.item1.value" placeholder="请输入内容" style="width:45%" />
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="条件"
              width="100"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.operation1" :disabled="!options" placeholder="请选择" style="width: 60px">
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
              label="选择数据项"
              width="340"
              align="center"
            >
              <template slot-scope="{row}">
                <el-select v-model="row.item2.tableName" :disabled="!options" placeholder="请选择" style="width:50%">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.pathTitle"
                    :value="item.id"
                  />
                </el-select>
                <el-input v-model="row.item2.value" :disabled="!options" placeholder="请输入内容" style="width:45%" />
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
          <!--          <el-row v-if="additionalOptionShow">
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
          </el-row>-->

        </el-form-item>

        <el-form-item label="选择发送对象" prop="targetType">
          <el-row>
            按推送对象组
            <!--            <el-radio-group v-model="temp.targetType">
              <el-radio :label="1">按推送对象组</el-radio>
              <el-radio :label="2">按人员</el-radio>
            </el-radio-group>-->

          </el-row>
          <el-row>
            <el-table
              ref="multipleTable"
              :data="groupsArr"
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
                  {{ row.updateTime }}
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

        <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" class="main-form">
          <Templates :tmp="temp.tmp" :tables="temp.tables" />
        </el-form>

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

    <el-dialog
      title="频道订阅"
      :visible.sync="dialogFormSubscribe"
    >

      <template>
        <el-table
          :data="channelSubscribeList.data"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column
            prop="status"
            label="订阅状态"
          >
            <template slot-scope="{row}">
              <span>{{ row.bookStatus? '已订阅':'未订阅' }}</span>
            </template>

          </el-table-column>

          <el-table-column
            prop="title"
            label="频道名称"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="{row}">
              <el-button v-if="row.bookStatus" type="danger" size="mini" @click="handleSubscribe(row,false)">
                取消订阅
              </el-button>
              <el-button v-else type="primary" size="mini" @click="handleSubscribe(row,true)">
                订阅
              </el-button>
            </template>

          </el-table-column>
        </el-table>
      </template>

      <span slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogFormSubscribe = false">取 消</el-button>-->
        <el-button type="primary" @click="closeSubscribe">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyChannel, createSource, dele, fetchList, channelList, detail, groups, push, unPush, updateChannel } from '@/api/channelPush'
import { subscribe } from '@/api/businessChannel'
import Templates from '@/components/Templates'
import { channelSubscribe, channelType, pushTemplate } from '@/api/common'
import Pagination from '@/components/Pagination'
// import quillConfig from './quill-config.js'

export default {
  name: 'ChannelPush',
  components: { Pagination, Templates },
  filters: {
    statusFilter(status) {
      const statusMap = {
        pushed: 'success',
        notuse: 'danger',
        enabled: 'success',
        disabled: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      radio: '1',
      channelTypeList: [],
      channelSubscribeList: {
        data: [],
        total: 0,
        listQuery: {
          isSubscibe: true,
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        }
      },
      pushTemplateList: [],
      additionalOptionShow: false,
      channelListArr: [],
      groupsArr: [],
      ruleOptions: [
        {
          value: '==',
          label: '=='
        }, {
          value: '!=',
          label: '!='
        }, {
          value: '>',
          label: '>'
        }, {
          value: '<',
          label: '<'
        }],
      mainOptions: [],
      options: [],
      content: `<p>内容部分</p>`,
      // editorOption: quillConfig,  //图片上传
      editorOption: {}, // base64
      isSubhead: false,
      isUrl: false,
      searchKey: '',
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
          isSubscibe: true,
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
        tmp: {
          title: '',
          templateType: 'template',
          content: '',
          templateContent: {
            arg1: '',
            arg2: '',
            arg3: '',
            img: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
            url: ''
          },
          isURL: false,
          templateURL: ''
        },
        argTags: [],
        tables: [],
        channel: {
          tables: []
        },
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
      dialogFormSubscribe: false,
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
    this.getChannelList()
    this.getChannelTypeList()
    this.getChannelSubscribe()
    this.getPushTemplateList()
    this.getGroups()
  },
  methods: {
    closeSubscribe() {
      this.dialogFormSubscribe = false
      this.getList()
      this.getChannelSubscribe()
    },
    handleSuccess(res, file) {
      this.temp.templateContent.img = res.url
    },
    async insertText(mark) {
      mark = '{' + mark + '}'
      // const myField = document.querySelector('#textarea');
      const myField = this.$refs.myQuillEditor
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.temp.content = myField.value.substring(0, startPos) + mark +
                  myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()
        myField.setSelectionRange(endPos + mark.length, endPos + mark.length)
      } else {
        this.temp.content += mark
      }
      /*      const areaField = this.$refs.myQuillEditor

        console.log(document.selection)
        if (document.selection) {
          var sel = document.selection.createRange()
        }

        console.log(areaField)
        console.log(areaField.selectionStart)
        if (areaField.selectionStart || areaField.selectionStart === '0') {
          const startPos = areaField.selectionStart
          const endPos = areaField.selectionEnd
          const restoreTop = areaField.scrollTop // 获取滚动条高度
          //  this.waitingTextArea 是v-model的值
          // item.text 是 选择的要插入的值
          this.waitingTextArea = this.waitingTextArea.substring(0, startPos) + 'item.text' + this.waitingTextArea.substring(endPos, this.waitingTextArea.length)
          console.log(this.waitingTextArea)
        } else {
          this.temp.content += mark
          areaField.focus()
        }*/

      // const index = this.editor.selection.savedRange.index
      // console.log('index:', index)
      // this.editor.insertText(index, ' {' + mark + '} ')
    },
    handleChannelFilter() {
      this.getChannel()
    },
    getChannel() {
      this.temp.channel = this.channelListArr.items.find(item => item.id === this.temp.channelId)

      if (this.temp.channel.tables.length > 0) {
        this.mainOptions = this.temp.channel.tables.find(item => item.id === this.temp.channel.mainResourceId).smColumns
        this.options = this.temp.channel.tables.filter(item => item.id !== this.temp.channel.mainResourceId).smColumns
      } else {
        this.mainOptions = []
        this.options = []
      }

      this.temp.tables = this.temp.channel.tables
      this.temp.tag = this.temp.channel.tag
      this.temp.tagId = this.temp.channel.tagId
      this.temp.mainResourceId = this.temp.channel.mainResourceId
      this.temp.pushType = 'business'
    },
    getChannelList() {
      channelList().then(response => {
        this.channelListArr = response.data
        if (!this.channelListArr) {
          this.$notify({
            title: '错误',
            message: '未读取频道列表',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    getGroups() {
      groups().then(response => {
        this.groupsArr = response.data
      })
    },
    handleDialogOpened() {
      // 通道信息
      if (!this.temp.pushChannels) return
      const rows = this.channelTypeList.items.filter((item) => {
        return this.temp.pushChannels.find((item2) => item2.label === item.label)
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
      // todo 缺少频道包含的规则信息

      this.temp.rules = this.temp.rules || []

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
      fetchList(this.listArr.listQuery).then(response => {
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
      channelSubscribe(this.channelSubscribeList.listQuery).then(response => {
        this.channelSubscribeList.data = response.data.items
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
    resetTemp() {
      this.isSubhead = false
      this.isUrl = false
      this.temp = {
        id: undefined,
        tmp: {
          title: '',
          templateType: 'template',
          content: '',
          templateContent: {
            arg1: '',
            arg2: '',
            arg3: '',
            img: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
            url: ''
          },
          isURL: false,
          templateURL: ''
        },
        tables: [],
        argTags: [],
        channel: {
          tables: []
        },
        tag: [],
        category: '',
        title: '',
        subhead: '',
        url: '',
        content: '',
        additionalOption: [],
        targetes: [],
        pushChannels: [],
        pushTemplateList: [],
        rules: []
      }
    },
    handleSearch() {
      this.listLoading = true
      this.listArr.listQuery.page = 1
      this.getList().then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },
    handleClose() {

    },
    showSubscribePanel() {
      this.dialogFormSubscribe = true
    },
    handleSubscribe(row, opt) {
      console.log(opt)
      const data = [{
        channelId: row.id,
        bookStatus: opt ? 1 : 0
      }]
      subscribe(data).then(response => {
        this.listLoading = false
        row.status = opt
        console.log(response)
      })
    },

    handleUnPush(row, opt) {
      unPush(row.id, opt).then(response => {
        this.listLoading = false
        row.status = opt ? 'pushed' : 'notuse'
        console.log(response)
      })
    },
    handleCreate() {
      this.resetTemp()
      console.log('resetTemp...')
      console.log(this.temp)
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
      detail({ id: row.id }).then((res) => {
        this.temp = res.data
        this.temp.channel = res.data
        this.getChannel()
        this.dialogStatus = 'view'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },

    handleUpdate(row, opt) {
      detail({ id: row.id }).then((res) => {
        this.resetTemp()
        this.temp = { ...this.temp, ...res.data }
        this.temp.channel = res.data

        this.temp.templateType = this.temp.templateType || 'template'
        this.temp.templateContent = this.temp.templateContent || {
          arg1: '',
          arg2: '',
          arg3: '',
          img: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
          url: ''
        }

        this.temp.channelId = this.temp.channelId || this.temp.mainResourceId
        console.log(this.temp)
        console.log(this.temp.channelId)

        this.getChannel()
        this.dialogStatus = opt || 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
    .preview{
      border: 1px solid #C1C1C1;
      padding: 10px;
      width: 450px;
      /*height: 500px;*/
      img{
        margin-top: 10px;
        width: 100%;
      }
      .uploader{
        position: absolute;
        padding-top: 6px;
      }
      .url{
        margin-top: 10px;
      }
    }
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
