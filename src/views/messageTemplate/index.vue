<template>
  <div id="messageTemplate" class="container">

    <el-row style="margin-bottom: 10px">
      <el-col :span="16">
        &nbsp;
      </el-col>
      <el-col :span="8" align="right">
        <el-button type="primary" @click="handleCreate('text')">+ 文字模版</el-button>
        <el-button type="primary" @click="handleCreate('template')">+ 图文模版</el-button>
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
        <el-table-column label="序号" prop="id" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模版类型" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板来源" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.origin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板名称" prop="type" width="300" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="50">
          <template slot-scope="{row}">

            <el-tag v-if="row.status !== 'deleted'" :type="row.status | statusFilter">
              {{ row.status === 'enabled' ? '启用': '未启用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>

            <el-button v-if="row.status!='enabled'" type="success" size="mini" @click="handleModifyStatus(row,'enabled')">
              启用
            </el-button>
            <el-button v-if="row.status==='enabled'" size="mini" @click="handleModifyStatus(row,'disabled')">
              停用
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,'deleted')">
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
        @pagination="getList()"
      />
    </el-row>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="800"
      @close="dialogClose"
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item label="模板名称" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>

        <el-row>
          <el-col align="right">
            <el-button size="mini" @click="previewVisible = true">查看预览</el-button>
          </el-col>
        </el-row>

        <el-form-item label="内容标签" prop="content">

          <el-row class="btn">
            <el-button size="mini" @click="insertText('内容标题')">内容标题</el-button>
            <el-button size="mini" @click="insertText('推送封面图')">推送封面图</el-button>
            <el-button size="mini" @click="insertText('发送时间')">发送时间</el-button>
            <el-button size="mini" @click="insertText('发布人ID')">发布人ID</el-button>
          </el-row>
          <quill-editor
            ref="myQuillEditor"
            v-model="temp.content"
            :options="editorOption"
            @click="onEditorClick($event)"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          />
        </el-form-item>

        <el-row v-if="temp.type!=='text'">
          <el-col align="right">
            图文消息模版，不支持自定义内容输入
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          完成
        </el-button>
      </div>
      <el-dialog
        :id="`messageTemplatePreview`"
        width="30%"
        title="预览"
        :visible.sync="previewVisible"
        append-to-body
      >

        <div v-if="temp.type!=='text'">
          <div class="title">内容标题</div>
          <div class="content">内容标题</div>
          <div class="warp">
            <span class="time">时间</span>
            <span class="id">发布ID</span>
          </div>
          <div class="link">阅读全文</div>
        </div>
        <div v-else>
          王经理，您好！感谢您的来电咨询！品牌销售顾问—成功为您服务，欢迎您的来店亲临体验！祝您及家人身体健康，事事如意！
        </div>

      </el-dialog>

    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, searchList, changeStatus, createSource, updateSource, dele } from '@/api/messageTemplate'
import Pagination from '@/components/Pagination'


export default {
  name: 'PushContent',
  components: { Pagination },
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
      content: `<p>内容部分</p>`,
      // editorOption: quillConfig,  //图片上传
      editorOption: {}, // base64
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
        category: '',
        title: '',
        content: ''
      },
      previewVisible: false,
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
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dialogClose() {
      console.log(this.editor)
      this.editor.setContents([{ insert: 'Hello ' }])
    },
    insertText(mark) {
      console.log(this.editor)
      const index = this.editor.selection.savedRange.index
      console.log('index:', index)
      this.editor.insertText(index, ' {' + mark + '} ')
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
    onEditorReady(editor) { // 准备编辑器

    },
    onEditorClick(event) {
    }, // 失去焦点事件
    onEditorBlur(event) {
    }, // 失去焦点事件
    onEditorFocus(event) {
    }, // 获得焦点事件
    onEditorChange(event) {
    }, // 内容改变事件

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
    handleFilter() {
      this.listArr.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.isSubhead = false
      this.isUrl = false
      this.temp = {
        id: undefined,
        title: '',
        content: '{内容标题}'
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
    handleCreate(type) {
      this.resetTemp()

      if (type === 'text') {
        this.temp.type = 'text'
        this.temp.content = '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }'
      }

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
              message: '新建',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('handleUpdate...')
      if (this.$refs.transfer) {
        console.log(this.$refs.transfer.targetData)
      }

      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)

      // console.log(row.subhead)
      this.isSubhead = !!row.subhead
      this.isUrl = !this.url

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateSource(tempData).then(() => {
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

<style lang="scss">
.ql-editor{
  height: 200px;
}
#messageTemplate{
  .btn{
    border: 1px solid #ccc;
    padding-left: 10px;
  }
  .ql-toolbar{
      display: none;
  }
}

#messageTemplatePreview{
  .title{
    border: #1f2d3d solid 1px;
  }
  .content{
    border: #1f2d3d solid 1px;
    height: 400px;
  }
  .link{
    border: #1f2d3d solid 1px;
  }
  .warp{
    border: #1f2d3d solid 1px;
    .time{
      display: inline;
      width: 50%;
    }
  }
}
</style>
