<template>
  <div class="warp">

    <el-row>
      <el-col :span="4">
        <el-popover
          v-model="visible"
          placement="bottom"
          title="推送字段"
          trigger="click"
          style="background: white"
        >
          <div class="panel">

            <el-row class="btnArea" :class="showAll?'show-all':'show-part'">
              <el-button v-for="tag in options" :key="tag.id" size="mini" @click="insertText(tag.pathTitle)">{{ tag.pathTitle }}</el-button>
              <el-button round size="small" class="toggle" :icon="showAll?'el-icon-arrow-up':'el-icon-arrow-down'" circle @click="showAll = !showAll" />
            </el-row>
            <el-row>

              <label for="textarea" />
              <textarea
                id="textarea"
                ref="editor"
                v-model="value"
                autocomplete="off"
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                style="width: 100%"
              />

            </el-row>

            <div class="btn">
              <el-button @click="visible = false">
                取消
              </el-button>
              <el-button type="primary" @click="updateValue">
                确定
              </el-button>
            </div>

          </div>

          <el-button slot="reference" @click=" value = parentValue ">{{ text }}</el-button>

        </el-popover>
      </el-col>
      <el-col v-if="read" :span="20">
        <el-input
          v-model="parentValue"
          type="textarea"
          autosize
          placeholder="请输入内容"
        />
      </el-col>
      <el-col v-if="!read" :span="20">
        {{ parentValue }}
      </el-col>
    </el-row>

  </div>
</template>

<script>

export default {
  name: 'Args',
  props: {
    options: {
      required: true,
      type: Array
    },
    text: {
      required: true,
      type: String
    },
    read: {
      type: Boolean,
      default() {
        return false
      }
    },
    parentValue: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      visible: false,
      showAll: false,
      value: ''
    }
  },
  computed: {},
  watch: {
    /*    value: {
      handler(val) {
        this.$emit('update:parentValue', val)
      },
      deep: true
    },*/
    parentValue: {
      handler(val) {
        this.value = val
      },
      deep: true
    }
  },
  created() {
    // console.log('created...')
  },
  methods: {
    updateValue() {
      console.log('updateValue...')
      this.$emit('update:parentValue', this.value)
      this.visible = false
    },
    async insertText(mark) {
      mark = '{ ' + mark + ' }'
      const myField = this.$refs.editor

      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.value = myField.value.substring(0, startPos) + mark + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()
        myField.setSelectionRange(endPos + mark.length, endPos + mark.length)
      } else {
        this.value += mark
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.warp{
  border: 1px solid #c8c8c8;
  padding: 5px;
}
  .panel{
    background: white;
    width: 700px;
    .el-button{
      margin: 3px 5px ;
    }
    .btn{
      text-align: right;
    }
  }
  .show-part{
    height: 105px;
    overflow: hidden;
  }
  .toggle{
    bottom: 5px;
    right: 0;
    position: absolute;
  }
</style>
