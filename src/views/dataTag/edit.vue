<template>
  <div class="container">

    <el-row :gutter="20">
      <el-col :span="6">
        <el-table
          ref="singleTable"
          :key="businessTableKey"
          :data="listArr"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            property="title"
            label="数据表列表"
          />
        </el-table>
      </el-col>
      <el-col :span="18">
        <div v-if="transfer.length > 0" style="text-align: center">
          <XcomTagTransfer
            ref="transfer"
            v-model="value"
            type="dataTag"
            :prefix="currentRow.prefix"
            class="main-transfer"
            style="text-align: left; display: inline-block"
            :titles="['属性字段', '标注结果']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :props="{
              key: 'id',
              label: 'title'
            }"
            :data="transfer"
            @change="handleChange"
          >
            <span slot-scope="{ h, option }" style="display: block">
              {{ option.label }}

            </span>
            <!--            <el-button slot="left-footer" class="transfer-footer" size="small">操作</el-button>-->
            <!--            <el-button slot="right-footer" class="transfer-footer" size="small">操作</el-button>-->
          </XcomTagTransfer>

          <el-row style="margin-top: 20px">
            <router-link to="/data-tag/list"><el-button>取消</el-button></router-link>

            <el-button type="primary" @click="openDailog">保存并应用</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="保存并应用"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <p>数据源  <el-tag>{{ saveQuery.title }} </el-tag>中</p>
      <p> 共有业务数据信息项 <el-tag>{{ saveQuery.sourceData.length + saveQuery.targetData.length }}  </el-tag> 项，
        共打标签<el-tag> {{ saveQuery.targetData.length }} </el-tag>个，
        剩余<el-tag> {{ saveQuery.sourceData.length }} </el-tag>个未打</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { fetchList, fetchPv, createSource, updateSource, changeStatus } from '@/api/source'
import waves from '@/directive/waves' // waves directive
import { deepClone } from '@/utils/index.js'
import XcomTagTransfer from '@/components/tagTransfer/index'
import { saveTag } from '@/api/dataTag' // waves directive

export default {
  name: 'Edit',
  components: { XcomTagTransfer },
  directives: { waves },
  data() {
    return {
      dialogVisible: false,
      businessTableKey: 0,
      currentRow: {
        title: ''
      },
      listArr: [],
      transfer: [],
      value: [],
      listLoading: true,
      dialogStatus: '',
      saveQuery: {
        sourceData: [],
        targetData: [],
        prefix: '',
        title: ''
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
    this.listArr = this.$route.params.paths
    console.log(this.listArr)
  },
  methods: {
    openDailog() {
      this.saveQuery = this.$refs.transfer.getQuery()
      this.saveQuery.title = this.currentRow.title
      this.dialogVisible = true
    },
    handleSave() {
      this.listLoading = true
      this.currentRow.prefix = this.saveQuery.prefix

      console.log(this.saveQuery)
      this.saveQuery.targetData.forEach(item => {
        const index = this.currentRow.smColumns.findIndex((t, i, arr) => t.id === item.id)
        console.log(item)
        this.currentRow.smColumns[index].column = item.column
      })
      saveTag([this.currentRow]).then(res => {
        this.listLoading = false
        this.$notify({
          title: '完成',
          message: '保存完成',
          type: 'success',
          duration: 2000
        })
      })

      this.dialogVisible = false
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      if (val) {
        this.transfer = deepClone(val.smColumns)
        this.currentRow = val
        console.log(this.currentRow)
      } else {
        console.log('handleCurrentChange...')
      }

      this.value = []
      this.transfer.forEach(item => {
        if (item.column !== item.title) {
          this.value.push(item.id)
        }
      })
    },
    handleChange(value, direction, movedKeys) {
      console.log(this.$refs.transfer.setQuery())
    }
  }

}
</script>

<style lang="scss" scoped>
.main-transfer{
  min-width: 840px;
}
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }

</style>
