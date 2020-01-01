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
          <el-button slot="append" v-if="data.length > 1" icon="el-icon-delete" @click.prevent="removePath(path)" />
        </el-input>
      </el-form-item>

      <el-form-item
        v-for="(arg, index2) in path.args"
        :key="arg.key"
        :prop="'paths.' + index + '.args.' + index2 + '.value'"
        :rules="{
          required: true, message: '参数不能为空', trigger: 'blur'
        }"
      >
        <el-input
          v-model="arg.value"
          placeholder="参数"
          size="mini"
          class="dy_arg"
        >
          <el-button slot="append" v-if="path.args.length > 1" icon="el-icon-delete" @click.prevent="removeArg( path.args, index2)" />
        </el-input>
      </el-form-item>

      <el-button size="mini" @click="addArg(path)">+参数</el-button>

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
  computed: {},
  created() {
    console.log(this.data)
  },
  methods: {
    removePath(item) {
      var index = this.data.indexOf(item)
      if (index !== -1) {
        this.data.splice(index, 1)
      }
    },
    removeArg(args, index) {
      console.log(index)
      // var index = this.data.indexOf(item)
      if (index !== -1) {
        args.splice(index, 1)
      }
    },
    addPath() {
      this.data.push({
        value: '',
        key: Date.now(),
        args: [
          {
            value: '',
            key: Date.now()
          }
        ]
      })
      console.log(this.temp)
    },
    addArg(path) {
      console.log(path)
      path.args.push({
        value: '',
        key: Date.now()
      })
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
