<template>
    <div>
        <row>
            <i-col style="margin-top:50px;" :md="{ span: 24 }" :lg="{ span: 11 }">
                <div class="depOpe">
                    <Button type="primary" @click="openDep('添加部门')">添加部门</Button>
                </div>
                <div class="depList">
                    <i-table :data='depList' :highlight-row='true' @on-row-click='getCurrentMenber' :columns='depColumns'></i-table>
                </div>
            </i-col>
            <i-col style="margin-top:50px;" :md="{ span: 24 }" :lg="{ span: 11,offset:1}">
                <div class="depOpe">
                    <Button type="primary" @click="openMenber('添加人员','',true)">添加人员</Button>
                </div>
                <div class="depList">
                    <i-table :data='menberList' :columns='menberColumns'></i-table>
                </div>
            </i-col>
        </row>
        <Modal v-model="removeModal" :title="depTitle" @on-ok="removeOk()" @on-cancel="removeCancel()">
            <row>
                <i-col span='24' style="line-height:32px;font-size:16px;text-align:center;">
                    是否删除
                    <span style="color:red;">{{removeText}}</span>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="depModal" :title="depTitle" @on-ok="depOk()" @on-cancel="depCancel()">
            <row>
                <i-col span='4' style="line-height:32px;">
                    部门名称
                </i-col>
                <i-col span='20'>
                    <i-input v-model="depName"></i-input>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="menberModal" :loading="loading" :title="menberTitle">
            <row style="margin-bottom:20px;">
                <i-col span='4'>
                    人员名称
                </i-col>
                <i-col span='20'>
                    <i-input v-model="menberData.name"></i-input>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col span='4'>
                    用户名
                </i-col>
                <i-col span='20'>
                    <i-input v-model="menberData.username"></i-input>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col span='4'>
                    部门
                </i-col>
                <i-col span='20'>
                    <Select v-model="menberData.dep_id" style="width:200px">
                        <Option v-for="item in allDep" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col span='4'>
                    角色
                </i-col>
                <i-col span='20'>
                    <Select v-model="menberData.role_id" style="width:200px">
                        <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col span='4'>
                    电话
                </i-col>
                <i-col span='20'>
                    <i-input v-model="menberData.phone"></i-input>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col span='4'>
                    密码
                </i-col>
                <i-col span='20'>
                    <i-input type='password' v-model="menberData.password"></i-input>
                </i-col>
            </row>
            <div slot="footer">
              <row>
                <i-col span='3' offset='18'>
                  <Button @click="menberCancel()">取消</Button>
                </i-col>
                <i-col span='3'>
                  <Button type="primary" @click="menberOk()">确认</Button>
                </i-col>
              </row>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
  data() {
    return {
      loading:false,
      removeText: "",
      removeModal: false,
      removeNum: "",
      removeId: "",
      depModal: false,
      depTitle: "",
      depName: "",
      isNewDep: false,

      depId: "",
      menberModal: false,
      menberTitle: "",
      isNewMenber: false,

      menberId: "",
      menberData: {
        id: "",
        name: "",
        dep_id: "",
        role_id: "",
        phone: "",
        username: "",
        password:""
      },
      depColumns: [
        {
          title: "部门ID",
          key: "id",
          width: 80
        },
        {
          title: "部门名称",
          key: "name",
          align: "center"
        },
        {
          title: "操作",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  attrs: {
                    style: "margin-right:10px"
                  },
                  nativeOn: {
                    click: () => {
                      this.openDep("编辑部门", params.row);
                      this.depName = params.row.name;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  nativeOn: {
                    click: () => {
                      if (params.row.members.length > 0) {
                        this.$Message.error("部门内有成员，无法删除");
                      } else {
                        //删除部门
                        this.removeModal = true;
                        this.removeText = params.row.name;
                        this.removeNum = 1;
                        this.removeId = params.row.id;
                      }
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      allDep: [],
      depList: [
        {
          dep_id: "1",
          name: "开发部",
          menbers: [
            {
              id: "1",
              name: "张三",
              dep_id: "1",
              role_id: "1",
              email: "1131@qq.com",
              phone: "4653613251361",
              username: "小张"
            },
            {
              id: "3",
              name: "李四",
              dep_id: "1",
              role_id: "1",
              email: "11321@qq.com",
              phone: "1331331313131",
              username: "里古拉斯·赵四"
            }
          ]
        },
        {
          dep_id: "2",
          name: "销售部",
          menbers: [
            {
              id: "4",
              name: "王五",
              dep_id: "2",
              role_id: "1",
              email: "22221@qq.com",
              phone: "4653613251361",
              username: "老王"
            },
            {
              id: "5",
              name: "刘六",
              dep_id: "2",
              role_id: "1",
              email: "412@qq.com",
              phone: "5315131",
              username: "大顺子"
            }
          ]
        }
      ],
      roleList: [],
      menberList: [],
      menberColumns: [
        {
          title: "姓名",
          key: "name",
          width: 80
        },
        {
          title: "部门",
          width: 80,
          render: (h, params) => {
            return h(
              "p",
              {
                style: {
                  color: "#ed4014"
                }
              },
              params.row.depname
            );
          }
        },
        {
          title: "用户名",
          key: "username",
          width: 200
        },
        {
          title: "操作",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  attrs: {
                    style: "margin-right:10px"
                  },
                  nativeOn: {
                    click: () => {
                      this.openMenber("编辑人员", params.row.id);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  nativeOn: {
                    click: () => {
                      //删除人员
                      this.removeModal = true;
                      this.removeText = params.row.name;
                      this.removeNum = 2;
                      this.removeId = params.row.id;
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    //获取组织资料
    getAllData() {
      axios
        .request({
          method: "GET",
          url: "departments/all",
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          this.depList = res.data;
          axios
            .request({
              method: "GET",
              url: "departments",
              headers: {
                "Content-type": "application/x-www-form-urlencoded"
              }
            })
            .then(res => {
              this.allDep = res.data;
            });
        });
    },
    getRoleList() {
      axios
        .request({
          method: "GET",
          url: "role",
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          this.roleList = res.data;
        });
    },
    getCurrentMenber(data) {
      for (let i = 0; i < data.members.length; i++) {
        data.members[i].depname = data.name;
      }
      this.menberList = data.members;
    },
    openDep(titleText, index = "") {
      this.depModal = true;
      this.depTitle = titleText;
      if (titleText == "添加部门") {
        this.isNewDep = true;
      } else {
        this.depId = index.id;
        this.isNewDep = false;
      }
    },

    depOk() {
      if (this.depName === "") {
        this.$Message.error("部门名字不能为空");
        return false;
      }
      if (this.isNewDep) {
        //新建部门
        axios
          .request({
            url: "/departments",
            method: "post",
            data: {
              name: this.depName
            }
          })
          .then(res => {
            this.getAllData();
          });
      } else {
        //修改部门
        axios
          .request({
            url: "/departments/" + this.depId,
            method: "put",
            data: {
              name: this.depName
            }
          })
          .then(res => {
            this.getAllData();
          });
      }
    },
    depCancel() {
      this.depName = "";
    },

    openMenber(titleText, id, isNew) {
      this.menberModal = true;
      this.menberTitle = titleText;
      this.menberId = id;
      this.menberData.password = ''
      if (isNew) {
        this.isNewMenber = true;
      } else {
        this.isNewMenber = false;
        for (let i = 0; i < this.menberList.length; i++) {
          if (this.menberList[i].id == id) {
            this.menberData = JSON.parse(JSON.stringify(this.menberList[i]));
          }
        }
      }
    },
    /*
     menberData: {
        id: "",
        name: "",
        dep_id: "",
        role_id: "",
        email: "",
        phone: "",
        username: ""
      },
    */
    menberOk() {
      if (
        this.menberData.name === "" ||
        this.menberData.dep_id === "" ||
        this.menberData.role_id === "" ||
        // this.menberData.phone === "" ||
        this.menberData.username === ""
      ) {
        this.$Message.error("资料不完整");
        return false;
      }
      if(this.isNewMenber){
        if(this.menberData.password === undefined || this.menberData.password.length<6){
          this.$Message.error("密码必须大于6位");
          return false;
        }
      }else{
        if(this.menberData.password !== undefined && this.menberData.password.length<6){
          this.$Message.error("密码必须大于6位");
          return false;
        }
      }
      if (this.isNewMenber) {
        //新建人员
        axios
          .request({
            url: "/members",
            method: "post",
            data: {
              name: this.menberData.name,
              dep_id: this.menberData.dep_id,
              role_id: this.menberData.role_id,
              phone: this.menberData.phone,
              username: this.menberData.username,
              password: this.menberData.password
            }
          })
          .then(res => {
            if(res.data.code === 1){
              this.$Message.error("账户名设置重复");
              return false
            }
            this.menberData = {
              id: "",
              name: "",
              dep_id: "",
              role_id: "",
              phone: "",
              username: "",
              password:''
            };
            this.menberList = []
            this.menberModal = false
            this.getAllData();
            this.getRoleList();
          });
      } else {
        //修改人员
        /*
        name：'',
                dep_id：'',
                role_id：'',
                phone：'',
                username：'',
                password：'' */
        axios
          .request({
            url: "/members/" + this.menberId,
            method: "put",
            data: {
              name: this.menberData.name,
              dep_id: this.menberData.dep_id,
              role_id: this.menberData.role_id,
              phone: this.menberData.phone,
              username: this.menberData.username,
              password: this.menberData.password
            }
          })
          .then(res => {
            if(res.data.code === 1){
              this.$Message.error("账户名设置重复");
              return false
            }
            this.menberData = {
              id: "",
              name: "",
              dep_id: "",
              role_id: "",
              phone: "",
              username: "",
              password:''
            };
            this.menberList = [];
            
            this.menberModal = false
            this.getAllData();
            this.getRoleList();
          });
      }
    },
    menberCancel() {
      this.menberModal = false
      this.menberData = {
        id: "",
        name: "",
        dep_id: "",
        role_id: "",
        // email: "",
        phone: "",
        username: "",
        password: ""
      };
    },
    //统一删除
    removeOk() {
      //i  =  1为部门， 2 为人员
      if (this.removeNum === 1) {
        // 删除部门
        axios
          .request({
            url: "/departments/" + this.removeId,
            method: "delete"
          })
          .then(res => {
            this.getAllData();
          });
      } else {
        //删除人员
        axios
          .request({
            url: "/members/destroy",
            method: "post",
            data: {
              ids: [this.removeId]
            }
          })
          .then(res => {
            this.getAllData();
            
            this.menberList = [];
          });
      }
    },
    removeCancel() {}
  },
  mounted() {
    this.getAllData();
    this.getRoleList();
  }
};
</script>

<style>
.depOpe {
  width: 100%;
  height: 50px;
}
.depList {
  width: 100%;
}
</style>