<template>
    <q-table 
    :data="rows" 
    row-key="id" 
    :columns="columns" 
    :pagination.sync="pagination" 
    :rows-per-page-options="pageOption"
    >
        <template v-slot:top-right>
            <div v-if="searchOptions != null" class="flex">
                <q-select v-model="searchCategory" :options="searchOptions" placeholder="Category" class="q-mr-md" />
                <q-input v-model="search" type="text" placeholder="Search" class="q-mr-md" />
            </div>

            <div v-if="exportMode != null && rows.length > 0">
                <q-btn color="primary" icon="get_app" label="엑셀 파일로 추출" @click="exportData" />
            </div>
            
            <slot></slot>
        </template>

        <template v-slot:body-cell="props">
            <q-td :props="props">
                <div v-if="props.col.event">
                    <a href="#" @click="(event)=>{event.preventDefault();subEvent(props.row)}">{{rows[props.rowIndex][props.col.field]}}</a>
                </div>
                <div v-else>
                    {{rows[props.rowIndex][props.col.field]}}
                </div>
            </q-td>
        </template>
    </q-table>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Api from "@/util/Api";
import Config from "@/util/Config";
import Gate from "@/util/Gate";
import axios from "axios";

import exportExcel from '@/util/ExportExcel';

export const TableBus = new Vue();

@Component({})
export default class extends Vue {
    pagination = {
        rowsPerPage: 20,
        sortBy: null,
        descending: true,
        page: 1,
    };
    pageOption = [5, 10, 15, 20, 30]

    rows: any = [];

    @Prop() rowKey!: string;
    @Prop() columns!: any;
    @Prop() query!: Function;
    @Prop() columnName!: string;
    @Prop() exportMode!: boolean;
    @Prop() filename!: string;
    @Prop() searchOptions!: string[]; // prop

    subEvent( row: any ){
        this.$emit('subEvent', row);
    }

    @Watch("pagination")
    async paginationChanged(){
        await this.movePage();
    }

    async created(){
        TableBus.$on("reload", async () => {
            await this.movePage();
        }); 
    }

    async movePage() {
        const limit = this.pagination.rowsPerPage;
        const offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
        let order = this.pagination.sortBy || this.rowKey;
        
        if(this.pagination.descending){
            order = "reverse:" + order;
        }

        const { count, list } = await this.getData( order, limit, offset );

        this.setRows( count, list, offset );
    }

    async getData( order : string, limit : number, offset : number ) {
        const result = await axios({
            method: "POST",
            url: process.env.VUE_APP_GRAPHQL_LINK,
            data: {
                query: this.query(order, limit, offset)
            }
        })
        const count = result.data.data[this.columnName + "Count"];
        const list = result.data.data[this.columnName + "Get"];

        return {
            count,
            list
        }
    }

    setRows( count : number, list : any, offset : number ) {
        const rows = new Array(count || 0).fill({id:null});

        if(this.rows.length == 0){
            this.rows = new Array(count || 0).fill({id:null});
        }

        for(let i = 0; i < this.rows.length; i++){
            rows[i] = this.rows[i];
        }

        this.rows = rows;
        
        this.replaceData( list, offset );
    }

    replaceData( list : any, offset : number ) {
        for(let i = 0; i < list.length; i++){
            let index = offset + i;
            this.rows[index] = list[i];

            if(this.rows[index].created_at != null){
                this.rows[index].created_at = new Date(this.rows[index].created_at).toLocaleString();
            }

            if(this.columnName == "game" && this.rows[index].user != null){
                this.rows[index].developer = this.rows[index].user.name;
            }else{
                this.rows[index].developer = '없음';
            }

            if(this.columnName == "game"){
                if(this.rows[index].enabled){
                    this.rows[index].state = "배포 중";
                }else{
                    this.rows[index].state = "대기 중";
                }
            }

            if(this.columnName == "faq"){
                this.rows[index].category = Config.faqCategory[this.rows[index].category];
            }
        }
    }

    async exportData() {
        let order = this.pagination.sortBy || this.rowKey;
        if(this.pagination.descending){
            order = "reverse:" + order;
        }
        const { count, list } = await this.getData( order, this.rows.length, 0 );
        this.replaceData( list, 0 );

        const columns = this.columns.map((column : any ) => {
            return column.label;
        });

        const keys = this.columns.map((column : any ) => {
            return column.field;
        });

        
        const data = this.rows.map( (row : any) => {
            const arr = [];
            for( let i = 0; i < keys.length; i++ ) {
                arr.push( row[keys[i]] );
            }
            return arr;
        } );
        exportExcel( columns, data, this.filename || 'table' );
    }

    
    // searchCategory = '';
    // search = '';
}
</script>