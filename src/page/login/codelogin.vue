<template>
    <div>
        <div>
<!--            <h4 class="login-title" style="color:#5586FF;font-size: 24px;margin:20px 0px 20px 0px;">欢迎注册梅施云</h4>-->
            <h4 class="login-title" style="color:#5586FF;font-size: 24px;margin:20px 0px 20px 0px;">欢迎注册</h4>
        </div>
        <el-form
                status-icon
                :rules="loginRules"
                ref="loginForm"
                :model="loginForm"
                label-width="0">
            <el-form-item prop="phone">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          v-model="loginForm.phone"
                          auto-complete="off"
                          :placeholder="$t('login.phone')">
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          v-model="loginForm.code"
                          auto-complete="off"
                          :placeholder="$t('login.code')">
                    <template slot="append">
          <span @click="handleSend"
                class="msg-text"
                :class="[{display:msgKey}]">{{msgText}}</span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          :type="passwordType"
                          v-model="loginForm.password"
                          auto-complete="off"
                          :placeholder="$t('login.passwords')">
                    <i class="el-icon-view el-input__icon"
                       slot="suffix"
                       @click="showPassword"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="surePassword">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          :type="surePasswordType"
                          v-model="loginForm.surePassword"
                          auto-complete="off"
                          :placeholder="$t('login.surePassword')">
                    <i class="el-icon-view el-input__icon"
                       slot="suffix"
                       @click="showSurePassword"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="companyName">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          v-model="loginForm.companyName"
                          auto-complete="off"
                          :placeholder="$t('login.companyName')">
                </el-input>
            </el-form-item>
            <div style="display: flex;flex-direction: row;justify-content:flex-start;color: #666666;font-size: 12px;align-items: center;">
                <el-checkbox v-model="checked" class="checkedFont">
                    注册即同意
                </el-checkbox>
                <span style="cursor: pointer;margin-left: -6px;color: #3E90FE;" @click="dialogVisible = true">服务协议条款&nbsp;</span>
                <span>和</span>
                <span style="cursor: pointer;color: #3E90FE;">&nbsp;用户隐私协议</span>
            </div>
            <el-form-item>
                <el-button size="small"
                           type="primary"
                           @click="handleLogin"
                           class="login-submit" style="margin-top: 20px;">{{$t('login.register')}}
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" width="30%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="梅施云ERP服务协议条款" append-to-body class="public-dialog">
            <div class="fuwuxieyi" style="height: 500px;overflow: auto;">
                <span>
                    欢迎使用梅施云·ERP,为使用梅施云·ERP，您应当阅读并遵守《梅施云ERP软件许可及服务协议》（以下简称“本协议”）。请您务必慎重阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通是使用某项服务的单独协议，并选择接收或者不接受。限制、免责条款可能以加粗形式提示您注意。
除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。您的下载、安装、使用、登录等行为即视为您已阅读并同意本协议的约束。
                </span>
                <span>1.协议的范围</span>
                <span>&nbsp;&nbsp;1.1协议适用主体范围：本协议适用于个人或公司下载、安装、使用、登录本软件</span>
                <span>&nbsp;&nbsp;1.2协议关系及冲突条款：本协议的内容，包括但不限于以下与本服务、本协议相关的协议、规则、规范以及苏州梅施信息科技有限公司可能不断发布的关于本服务的相关协议、规则、规范等内容，前述内容一经正式发布，即为本协议不可分割的组成部分，与其构成统一整体，您同样应当遵守。</span>
                <span>2.关于本服务</span>
                <span>&nbsp;&nbsp;2.1本服务内容：本服务内容是指苏州梅施信息科技有限公司通过本软件向用户提供的相关服务（简称“本服务”）。</span>
                <span>&nbsp;&nbsp;2.2本服务形式;您可能通过电脑、手机等终端以客户端、网页等形式使用本服务，具体以苏州梅施信息科技有限公司提供的为准，同时，苏州梅施信息科技有限公司会不断丰富您使用本服务的终端、形式等。当您使用本服务时，您应选择与您的终端、系统等相匹配的本软件版本，否则，您可能无法正常使用本服务。</span>
                <span>&nbsp;&nbsp;2.3许可的范围：</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;2.3.1苏州梅施信息科技有限公司给予您一项公司或个人的、不可转让及非排他性的许可，以使用本软件。您可以非商业目的在单一台终端设备上下载、安装、使用、登录本软件。</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;2.3.2本协议其他条款未明示授权的其它一切权利仍由苏州梅施信息科技有限公司保留，您在行使这些权力时须另外取得苏州梅施信息科技有限公司的书面许可。苏州梅施信息科技有限公司如果未行使前述任何权利，并不构成对该权利的放弃。</span>
                <span>3.软件的获取</span>
                <span>&nbsp;&nbsp;3.1您从苏州梅施信息科技有限公司获取本软件是唯一合法的途径。</span>
                <span>&nbsp;&nbsp;3.2如果您从未经苏州梅施信息科技有限公司授权的第三方获取本软件或本软件名称相同的安装程序，苏州梅施信息科技有限公司无法保证该软件能够正常使用，并因此给您造成的损失不予负责。</span>
                <span>4.软件的安装与卸载</span>
                <span>&nbsp;&nbsp;4.1苏州梅施信息科技有限公司可能为不同的终端、系统等提供了不同的客户端版本，您应当根据实际情况选择下载合适的版本进行安装。</span>
                <span>&nbsp;&nbsp;4.2下载安装程序后，您需要按照该程序提示的步骤正确安装。</span>
                <span>&nbsp;&nbsp;4.3如果您不再需要使用本软件或者需要安装新版本软件，可以自行卸载。</span>
                <span>5.软件的更新</span>
                <span>&nbsp;&nbsp;5.1为了增进用户体验，完善服务内容，苏州梅施信息科技有限公司将不断提供新的服务，并为您不时提供软件更新（这些更新可能会采取软件替换、修改、功能强化、版本升级等形式）。</span>
                <span>&nbsp;&nbsp;5.2本软件可能为您默认开启自动升级，更新等功能，但是会把本次更新的内容告知与您。</span>
                <span>&nbsp;&nbsp;5.3本软件新版本确认更新使用后，旧版本的软件可能无法使用，请您随时核对并下载最新版本。</span>
                <span>&nbsp;&nbsp;5.4 软件更新的内容最终的解释权归属苏州梅施信息科技有限公司所有</span>
                <span>6.用户个人信息保护</span>
                <span>&nbsp;&nbsp;6.1保护用户个人或企业信息是苏州梅施信息科技有限公司的一项基本原则，苏州梅施信息科技有限公司会采取合理的措施保护用户的个人或企业信息。除法律法规规定的情形外，未经用户许可苏州梅施信息科技有限公司不会向第三方公开，透露用户个人或企业信息。</span>
                <span>&nbsp;&nbsp;6.2您的注册账号，可能需要填写一些必要的信息（包括不限于手机号、邮箱、微信号、QQ号、Facebook号等）。</span>
                <span>&nbsp;&nbsp;6.3一般情况下，您可以随时浏览、修改自己的信息，但出于安全性和身份识别的考虑，您修改关键信息时，可能有些必要的验证措施。</span>
                <span>7.用户行为规范</span>
                <span>&nbsp;&nbsp;7.1用户注意事项：</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;7.1.1您充分理解并同意：您在使用本服务某一项特定服务时，本服务可以使用您终端设备的相关权限、接口及相关信息等实现相应的功能，某些特定服务可能还需同意单独的协议、规则等，您在使用该项服务前请仔细阅读前述相关协议、规则。</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;7.1.2您充分理解并同意：本服务记录的所有操作行为都和注册账号关联，这代表该账户在本服务做的所有操作都默认为是您本人或企业员工操作，您（本人或企业）应对操作结果负责。</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;7.1.3如果您离开苏州梅施信息科技有限公司并停止使用本软件及服务，苏州梅施信息科技有限公司可以从服务器上删除您的注册账号。</span>
                <span>&nbsp;&nbsp;7.2用户禁止行为：除非法律允许或者苏州梅施信息科技有限公司书面许可，您不得从事下列行为:</span>
                <span>&nbsp;&nbsp;7.3用户注意事项：(1)删除本软件中的信息数据；(2)对本软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件的源代码；(3)对苏州梅施信息科技有限公司拥有知识产权的内容进行使用、出租、修改、汇编、发表和商业用途为目的等；对本软件或者本软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务端的交互数据，以及本软件运行所必须的系统数据，进行复制、修改、增加、删除或创作任何衍生作品；(5)自行授权他人或利用第三方软件对本软件及其组件、模块、数据等进行干扰或者是数据采集以及窃取；(6)其他未经苏州梅施信息科技有限公司明示授权、许可或违反本协议及相关协议、规则的行为。</span>
                <span>&nbsp;&nbsp;7.4对自己行为负责：您充分了解并同意，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。</span>
                <span>&nbsp;&nbsp;7.5违约处理：如果苏州梅施信息科技有限公司发现或收到别人举报您有违反本协议约定的，苏州梅施信息科技有限公司有权采取包括但不限于暂停、终止您使用本服务，追究法律责任等措施。</span>
                <span>8.其他</span>
                <span>&nbsp;&nbsp;8.1您使用本软件或本服务即视为您已阅读并同意接收本协议的约束。苏州梅施信息科技有限公司有权在必要时修改本协议条款，您可以在本软件、本服务的最新版本中查阅相关协议条款，本协议条款变更后，如果您继续使用本软件或本服务，即视为您已接受修改后的协议。如果您不接受修改后的协议，应当停止使用本软件。</span>
                <span>&nbsp;&nbsp;8.2本协议签订地为中华人民共和国江苏省苏州市。</span>
                <span>&nbsp;&nbsp;8.3本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。</span>
                <span>&nbsp;&nbsp;8.4若您和苏州梅施信息科技有限公司之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。</span>
                <span>&nbsp;&nbsp;8.5本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。</span>
            </div>
             <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
             </span>
        </el-dialog>
    </div>

</template>

<script>
    import {isvalidatemobile} from "@/util/validate";
    import {mapGetters} from "vuex";
    import {registerCheckMobile, sendRegisterSms, registerCheckUserName, register} from "@/api/user"

    export default {
        name: "codelogin",
        data() {
            const validatePhone = (rule, value, callback) => {
                if (isvalidatemobile(value)[0]) {
                    callback(new Error(isvalidatemobile(value)[1]));
                } else {
                    callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error("请输入至少6位数的密码"));
                } else {
                    callback();
                }
            };
            const validateCode = (rule, value, callback) => {
                if (value.length != 4) {
                    callback(new Error("请输入4位数的验证码"));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                checked: false,
                selected: [],
                msgText: "",
                msgTime: "",
                msgKey: false,
                loginForm: {
                    phone: "",
                    code: "",
                    password: "",
                    surePassword: "",
                    companyName: ""
                },
                passwordType: "password",
                surePasswordType: "password",
                loginRules: {
                    companyName: [{required: true, message: '公司名称不能为空', trigger: 'blur'}],
                    phone: [{required: true, trigger: "blur", validator: validatePhone}],
                    code: [{required: true, trigger: "blur", validator: validateCode}],
                    password: [{required: true, trigger: "blur", validator: validatePassword}],
                    surePassword: [{required: true, trigger: "blur", validator: validatePassword}],
                },
                code: undefined,
            };
        },
        created() {
            this.msgText = this.config.MSGINIT;
            this.msgTime = this.config.MSGTIME;
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["tagWel"]),
            config() {
                return {
                    MSGINIT: this.$t("login.msgText"),
                    MSGSCUCCESS: this.$t("login.msgSuccess"),
                    MSGTIME: 60
                };
            }
        },
        props: [],
        methods: {
            handleSelectClose(){
                this.dialogVisible = false;
            },
            showSurePassword() {
                this.surePasswordType == ""
                    ? (this.surePasswordType = "password")
                    : (this.surePasswordType = "");
            },
            showPassword() {
                this.passwordType == ""
                    ? (this.passwordType = "password")
                    : (this.passwordType = "");
            },
            handleSend() {
                if (this.msgKey) return;
                if (this.loginForm.phone == '') {
                    this.vueMessage('warning', '请输入手机号!');
                    return
                }
                registerCheckMobile(this.loginForm.phone).then(res => {
                    if (res.data == 0) {
                        sendRegisterSms(this.loginForm.phone).then(val => {
                            if (val.data.code == '2000') {
                                this.code = val.data.data;
                                this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                                this.msgKey = true;
                                const time = setInterval(() => {
                                    this.msgTime--;
                                    this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                                    if (this.msgTime == 0) {
                                        this.msgTime = this.config.MSGTIME;
                                        this.msgText = this.config.MSGINIT;
                                        this.msgKey = false;
                                        clearInterval(time);
                                    }
                                }, 1000);
                            } else {
                                this.vueMessage('warning', val.data.msg);
                            }
                        })
                    } else {
                        this.vueMessage('warning', '该手机号已注册!');
                    }
                })

            },
            handleLogin() {
                if(!this.checked){
                    this.vueMessage('warning', '请先同意阅读服务协议及用户隐私协议!')
                    return
                }
                if (this.loginForm.password != this.loginForm.surePassword) {
                    this.vueMessage('warning', '密码与确认码不一致!')
                    return
                }
                if (this.loginForm.code == this.code) {
                    this.isShow = true;
                } else {
                    this.vueMessage('warning', '验证码输入有误!');
                }
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.$refs.loginForm.validate(valid => {
                            if (valid) {
                                registerCheckUserName(this.loginForm.phone).then(res => {
                                    if (res.data == 0) {
                                        register({
                                            companyName: this.loginForm.companyName,
                                            mobile: this.loginForm.phone,
                                            password: this.loginForm.password,
                                            phoneCode: this.loginForm.code,
                                            surePassword: this.loginForm.surePassword,
                                            userName: this.loginForm.phone,
                                        }).then(val => {
                                            if (val.data.status == 200) {
                                                this.vueMessage('success', '注册成功!');
                                                this.$emit('loginBtn');
                                            } else {
                                                this.vueMessage('warning', '注册失败!');
                                            }
                                        })
                                    } else {
                                        this.vueMessage('warning', '该用户名已存在!');
                                    }
                                })
                            }
                        })
                    }
                });
            }
        }
    };
</script>

<style lang="scss">
    .msg-text {
        display: block;
        width: 60px;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
    }
    .fuwuxieyi{
        border:1px solid #CACACA;
        padding:20px 15px;
        background: #F5F5F5;
        color: black;
        font-size: 13px;
        line-height: 1.6;
        font-weight: bold;
        display: flex;
        flex-direction: column;
    }

    .area-cascader-wrap .area-select .area-selected-trigger {
        color: #333333;
    }

    .msg-text.display {
        color: #ccc;
    }

    .el-input-group__append, .el-input-group__prepend {
        border: 1px solid #DCDFE6;
        border-left: none;
    }

    .checkedFont {
        .el-checkbox__label {
            font-size: 12px;
        }
    }
</style>
