<template>
  <div>
    <div
      v-for="(path, index) in data"
      :key="path.key"
    >
      <el-form-item
        :prop="'paths.' + index + '.value'"
        :rules="{
          required: true, message: '路径不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="path.value" placeholder="输入路径地址" class="dy_path">
          <template slot="prepend">路径 {{ index }}</template>
          <el-button v-if="data.length > 1" slot="append" icon="el-icon-delete" @click.prevent="removePath(path)" />
        </el-input>
      </el-form-item>

      <el-row>
        <el-col :span="6">
          上传JSON文件：
        </el-col>
        <el-col :span="18">
          <el-upload
            action="http://rap2api.taobao.org/app/mock/data/1435500"
            :on-success="(res,file)=>{return handleSuccess(res,file,path)}"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>

        </el-col>
      </el-row>

    </div>

    <el-button @click="addPath">+添加路径</el-button>

  </div>
</template>

<script>

export default {
  name: 'DynamicInput',
  props: {
    data: {
      required: true,
      type: Array
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {
    console.log(this.data)
  },
  methods: {
    handleSuccess(file, fileList, path) {
      path.fileUrl = file.url
    },
    removePath(item) {
      var index = this.data.indexOf(item)
      if (index !== -1) {
        this.data.splice(index, 1)
      }
    },
    addPath() {
      this.data.push({
        value: '',
        key: Date.now()
      })
      console.log(this.temp)
    }
  }
}
</script>

<style lang="scss" scoped>
  .dy_path{
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .dy_arg{
    width: 190px;
    margin-right: 10px;
    margin-top: 20px;
  }

</style>
