<template>
  <div>
    <el-form-item label="消息模版" prop="templateType">
      <el-radio v-model="tmp.templateType" label="template"> 图文消息 </el-radio>
      <el-radio v-model="tmp.templateType" label="text"> 文本消息 </el-radio>
    </el-form-item>
    <el-form-item label="模板名称" prop="title">
      <el-input v-model="tmp.title" style="width:400px" />
    </el-form-item>

    <el-form-item v-if="tmp.templateType==='template'" label="">
      <el-row>
        <el-col>
          <div v-if="step===1" class="preview" style="width: 90%">
            <div class="top">
              <Args :options="options" text="+题目" :parent-value.sync="tmp.msgTitle" />
            </div>

            <div class="img">
              <el-upload
                class="uploader"
                action="/smartpush3/rest/common/upload"
                name="upfile"
                :show-file-list="false"
                :on-success="handleSuccess"
              >
                <el-button size="small" type="primary" class="btn">点击上传图片</el-button>
              </el-upload>
              <img :src="tmp.cover || 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943'" alt="">
            </div>

            <el-row>
              <Args :options="options" text="+概述" :parent-value.sync="tmp.digest" />
            </el-row>
          </div>
          <div v-if="step===2" class="preview" style="width: 90%">

            <el-row>
              <el-radio v-model="tmp.pageIsUrl" :label="true">引用URL</el-radio>
              <el-input
                v-model="tmp.pageUrl"
                :disabled="tmp.pageIsUrl !== true"
                placeholder="请输入url"
                style="width: 300px"
                @blur="inputUrlBlur"
              />
              <span v-if="urlError" style="color: red">URL输入错误</span>
            </el-row>
            <el-row>
              <el-radio v-model="tmp.pageIsUrl" :label="false">自定义</el-radio>
            </el-row>

            <el-row>

              <Args :options="options" text="标题" read :parent-value.sync="tmp.pageTitle" />
              <Args :options="options" text="副标题" read :parent-value.sync="tmp.pageSubhead" />

            </el-row>

            <el-row>
              <el-form-item label="正文" prop="content" style="height: 300px">
                <quill-editor
                  ref="myQuillEditor"
                  v-model="tmp.pageContent"
                  :options="editorOption"
                  style="height: 250px"
                />
              </el-form-item>
            </el-row>
          </div>

        </el-col>
      </el-row>
      <el-row style="width: 400px; text-align: right; margin-top: 10px">
        <el-button :disabled="step===1" @click="step=1">上一步</el-button>
        <el-button :disabled="step===2" @click="next">下一步</el-button>
      </el-row>
    </el-form-item>

    <el-row v-if="tmp.templateType==='text'">
      <el-form-item label="可选字段" prop="可选字段">
        <el-row class="btnArea" :class="showAll?'show-all':'show-part'">
          <el-button v-for="tag in options" :key="tag.id" size="mini" @click="insertText(tag.pathTitle)">{{ tag.pathTitle }}</el-button>

          <el-button round size="small" class="toggle" :icon="showAll?'el-icon-arrow-up':'el-icon-arrow-down'" circle @click="showAll = !showAll" />
        </el-row>
      </el-form-item>

      <el-form-item label="模板">
        <label for="textarea" />
        <textarea
          id="textarea"
          ref="editor"
          v-model="tmp.content"
          autocomplete="off"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          style="width: 100%"
        />
      </el-form-item>

    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      top="30vh"
      width="30%"
      append-to-body
      :modal="false"
      :show-close="false"
      :before-close="handleClose"
    >

      <el-row>

        <el-button v-for="tag in options" :key="tag.id" size="mini" @click="quillInsertText(tag.pathTitle)">{{ tag.pathTitle }}</el-button>

      </el-row>
    </el-dialog>
  </div>
</template>

<script>

import Args from '@/components/args'
import { validURL } from '@/utils/validate'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  // ['blockquote', 'code-block'], // 引用  代码块
  // [{ header: 1 }, { header: 2 }], // 1、2 级标题
  // [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  // [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  // [{ indent: '-1' }, { indent: '+1' }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  // [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  // [{ font: [] }], // 字体种类
  // [{ align: [] }], // 对齐方式
  // ['clean'], // 清除文本格式
  ['image'], // 链接、图片、视频
  ['link'] // 链接、图片、视频
]

export default {
  name: 'Templates',
  components: { Args },
  props: {
    tmp: {
      required: true,
      type: Object
    },
    tables: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      urlError: false,
      argVisible: false,
      dialogVisible: false,
      showAll: false,
      step: 1,
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '请输入正文内容',
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              link: this.editorAction
            }
          }
        }
      }}
  },
  computed: {
    options: function() {
      let opts = []
      this.tables.forEach(item => {
        opts = [...opts, ...item.smColumns]
      })
      console.log(opts)
      return opts
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    tmp(val) {
      // this.step = 1
      // this.thisTemplate = val
    }
    // thisTemplate(val) {
    //   this.$emit('update:template', val)
    // }
  },
  mounted() {
  },
  created() {
    console.log(this.$store.state.publicData.model.nginxPath)
  },
  methods: {
    inputUrlBlur() {
      this.urlError = !validURL(this.tmp.pageUrl)
      return this.urlError
    },
    handleClose() {
      console.log('handleClose...')
      this.dialogVisible = false
    },
    next() {
      this.step = 2
      setTimeout(function() {
        console.log('next...')
        console.log(document.querySelector('.ql-link'))
        const el = document.querySelector('.ql-link')
        const text = document.createTextNode('插入字段')
        el.appendChild(text)
        el.style.width = '100px'
      }, 0)
    },
    editorAction() {
      console.log('editorAction.')
      this.dialogVisible = true
    },

    toggle() {
      console.log('toggle...')
    },
    async insertText(mark) {
      mark = '{{ ' + mark + ' }}'
      // const myField = document.querySelector('#textarea');
      const myField = this.$refs.editor
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.tmp.content = myField.value.substring(0, startPos) + mark +
                myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()
        myField.setSelectionRange(endPos + mark.length, endPos + mark.length)
      } else {
        this.tmp.content += mark
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
    async quillInsertText(mark) {
      console.log(mark)
      mark = '{{ ' + mark + ' }}'
      const myField = this.$refs.myQuillEditor.quill.selection
      const index = myField.savedRange.index
      this.$refs.myQuillEditor.quill.insertText(index, mark)
    },

    handleSuccess(res, file) {
      this.tmp.cover = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row{
    margin-bottom: 10px;
  }
  .el-form-item{
    margin-bottom: 10px;
  }

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

  .show-part{
    height: 120px;
    overflow: hidden;
  }
  .toggle{
    bottom: 5px;
    right: 0;
    position: absolute;
  }
  .ql-editor{
    height:400px;
  }
</style>
