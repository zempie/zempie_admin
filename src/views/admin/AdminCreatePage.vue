<template>
    <q-card>
        <q-card-section>
            <div class="row items-center q-mb-md">
                <div class="col-12 col-md-2 text-weight-bold">
                    관리자 아이디
                </div>

                <div class="col-12 col-md-10">
                    <q-input v-model="account" placeholder="Account" />
                </div>
            </div>

            <div class="row items-center q-mb-md">
                <div class="col-12 col-md-2 text-weight-bold">
                    관리자 비밀번호
                </div>

                <div class="col-12 col-md-10">
                    <q-input v-model="password" placeholder="Password" />
                </div>
            </div>

            <div class="row items-center q-mb-md">
                <div class="col-12 col-md-2 text-weight-bold">
                    관리자 이름
                </div>

                <div class="col-12 col-md-10">
                    <q-input v-model="name" placeholder="Name" />
                </div>
            </div>

            <div class="row q-mb-md">
                <div class="col-12 col-md-2 text-weight-bold q-pt-md">
                    권한
                </div>

                <div class="col-12 col-md-10 q-pt-sm">
                    <q-option-group v-model="level" :options="levelOptions" color="primary" type="radio" />
                </div>
            </div>

            <div class="row q-mb-md">
                <div class="col-12 col-md-2 text-weight-bold q-pt-md">
                    권한 영역
                </div>

                <div class="col-12 col-md-4 q-pt-sm">
                    <q-option-group v-model="subLevel" :options="subLevelOptions" color="primary" type="checkbox" />
                </div>
            </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
            <div class="row justify-end">
                <q-btn class="q-pl-md q-pr-md q-mr-md" color="grey" outline label="취소" @click="cancel" />
                <q-btn class="q-pl-md q-pr-md" color="positive" label="등록" @click="submit" :disable="!submitCheck" />
            </div>
        </q-card-section>
    </q-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Api from "@/util/Api";
import Config from "@/util/Config";
import { Notify } from "quasar";

@Component({
    components: {},
})
export default class extends Vue {
    account = "";
    password = "";
    name = "";

    level = 1;
    levelOptions = Config.levelOptions;

    subLevel = [];
    subLevelOptions = Config.subLevelOptions;

    adminList = [{ account: "admin" }];

    adminAccountRule(val: string) {
        let result = true;
        for (let i = 0; i < this.adminList.length; i++) {
            if (this.adminList[i].account == val) {
                result = false;
            }
        }
        return result;
    }

    get submitCheck(){
        return this.account.trim() != "" && this.password.trim() != "" && this.name.trim() != "" && this.level != null;
    }

    async submit() {
        if (this.account.trim() == "" && this.password.trim() == "" && this.name.trim() == "" && this.level == null) {    
            return Notify.create({
                type: "negative",
                message: `내용을 전부 채워주시기 바랍니다.`,
                position: "top",
            });
        }
        const result = await Api.addAdmin(this.account.trim(), this.password.trim(), this.name.trim(), this.level);
        if (result) {
            this.$router.push("/admin/list");
        }
    }

    cancel(){
        this.$router.go(-1);
    }
}
</script>

<style lang="scss">
</style>
