<template>
  <div class="container">

    <el-row style="margin-bottom: 10px">
      <el-col :span="20">
        内容列表：
        <el-select v-model="listArr.listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in MODEL.tagCategory" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-input v-model="searchKey" placeholder="输入关键字，例如：涉黄" clearable style="width: 400px" />
        <el-button type="primary" icon="el-icon-search" style="width: 100px" @click="handleSearch">查询</el-button>
      </el-col>
      <el-col :span="4" align="right"><el-button type="primary" @click="handleCreate">+ 新建内容</el-button></el-col>
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
        <el-table-column label="ID" prop="id" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容分类" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容标签" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.tag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批状态" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容标题" prop="type" align="center" min-width="200">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="handleUpdate(row,'view')">
              查看
            </el-button>
            <el-button type="text" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.status!=='deleted'" size="mini" type="text" @click="handleDelete(row,'deleted')">
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
      width="800"
      destroy-on-close
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" class="main-form">

        <el-form-item label="内容标题" prop="title">
          <el-input v-model="temp.title" style="width:400px" @contextmenu.prevent.native="openMenu($event)" />
          <el-checkbox v-model="isSubhead">使用副标题</el-checkbox>
        </el-form-item>
        <el-form-item v-if="isSubhead" label="副标题" prop="subhead">
          <el-input v-model="temp.subhead" style="width:400px" />
        </el-form-item>

        <el-form-item label="新闻链接" prop="url">
          <el-input v-model="temp.url" placeholder="请输入URL">
            <template slot="prepend">

              <el-checkbox v-model="temp.isUrl" />

            </template>
          </el-input>

        </el-form-item>
        <el-form-item label="内容标签" prop="tagId">
          <el-select v-model="temp.tagId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in listLabel" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="正文" prop="content">
          <quill-editor
            ref="myQuillEditor"
            v-model="temp.content"
            :options="editorOption"
          />
        </el-form-item>

        <el-form-item v-if="dialogStatus!=='create'" label="审批状态">
          {{ temp.status || '' }} {{ temp.examineTime || '' }}
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ dialogStatus==='view'?'关闭':'取消' }}
        </el-button>
        <el-button v-if="dialogStatus!=='view'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          完成
        </el-button>
      </div>
    </el-dialog>
    <div v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <p @click="addArg">插入字段</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, detail, searchList, create, update, dele } from '@/api/pushContent'
import { fetchCategory, fetchLabel } from '@/api/category'
import Pagination from '@/components/Pagination'
// import quillConfig from './quill-config.js'

export default {
  name: 'PushContent',
  components: { Pagination },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
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
      listCategory: [],
      listLabel: [],
      listArr: {
        data: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: 'all',
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
        isUrl: false,
        url: '',
        content: ''
      },
      rules: {
        tagId: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        title: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { min: 3, max: 2000, message: '长度在 3 到 2000个字符', trigger: 'blur' }
        ]
      },
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
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.getList()
    this.getCategory()
    this.getLabel()
  },
  methods: {
    addArg() {
      console.log('addArg...')
    },
    openMenu(e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 60 // fix 位置bug
      this.visible = true
    },
    closeMenu() {
      this.visible = false
    },
    handleRuleDelete(row) {
      const index = this.temp.rules.indexOf(row)
      this.temp.rules.splice(index, 1)
    },
    getCategory() {
      fetchCategory(this.listArr.listQuery).then(response => {
        this.listCategory = response.data.items
      })
    },
    getLabel() {
      fetchLabel({ categoryTitle: '内容推送' }).then(response => {
        this.listLabel = response.data.items
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

    resetTemp() {
      this.isSubhead = false
      this.isUrl = false
      this.temp = {
        id: undefined,
        tag: '',
        category: '',
        title: '',
        subhead: '',
        isUrl: false,
        url: '',
        content: ''
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
          console.log(this.temp)
          this.temp.categoryTitle = '内容推送'
          this.temp.category = '内容推送'
          this.temp.tag = this.listLabel.find(item => item.id === this.temp.tagId).title
          this.temp.status = 'pro_examine'
          this.temp.contentType = 'content'
          create(this.temp).then(() => {
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

    handleUpdate(row, opt) {
      detail({ id: row.id }).then((res) => {
        this.dialogStatus = opt || 'update'
        this.temp = res.data

        this.isSubhead = !!row.subhead
        this.isUrl = !!this.url

        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)

          tempData.contentType = 'content'
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

<style lang="scss">
.ql-editor{
  height: 200px;
}
  .contextmenu{
    position: absolute;
    cursor: pointer;
    border: 1px solid #d4d4d4;
    box-shadow: 3px 3px 5px #888888;
    background: white;
    z-index: 9999;
    padding: 5px;
    p{
      margin: 0;
      font-size: 14px;
    }
  }
</style>
