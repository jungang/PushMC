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
        <el-button v-if="type==='business'" type="primary" @click="showSubscribePanel">频道订阅</el-button>
        <el-button type="primary" @click="handleCreate">
          <span v-if="type==='business'">+新建频道推送</span>
          <span v-if="type==='channel'">+渠道推送</span>
          <span v-if="type==='content'">+新建内容推送</span>
        </el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-table
        v-if="type==='business'"
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
        <el-table-column label="推送名称" prop="type" width="200" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.pushTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务频道名称" prop="type" width="200" align="center" min-width="50">
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
            <span>{{ row.origin === 'CUSTOM' ? '自定义': '默认' }}</span>
          </template>
        </el-table-column>
        业务频道列表：
        <el-table-column label="操作" align="left" min-width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">

            <el-button :disabled="row.pushStatus==='pushed'" type="text" size="mini" @click="handleUpdate(row)">
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
              <el-button slot="reference" class="action_btn" :disabled="row.pushStatus==='pushed'" type="text" size="mini">删除</el-button>
            </el-popconfirm>

            <el-button type="text" size="mini" @click="handleUpdate(row, 'copy')">
              复制
            </el-button>
            <el-button type="text" size="mini" @click="handleUpdate(row, 'view')">
              查看
            </el-button>
            <el-button v-if="row.status!=='enabled'" type="text" size="mini" @click="handleModifyStatus(row,'enabled')">
              推送
            </el-button>
            <el-button v-if="row.status==='enabled'" type="text" size="mini" @click="handleModifyStatus(row,'disabled')">
              取消推送
            </el-button>

            <!--            <el-button v-if="row.pushStatus==='notuse'" type="primary" size="mini" @click="handleUpdate(row,'push')">
              推送
            </el-button>
            <el-button v-if="row.pushStatus==='pushed'" type="primary" size="mini" @click="handleUnPush(row, false)">
              取消推送
            </el-button>-->

          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-if="type==='channel'"
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
        <el-table-column label="推送状态" align="center" min-width="100">
          <template slot-scope="{row}">
            <span :style="{color:row.pushStatus === 'pushed'?'green':'red'}">
              {{ row.pushStatus === 'pushed' ? '已推送': '未推送' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="最近推送时间" prop="type" width="200" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道来源" prop="type" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.origin === 'CUSTOM' ? '自定义': '默认' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道标签" prop="type" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.tag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道推送名称" prop="type" width="300" align="center">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button :disabled="row.pushStatus==='pushed'" type="text" size="mini" @click="handleUpdate(row)">
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

            <el-button type="text" size="mini" @click="handleUpdate(row, 'copy')">
              复制
            </el-button>
            <el-button type="text" size="mini" @click="handleUpdate(row, 'view')">
              查看
            </el-button>

            <el-button v-if="row.status!=='enabled'" type="text" size="mini" @click="handleModifyStatus(row,'enabled')">
              推送
            </el-button>
            <el-button v-if="row.status==='enabled'" size="mini" @click="handleModifyStatus(row,'disabled')">
              取消推送
            </el-button>

            <!--            <el-button v-if="row.pushStatus==='notuse'" type="primary" size="mini" @click="handleUpdate(row,'push')">
              推送
            </el-button>
            <el-button v-if="row.pushStatus==='pushed'" type="primary" size="mini" @click="handleUnPush(row, false)">
              取消推送
            </el-button>-->

          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-if="type==='content'"
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
        <el-table-column label="推送状态" align="center" min-width="100">
          <template slot-scope="{row}">

            <span :style="{color:row.pushStatus === 'pushed'?'green':'red'}">
              {{ row.pushStatus === 'pushed' ? '已推送': '未推送' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="最近推送时间" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容分类" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.contentType==="notice"?"公告":"新闻" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容标签" align="center" min-width="100">
          <template slot-scope="{row}">
            {{ row.tag }}
            <!--            <el-tag v-for="tag in row.tag" :key="tag" style="margin-right: 10px">{{ tag }}</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column label="内容来源" prop="type" width="100" align="center" min-width="50">
          <template slot-scope="{row}">
            {{ row.origin === 'CUSTOM' ? '自定义': '默认' }}
          </template>
        </el-table-column>
        <el-table-column label="渠道推送名称" prop="type" width="200" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="250" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button :disabled="row.pushStatus==='pushed'" type="text" size="mini" @click="handleUpdate(row)">
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
              <el-button slot="reference" :disabled="row.pushStatus==='pushed'" type="text" size="mini">删除</el-button>
            </el-popconfirm>

            <el-button type="text" size="mini" @click="handleUpdate(row, 'copy')">
              复制
            </el-button>
            <el-button type="text" size="mini" @click="handleUpdate(row, 'view')">
              查看
            </el-button>

            <el-button v-if="row.status!=='enabled'" type="text" size="mini" @click="handleModifyStatus(row,'enabled')">
              推送
            </el-button>
            <el-button v-if="row.status==='enabled'" type="text" size="mini" @click="handleModifyStatus(row,'disabled')">
              取消推送
            </el-button>

            <!--            <el-button v-if="row.pushStatus==='notuse'" type="primary" size="mini" @click="handleUpdate(row,'push')">
              推送
            </el-button>
            <el-button v-if="row.pushStatus==='pushed'" type="primary" size="mini" @click="handleUnPush(row, false)">
              取消推送
            </el-button>-->

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
            prop="title"
            label="推送名称"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="{row}">
              <el-button type="text" size="mini" @click="handleSubscribe(row,true)">
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

    <el-dialog
      :title="textMap[dialogStatus]"
      width="1100px"
      :class="'form'"
      :visible.sync="outerVisible"
      @opened="handleDialogOpened"
    >

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" class="main-form">

        <el-form-item label="推送名称" prop="title">
          <el-input v-model="temp.title" style="width:400px" :disabled="dialogStatus==='view'" />
        </el-form-item>

        <el-form-item label="选择频道" prop="channelId">
          <el-select
            v-model="temp.channelId"
            class="filter-item"
            placeholder="请选择"
            :disabled="dialogStatus==='view'"
            @change="handleChannelFilter"
          >
            <el-option v-for="item in channelListArr.items" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="数据表">
          {{ temp.channel.tables.length }}
        </el-form-item>

        <!--        <el-form-item label="频道标签" prop="tag">
          <el-tag>{{ temp.channel.tag }}</el-tag>
        </el-form-item>-->

        <el-form-item label="频道规则" prop="tag">
          <el-button :disabled="!temp.channelId || dialogStatus==='view'" size="small" plain @click="editChannel">编辑频道规则（跳转）</el-button>

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
                  {{ row.title }}
                </template>
              </el-table-column>

            </el-table>
          </el-row>

        </el-form-item>
        <el-form-item label="选择发送对象" prop="groups">

          <el-row>
            <el-col :span="12">按推送对象组</el-col>
            <el-col :span="12" align="right">
              <el-button @click="handleCreateGroup">新建推送对象组</el-button>
            </el-col>

          </el-row>
          <el-row>
            <el-table
              ref="groupsTable"
              :data="groupsArr.data"
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
                label="通道名称"
              >
                <template slot-scope="{row}">
                  {{ row.tunnelTitle }}
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

                  {{ row.status === 'enabled' ? '已启用': '未启用' }}

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
            <pagination
              v-show="groupsArr.total>0"
              :total="groupsArr.total"
              :page.sync="groupsArr.listQuery.page"
              :limit.sync="groupsArr.listQuery.limit"
              hide-on-single-page
              @pagination="getGroups()"
            />
          </el-row>

        </el-form-item>

        <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" class="main-form">
          <Templates :tmp="temp.tmp" :tables="temp.tables" />
        </el-form>

        <el-form-item label="推送时间" prop="templateKey">
          <el-radio v-model="temp.pushPlan" label="instant" :disabled="dialogStatus==='view'">实时</el-radio>

          <el-row>
            推送确认:
            <el-select v-model="temp.pushPlanOption" placeholder="选择推送确认" :disabled="dialogStatus==='view'">
              <el-option label="按钮确认" :value="1" />
              <el-option label="阅读读秒计时" :value="2" />
              <el-option label="不需要确认" :value="3" />
            </el-select>
            <el-input v-if="temp.pushPlanOption==='2'" v-model="temp.receiptSecond" :disabled="dialogStatus==='view'" placeholder="输入秒" style="width: 100px" />
            <span>（短信不支持确认）</span>
          </el-row>
          <el-row>
            确认位置:

            <el-radio v-model="temp.receipt" label="true" :value="true" :disabled="dialogStatus==='view'">需回传</el-radio>
            <el-radio v-model="temp.receipt" label="false" :value="false" :disabled="dialogStatus==='view'">不需回传</el-radio>
            <span>（短信不支持确认）</span>
          </el-row>
        </el-form-item>

      </el-form>
      <!--      新建推送组弹窗-->
      <el-dialog
        width="700px"
        top="100px"
        title="新建推送对象组"
        :visible.sync="innerVisible"
        append-to-body
        @close="dialogClose"
      >
        <el-form ref="groupForm" :rules="rules" :model="groupTemp" label-position="right" label-width="150px" class="main-form">

          <el-form-item label="推送对象组名称：" prop="title">
            <el-input v-model="groupTemp.title" placeholder="输入对象组名称" style="width:400px" />
          </el-form-item>

          <!--       <el-radio-group v-model="tabTo" style="margin-bottom: 30px;">
            <el-radio-button label="department">按组织结构</el-radio-button>
            <el-radio-button label="personnel">按人员</el-radio-button>
          </el-radio-group>-->
          <PickPersons ref="pickPersons" :data.sync="groupTemp.smGroupItems" :tunnel="groupTemp.tunnelId" />

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="createGroup">确 定</el-button>
        </span>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">
          {{ dialogStatus==='view'? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="dialogStatus==='create'" :loading="listLoading" type="primary" @click="createData()">
          保存
        </el-button>
        <el-button v-if="dialogStatus==='update'" :loading="listLoading" type="primary" @click="updateData()">
          保存
        </el-button>
        <el-button v-if="dialogStatus==='copy'" :loading="listLoading" type="primary" @click="createData()">
          保存
        </el-button>
        <el-button v-if="dialogStatus==='create'" :loading="listLoading" type="primary" @click="createData('save_push')">
          保存并推送
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyChannel, dele, bookList, createSource, changeStatus, channelList, detail, groups, unPush, updateChannel } from '@/api/channelPush'
import { subscribe } from '@/api/businessChannel'
import Templates from '@/components/Templates'
import PickPersons from '@/components/pickPersons'
// import RulesSel from '@/components/RulesSel'
import { channelSubscribe, channelType, pushTemplate } from '@/api/common'
import Pagination from '@/components/Pagination'
import { createGroup } from '@/api/pushTarget'
// import quillConfig from './quill-config.js'

export default {
  name: 'ChannelPush',
  components: { Pagination, Templates, PickPersons },
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
  props: {
    type: {
      type: String,
      default: 'Vue!'
    }
  },
  data() {
    return {
      radio: '1',
      title: '',
      channelId: '',
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
      groupsArr: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          title: undefined,
          type: undefined,
          sort: '+id'
        }
      },
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
          pushType: this.type,
          searchKey: '',
          sort: '+id'
        }
      },
      listLoading: true,
      groupTemp: {},
      temp: {
        id: undefined,
        pushTitle: '',
        tunnel: [],
        status: 'enabled',
        tmp: {
          id: -1,
          templateType: 'template',
          content: '',
          digest: '',
          digest2: '',
          msgTitle: '',
          cover: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
          templateURL: '',
          arg1: '',
          arg2: '',
          arg3: '',
          arg4: ''
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
        pushPlan: 'instant',
        pushPlanOption: 1,
        receipt: 'true',
        receiptSecond: 60,
        pushChannel: []
      },
      dialogFormSubscribe: false,
      groupVisible: false,
      dialogVisible: false,
      outerVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        channelPushSet: '频道推送设置（订阅频道）',
        view: '查看',
        update: '编辑',
        copy: '复制',
        push: '推送',
        create: '新建'
      },
      rules: {
        // channelId: [
        //   { required: true, message: '请选择分类', trigger: 'change' }
        // ],
        groups: [
          { required: true, message: '请选择推送对象组', trigger: 'blur' }
        ],
        pushChannel: [
          { required: true, message: '请选择推送通道', trigger: 'blur' }
        ],
        pushTitle: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        mainTable: [
          { required: true, message: '请选择数据表和主表', trigger: 'blur' }
        ],
        tagId: [
          { required: true, message: '请选择标签', trigger: 'blur' }
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
    console.log(this.type)
    console.log(this.listArr.listQuery.pushType)
    console.log('created.......')
  },
  methods: {
    handleTest() {
      this.dialogVisible = true
    },
    handleCreateGroup() {
      this.groupTemp = {
        id: undefined,
        tunnelId: 1,
        category: 'API',
        title: '',
        smGroupItems: []
      }

      this.dynamicTags = []
      // this.groupVisible = true
      this.innerVisible = true

      this.$nextTick(() => {
        this.$refs['groupForm'].clearValidate()
      })
    },
    dialogClose() {
      this.plaza = []
      this.tabTo = 'department'
      // this.$refs.tree.setCheckedKeys([])
    },
    createGroup() {
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          console.log(this.$refs.pickPersons.dynamicTags)
          console.log(this.$refs.pickPersons.personsArr.tunnelId)
          // this.temp.smGroupItems = this.dynamicTags
          this.groupTemp.smGroupItems = this.$refs.pickPersons.dynamicTags
          this.groupTemp.status = 'enabled'
          console.log(this.groupTemp)

          this.groupTemp.tunnelId = this.$refs.pickPersons.personsArr.tunnelId

          this.groupTemp.smGroupItems.forEach(item => {
            item.type = item.type || '1'
            item.itemId = item.itemId || item.userid
            item.itemName = item.itemName || item.truename
          })

          createGroup(this.groupTemp).then(() => {
            this.innerVisible = false
            this.getGroups()
            this.$notify({
              title: '完成',
              message: '新建对象组',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    editChannel() {
      if (this.temp.channelId) {
        this.$router.push({ name: 'BusinessChannel', params: { edit: this.temp.channelId }})
      }
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

    closeSubscribe() {
      this.dialogFormSubscribe = false
      this.getList()
      this.getChannelSubscribe()
    },
    handleSuccess(res, file) {
      this.temp.templateContent.img = res.url
    },
    async insertText(mark) {
      mark = '{ ' + mark + ' }'
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
      this.temp.rules = []
      this.getChannel()
    },
    getChannel() {
      this.temp.channelId = this.temp.channelId || 10

      this.temp.channel = this.channelListArr.items.find(item => item.id === this.temp.channelId)

      console.log('getChannel...')
      console.log(this.channelListArr.items)
      console.log(this.temp.channelId)
      console.log(this.temp.channel)

      if (this.temp.channel.tables.length > 0) {
        this.mainOptions = []
        this.options = []
        this.mainOptions = this.temp.channel.tables.find(item => item.id === this.temp.channel.mainResourceId).smColumns
        // this.options = this.temp.channel.tables.filter(item => {}item.id !== this.temp.channel.mainResourceId).smColumns
        this.temp.channel.tables.forEach((item) => {
          if (this.temp.channel.mainResourceId !== item.id) {
            this.options = this.options.concat(item.smColumns)
          }
        })
      } else {
        this.mainOptions = []
        this.options = []
      }

      // console.log(this.temp.channel.tables)
      // console.log(this.mainOptions)
      // console.log(this.options)

      this.temp.tables = this.temp.channel.tables
      this.temp.tag = this.temp.channel.tag
      this.temp.tagId = this.temp.channel.tagId
      this.temp.mainResourceId = this.temp.channel.mainResourceId
      this.temp.pushType = this.type
    },
    getChannelList() {
      channelList({ pushType: this.type }).then(response => {
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
    getGroups(data) {
      if (this.temp.tunnel.length === 0) {
        this.groupsArr.data = []
        return
      }

      console.log(this.groupsArr.listQuery)
      this.groupsArr.listQuery.tunnel = this.temp.tunnel.join(',')
      groups(this.groupsArr.listQuery).then(response => {
        this.groupsArr.total = response.data.total
        this.groupsArr.data = response.data.items
      })
    },
    handleDialogOpened() {
      console.log('handleDialogOpened...')
      if (this.temp.pushChannel) {
        const rows = this.channelTypeList.items.filter((item) => {
          return this.temp.pushChannel.find((item2) => item2.id === item.id)
        })
        this.pushChannelSelection(rows)
      }

      if (this.temp.groups) {
        // console.log(this.temp.groups)
        // console.log(this.groupsArr)
        const rows = this.groupsArr.data.filter((item) => {
          return this.temp.groups.find((item2) => item2.id === item.id)
        })
        this.groupsTableSelection(rows)
      }
    },

    groupsTableSelection(rows) {
      // console.log(rows)
      if (rows) {
        rows.forEach(row => {
          this.$refs.groupsTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.groupsTable.clearSelection()
      }
    },

    pushChannelSelection(rows) {
      console.log('pushChannelSelection...')
      // console.log(rows)

      this.$refs.pushChannelTable.clearSelection()
      if (rows) {
        rows.forEach(row => {
          this.$refs.pushChannelTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.pushChannelTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.temp.groups = val
      // console.log(this.temp.groups)
      // console.log(this.temp)
    },
    handleSelectionChangePushChannel(val) {
      this.temp.pushChannel = val
      this.temp.tunnel = this.temp.pushChannel.map(i => i.id)
      this.getGroups()
    },
    handleAddRule() {
      // console.log(this.temp.rules)
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
      bookList(this.listArr.listQuery).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },
    getChannelTypeList() {
      this.listLoading = true
      channelType().then(response => {
        console.log('getChannelTypeList...')
        console.log(response)
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
        pushTitle: '',
        tunnel: [],
        status: 'enabled',
        tmp: {
          id: -1,
          templateType: 'template',
          content: '',
          title: '',
          digest: '',
          digest2: '',
          msgTitle: '',
          cover: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
          templateURL: '',
          arg1: '',
          arg2: '',
          arg3: '',
          arg4: ''
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
        pushPlan: 'instant',
        pushPlanOption: 1,
        receipt: 'true',
        receiptSecond: 60,
        additionalOption: [],
        targetes: [],
        pushTemplateList: [],
        groups: [],
        pushChannel: [],
        rules: []
      }
    },
    handleSearch() {
      // console.log('handleSearch...')
      this.listLoading = true
      this.listArr.listQuery.page = 1
      // console.log(this.listArr.listQuery)
      this.getList()
    },
    handleClose() {

    },
    showSubscribePanel() {
      this.dialogFormSubscribe = true
    },
    handleSubscribe(row, opt) {
      // console.log(opt)
      const data = [{
        channelId: row.id,
        bookStatus: opt ? 1 : 0
      }]
      subscribe(data).then(response => {
        this.listLoading = false
        row.status = opt
        // console.log(response)
      })
    },

    handleUnPush(row, opt) {
      unPush(row.id, opt).then(response => {
        this.listLoading = false
        row.status = opt ? 'pushed' : 'notuse'
        // console.log(response)
      })
    },

    handleCreate() {
      this.resetTemp()
      // console.log('resetTemp...')
      // console.log(this.temp)
      this.dialogStatus = 'create'
      this.outerVisible = true

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.temp.channelId = this.temp.channelId || 1 // todo
      this.temp.tag = this.temp.tag || 1 // todo
      this.temp.tagId = this.temp.tagId || 1 // todo
      this.temp.mainResourceId = this.temp.mainResourceId || 1 // todo

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = -1
          this.temp.status = (arguments[0] === 'save_push') ? 'enabled' : 'disabled'

          this.listLoading = true
          createSource(this.temp).then(() => {
            this.listLoading = false
            this.getList()
            this.outerVisible = false
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

        console.log(this.temp.rules)
        this.dialogStatus = 'view'
        this.outerVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },

    setGroups() {
      // console.log('setGroups...')
      // console.log(this.temp.groups)
    },
    handleUpdate(row, opt) {
      detail({ id: row.id }).then((res) => {
        this.resetTemp()
        this.temp = { ...this.temp, ...res.data }
        this.temp.receipt = this.temp.receipt.toString()
        // this.temp.channel = res.data
        console.log('this.temp', this.temp)
        this.setGroups()

        this.getChannel()
        this.dialogStatus = opt || 'update'
        this.outerVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
            this.outerVisible = false
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
            this.outerVisible = false
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
