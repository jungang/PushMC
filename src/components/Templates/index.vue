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
          <div v-if="step===1" class="preview">
            <div class="top">
              <Args :options="options" :parent-value.sync="tmp.msgTitle" />
            </div>

            <!--            $store.state.publicData.model.nginxPath -->
            <!--            http://39.98.167.246:9910/offlinefile/-->
            <!--            http://rap2api.taobao.org/app/mock/241291/dev-api/source/upload-->
            <!--            http://39.98.167.246:9910/smartpush/rest/common/upload-->
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
              <img :src="tmp.cover" alt="">
            </div>

            <el-row>
              <Args :options="options" :parent-value.sync="tmp.digest" />
            </el-row>

            <div class="url">
              +URL <br>
              <el-input v-model="tmp.templateURL" placeholder="+推送URL" />
            </div>
          </div>
          <div v-if="step===2" class="preview">

            <Args :options="options" :parent-value.sync="tmp.arg1" />
            <Args :options="options" :parent-value.sync="tmp.arg2" />
            <Args :options="options" :parent-value.sync="tmp.arg3" />
            <Args :options="options" :parent-value.sync="tmp.arg4" />

          </div>

        </el-col>
      </el-row>
      <el-row style="width: 400px; text-align: right; margin-top: 10px">
        <el-button :disabled="step===1" @click="step=1">上一步</el-button>
        <el-button :disabled="step===2" @click="step=2">下一步</el-button>
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

  </div>
</template>

<script>

import Args from '@/components/args'

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
      argVisible: false,
      showAll: false,
      step: 1
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
    tmp(val) {
      this.step = 1
      // this.thisTemplate = val
    }
    // thisTemplate(val) {
    //   this.$emit('update:template', val)
    // }
  },
  created() {
    console.log(this.$store.state.publicData.model.nginxPath)
  },
  methods: {
    toggle() {
      console.log('toggle...')
    },
    async insertText(mark) {
      mark = '{ ' + mark + ' }'
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
      this.tmp.cover = res.data
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
