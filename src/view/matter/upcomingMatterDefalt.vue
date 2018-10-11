<template>
    <div style="background:#fff;padding:20px;min-width:1000px;">
        <row>
            <i-col style="height:45px;" :md="{ span: 24 }" :lg="{ span: 22,offset:2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">事项内容</span>
            </i-col>
            <i-col style="margin-top:50px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">拟稿人:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;font-size:16px;line-height:42px;color:' + dataColor">农业服务中心</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:50px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">标题:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;font-size:16px;border-bottom:1px solid #e7e7eb;line-height:42px;color:' + dataColor">{{defaltData.title}}</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">发文编号:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;font-size:16px;border-bottom:1px solid #e7e7eb;line-height:42px;color:' + dataColor">{{defaltData.doc_no}}</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">紧急程度:</span>
                    </i-col>
                    <i-col span='15'>
                        <p :style="'text-align:center;line-height:42px;font-size:16px;height:42px;color:' + levelColor">{{ levelText }}</p>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">备注:</span>
                    </i-col>
                    <i-col span='15'>
                        <div style="border:1px solid #e7e7eb;">
                            <p :style="'min-height:50px;padding:10px;font-size:14px;line-height:30px;color:'+dataColor">
                                {{defaltData.remark}}
                            </p>
                        </div>
                    </i-col>
                </row>
            </i-col>
            <i-col style="margin-top:10px;" v-if='defaltData.file_name !== null' :md="{ span: 24 }" :lg="{ span: 18,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">附件:</span>
                    </i-col>
                    <i-col span='2'>
                        <Button style="margin-top:9px;" type="primary" @click="downloadFile">下载</Button>
                    </i-col>
                    <i-col span='18'>
                        <span style="line-height:46px;font-size:18px;margin-left:10px;">
                            <Icon type="ios-document-outline" size="20" style="margin-top:-6px;" /> {{defaltData.file_name}}
                        </span>
                    </i-col>
                </row>
            </i-col>
        </row>
        <Divider />
        <row v-if='defaltData.reply_status === 0'>
            <i-col style="height:45px;" :md="{ span: 24 }" :lg="{ span: 22,offset:2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">提交处理</span>
            </i-col>
            <i-col :md="{ span: 24 }" :lg="{ span: 14,offset:4 }">
                <row>
                    <i-col span='3'>
                        <span style="font-size:16px;line-height:42px;">意见:</span>
                    </i-col>
                    <i-col span='19' offset='1'>
                        <i-input v-model="annotation" type="textarea" :rows="4" placeholder="请输入批阅内容" />
                    </i-col>
                </row>
                <row style="margin-top:30px;">
                    <i-col style="height:45px;" :md="{ span: 5 }" :lg="{ span: 2 }">
                        <span style="font-size:16px;line-height:32px">转送</span>
                    </i-col>
                    <i-col style="height:45px;" :md="{ span: 2 }" :lg="{ span: 2 }">
                        <org @listenToparent='getmenber' docId='1'></org>
                    </i-col>
                    <i-col :md="{ span: 24 }" :lg="{ span: 19 }">
                        <i-table :columns="receivedColumn" :data="receivedData"></i-table>
                    </i-col>
                </row>
            </i-col>
            <i-col :md="{ span: 24 }" :lg="{ span: 14,offset:4}">
                <i-button type="primary" style="margin:20px auto 0;display:block;" @click="submitReview(0)">提交</i-button>
            </i-col>
        </row>
        <Divider v-if='defaltData.reply_status === 0' />
        <row v-if='replyData.length>0'>
            <i-col style="height:45px;" :md="{ span: 24 }" :lg="{ span: 22,offset:2 }">
                <span style="font-size:16px;line-height:32px;font-weight: bold;">处理楼层</span>
            </i-col>
            <i-col class="replypage" :md="{ span: 24 }" :lg="{ span: 20,offset:2 }" v-for="(item,index) in replyData" :key='index'>
                <span class="ptime">{{item.created_at}}</span>
                <span class="pname">{{item.member.name}}:</span>
                <div class="ppage">
                    <p class="pcontent">{{item.content}}</p>
                    <div class="creply" v-for='(citem,index1) in item.comment' :key='index1'>
                        <span class="ctime">{{item.created_at}}</span>
                        <span class="cname">{{citem.member.name}}:</span>
                        <p class="ccontent">{{citem.content}}</p>
                    </div>
                    <i-button style="margin:20px 5% 10px 0;float:right;display:block;" @click="opReview(index)">回复</i-button>
                </div>
            </i-col>
        </row>
        <Modal v-model="reviewModal" :title="reviewTitle" @on-ok="reviewOk" @on-cancel="reviewCancel">
            <i-input v-model="reviewText" type="textarea" :rows="4" placeholder="请输入回复内容" />
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import org from "@/components/orgselect";
export default {
  components: { org },
  data() {
    return {
        levelText:'',
        levelColor:'',
      reviewModal: false,
      reviewTitle: "",
      reviewText: "",
      dataColor: "red",
      defaltData: {},
      replyData: [],
      annotation: "",
      receivedColumn: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "部门",
          key: "dep_id"
        }
      ],
      receivedData: []
    };
  },
  methods: {
    //楼层回复
    opReview(index) {
      this.reviewPid = this.replyData[index].id;
      this.reviewModal = true;
      this.reviewTitle = "回复 " + this.replyData[index].member.name;
    },
    reviewOk() {
      if (this.reviewText === "") {
        this.$Message.error("回复内容不能为空");
        return false;
      }
      axios.request({
        url: "/suggests",
          method: "post",
        data: {
          pid: this.reviewPid,
          doc_id: localStorage.getItem("docsId"),
          content: this.reviewText,
          members: []
        }
      }).then(res=>{
          this.getDocsDefalt()
            this.getReply()
            })
    },
    reviewCancel() {
      this.reviewTitle = "";
    },

    //提交审批
    submitReview(pid) {
      if (pid === 0 && this.annotation === "") {
        this.$Message.error("回复内容不能为空");
        return false;
      }
      let menberL = [];
      for (let i = 0; i < this.receivedData.length; i++) {
        menberL.push(this.receivedData[i].id);
      }
      //
      axios
        .request({
          url: "/suggests",
          method: "post",
          data: {
            pid: pid,
            doc_id: localStorage.getItem("docsId"),
            content: this.annotation,
            members: menberL
          }
        })
        .then(res => {
          this.getDocsDefalt();
          this.getReply();
        });
    },
    //获取回复
    getReply() {
      axios
        .request({
          url: "/suggests?doc_id=" + localStorage.getItem("docsId"),
          method: "get"
        })
        .then(res => {
          this.replyData = [];
          var arr = []
            for (var i in res.data) {
                this.replyData.push(res.data[i]); 
            }
        });
    },
    getDocsDefalt() {
      axios
        .request({
          url: "docs/" + localStorage.getItem("docsId"),
          method: "get"
        })
        .then(res => {
          this.defaltData = res.data;
          if(this.defaltData.urgent_level === 0){
            this.levelText = '普通'
            this.levelColor = '#19be6b'
          }else if(this.defaltData.urgent_level === 1){
              this.levelText = '紧急'
            this.levelColor = '#ff9900'
          }else if(this.defaltData.urgent_level === 2){
              this.levelText = '特急'
            this.levelColor = '#ed4014'
          }else if(this.defaltData.urgent_level === 3){
              this.levelText = '特提'
            this.levelColor = '#17233d'
          }
        });
    },
    getmenber: function(data) {
      this.receivedData = data;
    },

    downloadFile() {
      window.open(this.defaltData.qiniu_url);
    }
  },
  mounted() {
    this.getDocsDefalt();
    this.getReply();
  }
};
</script>

<style>
.replypage:nth-child(2) {
  border-top: 1px solid #e7e7eb;
}
.ptime {
  float: right;
  text-align: right;
  margin-top: 40px;
  padding-right: 5%;
  color: #aaa;
  line-height: 24px;
  height: 24px;
}
.pname {
  display: block;
  font-size: 16px;
  margin-top: 40px;
  margin-bottom: 10px;
  color: #aaa;
  line-height: 24px;
  height: 24px;
}
.ppage {
  width: 100%;
  min-height: 20px;
  border-bottom: 1px solid #e7e7eb;
  padding-bottom: 80px;
}
.pcontent {
  padding: 20px 5%;
  font-size: 16px;
}
.creply {
  background: #f6f8f9;
  width: 90%;
  margin: 10px 5%;
  padding: 15px;
}
.ctime {
  float: right;
  display: block;
  width: 50%;
  text-align: right;
  padding-right: 1%;
  color: #aaa;
  line-height: 24px;
  height: 24px;
}
.cname {
  display: block;
  width: 30%;
  font-size: 16px;
  margin-bottom: 10px;
  color: #aaa;
}
.ccontent {
  line-height: 30px;
  font-size: 16px;
}
</style>
