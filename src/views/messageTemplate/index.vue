<template>
  <div id="messageTemplate" class="container">

    <!--    <el-row style="margin-bottom: 10px">
      <el-col :span="16">
        &nbsp;
      </el-col>
      <el-col :span="8" align="right">
        <el-button type="primary" @click="handleCreate('text')">+ 文字模版</el-button>
        <el-button type="primary" @click="handleCreate('template')">+ 图文模版</el-button>
      </el-col>
    </el-row>-->

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
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模版类型" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.type === 'text' ? '文本' : '图文' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板来源" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.origin === 'CUSTOM' ? '自定义': '默认' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板名称" prop="type" width="300" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="50">
          <template slot-scope="{row}">

             <span :style="{color:row.status === 'enabled'?'#409eff':'#606266'}">
              {{ row.status === 'enabled' ? '启用': '停用' }}
            </span>

          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <!--
            <el-button v-if="row.status!='enabled'" type="success" size="mini" @click="handleModifyStatus(row,'enabled')">
              启用
            </el-button>-->
            <!--           <el-button v-if="row.status==='enabled'" size="mini" @click="handleModifyStatus(row,'disabled')">
              停用
            </el-button>-->
            <!--            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,'deleted')">
              删除
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
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="800px"
      @close="dialogClose"
    >

      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" class="main-form">
        <Templates :tmp="temp.tmp" :tables="temp.tables" />
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          完成
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, searchList, detail, changeStatus, updateSource, dele } from '@/api/messageTemplate'
import { channelDetail } from '@/api/businessChannel'
import Templates from '@/components/Templates'
import Pagination from '@/components/Pagination'

export default {
  name: 'PushContent',
  components: { Pagination, Templates },
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
        origin: 'CUSTOM',
        status: 'enabled',
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
    MODEL: function() {
      return this.$store.state.publicData.model
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dialogClose() {
      // console.log(this.editor)
      // this.editor.setContents([{ insert: 'Hello ' }])
    },
    async insertText(mark) {
      mark = '{{ ' + mark + ' }}'
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
        tmp: {
          title: '',
          templateType: 'template',
          content: '',
          arg1: '',
          arg2: '',
          arg3: '',
          arg4: '',
          isURL: false,
          templateURL: ''
        },
        status: 'enabled',
        origin: 'CUSTOM',
        title: '',
        content: '{内容标题}'
      }
    },
    handleSearch() {
      this.listLoading = true
      this.listArr.listQuery.page = 1
      searchList(this.searchKey).then(response => {
        this.listArr.data = response.data.items
        this.listArr.total = response.data.total
        this.listLoading = false
      })
    },

    handleUpdate(row) {
      detail({ id: row.id }).then((res) => {
        channelDetail({ id: row.channelId }).then((res) => {
          this.resetTemp()
          this.temp = { ...this.temp, ...res.data }
          console.log(this.temp)
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)

          tempData.origin = 'CUSTOM'
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
