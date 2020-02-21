<template>
  <div>
    <el-tabs v-model="tabTo" type="card">
      <el-tab-pane label="按组织结构" name="department">

        <el-row>
          <el-col :span="12">

            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
            />

            <el-tree
              ref="tree"
              :data="departmentData"
              class="department-tree"
              :props="defaultProps"
              node-key="id"
              show-checkbox
              default-expand-all
              :filter-node-method="filterNode"
              highlight-current
              @check-change="handleChangeCheck"
              @check="handleCheck"
            />

          </el-col>
          <el-col :span="12" class="checkZone">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedPerson" @change="handlecheckedPersonChange">
              <el-checkbox v-for="person in plaza" :key="person.id" :label="person">{{ person.name }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="按人员" name="personnel">
        <el-row style="margin-bottom: 10px">
          <el-col>
            按人员姓名查找：<el-input v-model="personsArr.listQuery.keyword" placeholder="输入人员姓名，多个人员以 ，逗号间隔，录入王磊 , 李刚" clearable style="width: 400px" />
            <el-button type="primary" icon="el-icon-search" style="width: 100px" @click="handleSearchPersons">查询</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-table
            ref="multipleTable"
            :key="Math.random()"
            v-loading="listLoading"
            :data="personsArr.items"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="35"
            />

            <el-table-column label="姓名" align="center" min-width="30">
              <template slot-scope="{row}">
                <span>{{ row.truename }}</span>
              </template>
            </el-table-column>

            <el-table-column label="地区" prop="area" align="center" min-width="50">
              <template slot-scope="{row}">
                <span>{{ row.area }}</span>
              </template>
            </el-table-column>

            <el-table-column label="组织" align="center" min-width="50">
              <template slot-scope="{row}">
                <span>{{ row.sourcefrom }}</span>
              </template>
            </el-table-column>

            <el-table-column label="职务" align="center" min-width="50">
              <template slot-scope="{row}">
                <span>{{ row.duty }}</span>
              </template>
            </el-table-column>

            <el-table-column label="电话" align="center" min-width="50">
              <template slot-scope="{row}">
                <span>{{ row.telphone }}</span>
              </template>
            </el-table-column>

          </el-table>
          <pagination
            v-show="personsArr.total>0"
            hide-on-single-page
            small
            :total="personsArr.total"
            :page.sync="personsArr.listQuery.page"
            :limit.sync="personsArr.listQuery.limit"
            @pagination="getPersonsList()"
          />
        </el-row>

      </el-tab-pane>
    </el-tabs>

    <el-row type="flex" justify="end">
      <el-col :span="6">
        <el-button @click="addPersons">
          加入已选择
        </el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-form-item label="已选人员" prop="persons">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag.id"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.name || tag.truename }}
        </el-tag>
      </el-form-item>

    </el-row>

  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { department, searchPersons } from '@/api/common'

export default {
  name: 'PickPersons',
  components: { Pagination },
  props: {
    data: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      tableKey2: 0,
      tabTo: 'department',
      filterText: '',
      departmentData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isIndeterminate: true,
      checkAll: false,
      checkedPerson: [],
      multipleSelection: [],
      plaza: [],
      listLoading: false,
      dynamicTags: [],
      personsArr: {
        items: [],
        total: 0,
        listQuery: {
          keyword: '',
          page: 1,
          limit: 10
        }
      }
    }
  },
  computed: {

  },
  watch: {
    data(val) {
      this.init(val)
    }
  },
  async created() {
    await this.getDepartmentData()
  },
  mounted() {
    this.dynamicTags = this.data
  },
  methods: {
    init(val) {
      this.dynamicTags = val
      this.plaza = []
      this.personsArr.items = []
      this.personsArr.total = 0
      this.tabTo = 'department'
      this.$refs.tree.setCheckedKeys([])
    },

    getPersonsList() {
      searchPersons(this.personsArr.listQuery).then(res => {
        this.personsArr.items = res.data.items
        this.personsArr.total = res.data.total
      })
    },
    async getDepartmentData() {
      await department({ domain: 'xykj' }).then(response => {
        // console.log('format..')
        this.departmentData = this.format(response.data)
      })
    },
    format(data) {
      const resData = this.recursive(data)
      // console.log('resData--', resData)
      return resData
    },
    recursive(arr) {
      arr.forEach(item => {
        item.label = item.deptname || item.departname
        item.id = item.pathid

        if (item.hasOwnProperty('personnel')) {
          item.persons = item.personnel.items
          item.persons.forEach(item => {
            item.name = item.truename
            // console.log(item)
          })
        }

        if (item.hasOwnProperty('children')) {
          item.children = item.children.items
          this.recursive(item.children)
        }
      })

      return arr
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    handleChangeCheck(arg, status, arg3) {
      console.log('handleChangeCheck...')
      this.treePersons = []
    },
    handleCheck(status, nodes) {
      nodes.checkedNodes.forEach((item) => {
        if (item.hasOwnProperty('persons')) {
          item.persons.forEach((person) => {
            this.treePersons.push(person)
          })
        } else {
          console.log('node not has any person')
        }
      })
      console.log(this.plaza.length)
      this.plaza = this.treePersons
      this.checkedPerson = this.treePersons
    },
    handleCheckAllChange(val) {
      this.checkedPerson = val ? this.plaza : []
      this.isIndeterminate = false
    },
    handlecheckedPersonChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.plaza.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.plaza.length
    },
    handleSearchPersons() {
      this.personsArr.listQuery.page = 1
      this.getPersonsList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    addPersons() {
      this.dynamicTags = this.dynamicTags.concat(this.plaza)
      this.dynamicTags = this.dynamicTags.concat(this.multipleSelection)

      this.dynamicTags = Array.from(new Set(this.dynamicTags)) // 去重
    }
  }
}
</script>
<style lang="scss" scoped>
  .department-tree{
    height: 300px;
    overflow-y: scroll;
  }
  .checkZone{
    >label{
      margin-left: 10px;
    }
    .el-checkbox-group{
      padding: 10px;
      height: 300px;
      overflow-y: scroll;
    }
  }
</style>

