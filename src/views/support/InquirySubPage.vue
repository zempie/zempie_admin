<template>
    <q-card>
        <q-card-section>
            <div class="row q-mb-md">
                <div class="col text-weight-bold text-h6">
                    {{ data.title }}
                </div>
            </div>

            <div class="row q-mb-md">
                <div class="col text-weight-bold">
                    카테고리 - {{ data.category }}
                </div>
            </div>

            <div class="row q-mb-md">
                <div class="col text-weight-bold">
                    질문자 - {{ data.userName }}
                </div>
            </div>

            <div class="row q-mb-md">
                <div class="col text-weight-bold">
                    질문일 - {{ data.date }}
                </div>
            </div>

            <div class="row q-mb-md">
                <div class="col text-weight-bold">
                    <q-input
                    v-model="data.text"
                    filled
                    type="textarea"
                    readonly
                    />
                </div>
            </div>

            <div class="row q-mb-md" v-if="data.url_img !== null && data.url_img !== ''">
                <q-btn color="primary" label="이미지보기" @click="openImagePopup" />

                <q-dialog v-model="imagePopup">
                    <img :src="data.url_img" style="max-width: 90%; max-height: 90%;" alt="문의 이미지" />
                </q-dialog>
            </div>

            <div class="row q-mb-md" v-if="data.response != null">
                <div class="col text-weight-bold">
                    답변인 - {{ data.admin.name }}
                </div>
            </div>

            <div class="row q-mb-md" v-if="data.response != null">
                <div class="col text-weight-bold">
                    답변일 - {{ data.responseDate }}
                </div>
            </div>

            <div class="row q-mb-md">
                <div class="col">
                    <Editor @text="onChangeText" :text="text" />
<!--                    <q-editor v-model="text" min-height="10rem" />-->
                </div>
            </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
            <div class="row justify-end">
                <q-btn class="q-pl-md q-pr-md q-mr-md" color="grey" outline label="취소" @click="cancel" />
                <q-btn class="q-pl-md q-pr-md" color="positive" label="등록" :disable="!submitCheck" @click="submit" />
            </div>
        </q-card-section>
    </q-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Notify } from "quasar";
import Api from '@/util/Api';
import Config from '@/util/Config';
import Editor from '@/components/Editor.vue';


@Component({
    components: {
        Editor
    }
})
export default class extends Vue {
    data: any = {}
    text = ""
    imagePopup = false;

    onChangeText( text : string ) {
        this.text = text;
    }

    get submitCheck(){
        return this.text.trim() != "";
    }

    cancel(){
        this.$router.go(-1);
    }

    async created(){
        const result = await Api.getInquiryItem(parseInt(this.$route.params.index));
        if(result == false){
            Notify.create({
                type: "negative",
                message: "존재하지 않는 문의입니다.",
                position: "top",
            });
            this.$router.go(-1);
        }else{
            this.data = result.inquiry;
            console.log( this.data );
            this.data.category = Config.inquiryCategory[this.data.category];
            this.data.date = new Date(this.data.created_at).toLocaleString();
            this.data.responseDate = new Date(this.data.updated_at).toLocaleString();
            this.data.userName = this.data.user.name;
            this.text = this.data.response || "";
        }
        
    }

    async submit(){
        const result = await Api.responseInquiry(parseInt(this.$route.params.index), this.text);
        if(result){
            await this.$router.push("/support/inquiry");
        }
    }

    openImagePopup() {
        this.imagePopup = true;
    }
}
</script>

