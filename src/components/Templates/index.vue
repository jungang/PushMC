<template>
  <div>

    <el-form-item label="消息模版" prop="templateType">
      <el-radio v-model="tmp.templateType" label="template"> 图文消息 </el-radio>
      <el-radio v-model="tmp.templateType" label="text"> 文本消息 </el-radio>
    </el-form-item>
    <el-form-item label="模板名称" prop="title">
      <el-input v-model="tmp.title" style="width:400px" />
    </el-form-item>

    <el-row v-if="tmp.templateType==='text'">
      <el-form-item label="可选字段" prop="可选字段">
        <el-row class="btnArea" :class="showAll?'show-all':'show-part'">
          <el-button v-for="tag in options" :key="tag.id" size="mini" @click="insertText(tag.pathTitle)">{{ tag.pathTitle }}</el-button>

          <el-button round size="small" class="toggle" :icon="showAll?'el-icon-arrow-up':'el-icon-arrow-down'" circle @click="showAll = !showAll" />
        </el-row>
      </el-form-item>

      <el-form-item label="模板">
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

    <el-form-item v-if="tmp.templateType==='template'" label="">
      <el-row>
        <el-col>

          <div class="preview">
            <div class="top">
              <el-select v-model="tmp.msgTitle" placeholder="+选择推送字段">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.pathTitle"
                  :value="item.path"
                />
              </el-select>
            </div>

            <div class="img">
              <el-upload
                class="uploader"
                action="http://rap2api.taobao.org/app/mock/241291/dev-api/source/upload"
                :show-file-list="false"
                :on-success="handleSuccess"
              >
                <el-button size="small" type="primary" class="btn">点击上传图片</el-button>
              </el-upload>
              <img :src="tmp.cover" alt="">
            </div>

            <el-row>
              <el-col :span="12">
                <el-select v-model="tmp.digest" placeholder="+选择推送字段">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.pathTitle"
                    :value="item.path"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="tmp.digest2" placeholder="+选择推送字段">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.pathTitle"
                    :value="item.path"
                  />
                </el-select>
              </el-col>
            </el-row>

            <div class="url">
              <el-input v-model="tmp.templateURL" placeholder="+推送URL" />
            </div>
          </div>

        </el-col>
      </el-row>
    </el-form-item>

    <!--    <el-row>
      <el-col align="right">
        <el-button size="mini" @click="previewVisible = true">查看预览</el-button>
      </el-col>
    </el-row>-->

    <el-dialog
      :id="`messageTemplatePreview`"
      width="30%"
      title="预览"
      :visible.sync="previewVisible"
      append-to-body
    >

      <div v-if="tmp.templateType!=='text'">
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

  </div>
</template>

<script>

export default {
  name: 'Templates',
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
      previewVisible: false,
      showAll: false
    }
  },
  computed: {
    options: function() {
      let opts = []
      this.tables.forEach(item => {
        opts = [...opts, ...item.smColumns]
      })
      console.log(opts)
      return opts
    }
  },
  watch: {
    template(val) {
      console.log(val)
      // this.thisTemplate = val
    }
    // thisTemplate(val) {
    //   this.$emit('update:template', val)
    // }
  },
  created() {
    console.log(this.tmp)
    console.log(this.tables)
  },
  methods: {
    toggle() {
      console.log('toggle...')
    },
    async insertText(mark) {
      mark = '{' + mark + '}'
      const myField = this.$refs.editor

      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.tmp.content = myField.value.substring(0, startPos) + mark + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()
        myField.setSelectionRange(endPos + mark.length, endPos + mark.length)
      } else {
        this.tmp.content += mark
      }
    },
    handleSuccess(res, file) {
      this.tmp.cover = res.url
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
