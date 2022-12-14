<template>
    <q-table 
        :data="rows"
        row-key="id"
        :columns="columns"
        :pagination.sync="pagination"
        :rows-per-page-options="pageOption"
        :selection="selection || 'none'"
        :selected.sync="selected"
    >
        <template v-slot:top-right>
            <slot></slot>

            <div class="flex" v-if="!!searchColumn">
                <q-input type="text" placeholder="Search" class="q-ml-md q-mr-md" v-model="searchText" @keyup="onKeyUpSearch" />
                <q-btn flat icon="search" @click="search" />
            </div>
        </template>

        <template v-slot:body-cell="props">
            <q-td :props="props">
                <div v-if="props.col.field === 'url_thumb'">
                    <q-img
                        :src="props.row[props.col.field]"
                        spinner-color="white"
                        style="height: 66px; width: 100px"
                        :ratio="1"
                    />
                </div>
                <div v-else-if="props.col.event">
                    <div v-if="props.col.eventButton" >
                        <q-btn
                            v-if="!!props.row[props.col.field]"
                            :color="props.col.eventButtonColor || 'primary'"
                            @click.prevent="subEvent(props.row)"
                        >
                            {{ props.col.format && props.col.format(props.row[props.col.field]) || props.row[props.col.field] }}
                        </q-btn>
                    </div>
                    <a
                        v-else
                        href="#"
                        @click.prevent="subEvent(props.row)"
                    >
                        {{ props.col.format && props.col.format(props.row[props.col.field]) || props.row[props.col.field] }}
                    </a>
                </div>
                <div v-else>
                    <div v-if="props.col.badge">
                        <q-badge :color="props.col.badgeColor && props.col.badgeColor(props.row[props.col.field]) || 'primary'">
                            {{ props.col.format && props.col.format(props.row[props.col.field]) || props.row[props.col.field] }}
                        </q-badge>
                    </div>
                    <div v-else>
                        {{ props.col.format && props.col.format(props.row[props.col.field]) || props.row[props.col.field] }}
                    </div>
                </div>
            </q-td>
        </template>
    </q-table>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Api from "@/util/Api";

export const TableBus = new Vue();

@Component({
    components: {},
})
export default class extends Vue {
    filter = "";

    pagination = {
        rowsPerPage: 20,
        sortBy: null,
        descending: true,
        page: 1,
    };
    pageOption = [5, 10, 15, 20, 30]

    rows: any = [];

    selected: any = [];

    searchText: string = '';

    @Prop() columns!: any[];
    @Prop() apiLink!: string;
    @Prop() columnName!: string;
    @Prop() data!: any;
    @Prop() selection!: string;
    @Prop() searchColumn!: string;

    subEvent( row: any ){
        this.$emit('subEvent', row);
    }

    @Watch("pagination")
    async paginationChanged(){
        await this.movePage();
    }

    @Watch("selected")
    onSelectedChanged(){
        this.$emit('selectEvent', this.selected);
    }

    async mounted(){
        await this.movePage();
        TableBus.$on("reload", async () => {
            await this.movePage();
        });

        TableBus.$on("selectClear", async () => {
            this.selected = [];
        });
    }

    destroyed() {
        TableBus.$off("reload");
        TableBus.$off("selectClear");
    }

    async movePage() {
        const limit = this.pagination.rowsPerPage;
        const offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
        const sort = this.pagination.sortBy || 'id';
        const dir = this.pagination.descending ? "desc" : "asc";

        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        params.append('sort', sort.toString());
        params.append('dir', dir.toString());

        for(const key in this.data){
            params.append(key, this.data[key]);
        }

        if( !!this.searchColumn ) {
            params.append(this.searchColumn, this.searchText);
        }

        const result = await Api.getList(this.apiLink, params.toString());
        const rows = new Array(result.count || 0).fill({id:null});

        if(this.rows.length == 0){
            this.rows = new Array(result.count || 0).fill({id:null});
        }

        for(let i = 0; i < rows.length; i++){
            rows[i] = this.rows[i] || {id:null};
        }

        this.rows = rows;
        if(result[this.columnName] == null){
            for(let i = 0; i < result.length; i++){
                const index = offset + i;
                this.rows[index] = result[i];

                if(!!this.rows[index].created_at){
                    this.rows[index].created_at = new Date(this.rows[index].created_at).toLocaleString();
                }
            }
            // this.pageOption = [0];
            // this.pagination.rowsPerPage = 0;
        }else{
            for(let i = 0; i < result[this.columnName].length; i++){
                const index = offset + i;
                this.rows[index] = result[this.columnName][i];

                if(!!this.rows[index].created_at){
                    this.rows[index].created_at = new Date(this.rows[index].created_at).toLocaleString();
                }

                if(this.rows[index].admin != null){
                    this.rows[index].admin_account = this.rows[index].admin.account;
                    this.rows[index].admin_name = this.rows[index].admin.name;
                    this.rows[index].admin_level = this.rows[index].admin.level;
                }
            }
        }
    }

    onKeyUpSearch( event : KeyboardEvent ) {
        if( event.code == "Enter" ){
            this.movePage();
        }
    }

    search() {
        this.movePage();
    }
}
</script>
