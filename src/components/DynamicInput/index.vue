<template>
  <div>

    <el-button type="text" size="mini" @click="addPathDialog">
      +添加数据表
    </el-button>

    <el-table
      :key="tableKey"
      :data="data"
      border
      size="mini"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="名称" prop="title" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="value" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>

      <el-table-column label="描述" prop="describe" align="center">
        <template slot-scope="row">
          <el-button type="text" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="text" @click="removePath(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      top="250px"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-form ref="ruleForm" :rules="rules" :model="temp" label-position="right" label-width="150px" class="main-form">

        <el-form-item label="名称" prop="title">
          <el-input v-model="temp.title" style="width:400px" />
        </el-form-item>
        <el-form-item v-if="type === 'API'" label="路径" prop="path">
          <el-input v-model="temp.path" style="width:400px" />
        </el-form-item>

        <el-form-item :label="type==='API'?'报文格式描述':'数据格式描述'" prop="value">
          <el-input
            v-model="temp.value"
            :autosize="{ minRows: 10, maxRows: 10}"
            type="textarea"
            style="width: 400px"
            placeholder="请输入内容"
          />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addPath():updatePath()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'DynamicInput',
  props: {
    data: {
      required: true,
      type: Array
    },
    type: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      tableKey: 1,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      currentRow: {},
      currentIndex: 0,
      temp: {
        title: '',
        path: '',
        value: ''
      },
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {
    // console.log(this.data)
  },
  methods: {
    resetTemp() {
      this.temp = {
        title: '',
        path: '',
        value: ''
      }
    },
    handleUpdate(row) {
      this.temp = { ...row.row }
      this.currenIndex = row.$index
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    updatePath() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.data.splice(this.currenIndex, 1, this.temp)
          this.dialogVisible = false
        }
      })
    },
    addPathDialog() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    addPath() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          valid && this.data.push({ ...this.temp })
          this.dialogVisible = false
        }
      })
    },
    handleSuccess(file, fileList, path) {
      path.fileUrl = file.url
    },
    removePath(row) {
      this.data.splice(row.index, 1)
      /*      var index = this.data.indexOf(item)
      if (index !== -1) {
        this.data.splice(index, 1)
      }*/
    }
  }
}
</script>

<style lang="scss" scoped>
  .dy_path{
    margin-bottom: 10px;
    margin-top: 0px;
  }
  .dy_arg{
    width: 190px;
    margin-right: 10px;
    margin-top: 20px;
  }

</style>
