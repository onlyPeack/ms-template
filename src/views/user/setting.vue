<template>
    <div class="user-setting">
        <el-form  label-width="120px">
            <div class="setting_div">
                <div class="config_title">
                    账户设置
                </div>
                <div class="setting_div_form">
                    <div class="setting_div_form_item">
                        <div style="width: 100px;">用户名：</div>
                        <div style="width: 100px;">{{userName}}</div>
                        <!--<el-button size="small">修改</el-button>-->
                    </div>
                    <div class="setting_div_form_item">
                        <div style="width: 100px;">密码：</div>
                        <div style="width: 100px;">******</div>
                        <el-button size="small" @click="updateBtn()">修改</el-button>
                    </div>
                </div>
            </div>
            <div  class="setting_div" v-if="!this.isSAAS">
                <div class="config_title">
                    消息提醒
                </div>
                <div class="setting_div_form">
                    <div class="setting_div_form_item">
                        <div style="width: 200px;">待处理事项提醒</div>
                        <el-switch v-model="value1"
                        active-text=""
                        inactive-text=""/>
                    </div>
                </div>
            </div>
            <div  class="setting_div" v-if="!this.isSAAS">
                <div class="config_title">
                    其他设置
                </div>
            </div>
        </el-form>
        <el-dialog :visible.sync="dialogSelectVisible" v-if="dialogSelectVisible" width="30%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="请填写信息" append-to-body class="public-dialog">
            <avue-form :option="option" v-model="form"  ref="form" @submit="handleSubmit">
            </avue-form>
        </el-dialog>
    </div>
</template>

<script>
    import {changePassword} from "@/api/user";
    import { resetRouter } from '@/router/router'
    export default {
        data() {
            return {
                userName: '',
                value1: true,
                dialogSelectVisible:false,
                form: {},
                option: {
                    labelWidth: 120,
                    column: [
                        {
                            label: "原密码",
                            prop: "oldPass",
                            span: 24,
                            type: 'password',
                            rules: [{
                                required: true,
                                message: "请输入原密码",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "新密码",
                            prop: "newPass",
                            type: 'password',
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入新密码",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "确认密码",
                            prop: "qrPass",
                            type: 'password',
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入确认密码",
                                trigger: "change"
                            }],
                        },
                    ]
                },
            }
        },
        created(){
          this.userName =   this.$store.getters.userInfo.name;
        },
        methods:{
            handleSelectClose() {
                this.dialogSelectVisible = false;
            },
            updateBtn(){
                this.form = {};
                this.dialogSelectVisible = true;
            },
            handleSubmit(form, done) {
                if(this.form.newPass != this.form.qrPass){
                    this.vueMessage('warning','新密码与确认码不一致!');
                    done();
                    return
                }
                changePassword(this.form.oldPass,this.form.newPass,).then(res => {
                    done();
                    if (res.data.code == '2000') {
                        this.vueMessage('success', '修改密码成功!');
                        this.$store.dispatch("LogOut").then(() => {
                            resetRouter();
                            window.location.href="http://erp.msebc.com/msytc.html" ;
                        });
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                })
                this.dialogSelectVisible = false;
                done();
            },
        }
    }
</script>

<style lang="scss">
    .config_title {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: 600;
        border-left: 3px solid #409EFF;
        padding-left: 20px;
        margin-top: 15px;
    }
    .setting_div{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background: #ffffff;
        margin-top: 20px;
        margin-left: 20px;
        margin-right: 20px;
        padding: 10px 30px;
    }
    .setting_div_form{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-size: 12px;
        line-height: 60px;
        margin-left: 10px;
    }
    .setting_div_form_item{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        height: 60px;
        margin-left: 10px;
    }
</style>
