<template>
  <div class="list-transferpoint">
    <CCard>
      <CCardBody>
        <div class="box-title d-flex justify-content-between">
          <h1 class="title">
            Lịch sử chuyển tiền ({{ listById.length }} giao dịch)
          </h1>
          <div class="d-flex">
            <CButton color="dark" variant="outline" v-b-modal.modal-filter
              ><b-icon icon="funnel"></b-icon
            ></CButton>
            <download-csv :data="listById" name="listtransfer.csv">
              <CButton color="dark" variant="outline" class="mx-3"
                ><b-icon icon="download"></b-icon
              ></CButton>
            </download-csv>
          </div>
        </div>
        <div class="list-transferpoint-table">
          <Tables
            :items="fillterAll ? listById : fillterItem"
            :fields="fields"
            :itemsPerPage="10"
          >
            <template v-slot:id="{ item }">
              <td>#{{ item.id }}</td>
            </template>
            <template v-slot:message="{ item }">
              <td style="text-align: left">{{ item.message }}</td>
            </template>
            <template v-slot:transaction_id="{ item }">
              <td style="text-align: right">#{{ item.transaction_id }}</td>
            </template>
            <template v-slot:amount="{ item }">
              <td style="text-align: right">{{ item.amount }}</td>
            </template>
            <template v-slot:created_at="{ item }">
              <td style="text-align: right">
                {{
                  moment(new Date(item.created_at).toLocaleDateString()).format(
                    "MM-DD-YYYY"
                  )
                }}
              </td>
            </template>
          </Tables>
        </div>
      </CCardBody>
    </CCard>
    <b-modal id="modal-filter" hide-header hide-footer>
      <div class="d-block text-center">
        <h5>Tìm kiếm nâng cao</h5>
      </div>
      <div>
        <CContainer>
          <CRow>
            <CCol lg="6" class="py-3"
              ><div>
                <h5>Ngày bắt đầu</h5>
                <date-picker
                  id="StartDate"
                  name="StartDate"
                  v-model="startDate"
                  type="date"
                  :disabled-date="disabledEndDates"
                  :key="reset"
                ></date-picker></div
            ></CCol>
            <CCol lg="6" class="py-3"
              ><h5>Ngày kết thúc</h5>
              <date-picker
                id="EndDate"
                name="EndDate"
                v-model="endDate"
                type="date"
                :disabled-date="disabledEndDates"
                @change="handleEndDate"
                :key="reset"
              ></date-picker>
              <div style="color: red; margin-top: 1px" v-if="endDateErr">
                {{ endDateErr }}
              </div></CCol
            >
            <CCol lg="12"
              ><div class="d-flex justify-content-center">
                <b-button
                  variant="success"
                  class="mx-1"
                  color="info"
                  square
                  v-on:click="filterDate()"
                  size="sm"
                  :disabled="startDate === null && endDate === null"
                  >Tìm kiếm</b-button
                >
                <b-button
                  variant="secondary"
                  class="mx-1"
                  color="info"
                  square
                  v-on:click="resetFilter()"
                  size="sm"
                  :disabled="startDate === null && endDate === null"
                  >Reset</b-button
                >
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Tables from "../../components/common/Tables";
import { tableFields } from "../../utils/table-fields.js";
import { mapActions, mapGetters } from "vuex";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";

export default {
  name: "ListTransferHistory",
  data() {
    return {
      fields: tableFields.TRANSFERHISTORY,
      dataModal: "",
      startDate: null,
      endDate: null,
      startDateErr: "",
      endDateErr: "",
      fillterItem: [],
      reset: false,
      moment: false,
      listById: [],
      fillterAll: true,
    };
  },
  components: {
    Tables,
    DatePicker,
  },
  created() {
    this.moment = moment;
    const { params } = this.$route;
    this.getTransferHistoryByUser(params.id);
    const idParams = this.$route.params.id;
    this.listById = this.listTransferHistory.filter(
      (item) => item.sender_id == idParams || item.receiver_id == idParams
    );
  },
  computed: {
    ...mapGetters(["listTransferHistory", "message", "success", "error"]),
  },
  watch: {
    success() {
      if (this.success) {
        this.$toaster.success(this.message);
        this.$store.commit("set", ["message", ""]);
        this.$store.commit("set", ["success", false]);
      }
    },
    error() {
      if (this.error) {
        this.$toaster.error(this.message);
        this.$store.commit("set", ["message", ""]);
        this.$store.commit("set", ["error", false]);
        setTimeout(() => {
          this.$router.go();
        }, 2000);
      }
    },
  },
  methods: {
    ...mapActions({ getTransferHistoryByUser: "getTransferHistoryByUser" }),
    filterDate() {
      this.fillterAll = !this.fillterAll;
      this.fillterItem = this.listById.filter((dt) => {
        const min = new Date(this.startDate).toLocaleDateString();
        const max = new Date(this.endDate).toLocaleDateString();
        const localDate = new Date(dt.created_at).toLocaleDateString();
        if (min === null && max === null) {
          return dt;
        } else {
          return localDate >= min && localDate <= max;
        }
      });
    },
    resetFilter() {
      this.fillterAll = !this.fillterAll;
      this.fillterItem = this.listById;
      this.startDate = null;
      this.endDate = null;
      this.reset = !this.reset;
    },
    handleEndDate() {
      this.endDateErr = "";
      var startDate = new Date(this.startDate).getTime();
      var endDate = new Date(this.endDate).getTime();
      if (startDate > endDate) {
        this.endDateErr = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
      }
    },
    disabledEndDates(date) {
      return date > new Date();
    },
  },
};
</script>
<style lang="scss">
.modal-backdrop {
  opacity: 0.5 !important;
}
.pagination {
  margin-top: 30px;
  justify-content: center !important;
}
.list-transferpoint {
  td {
    text-align: left;
  }
  td {
    &:last-child {
      text-align: right;
    }
    &:nth-child(6) {
      text-align: right;
    }
    &:nth-child(7) {
      text-align: right;
    }
    &:nth-child(8) {
      text-align: right;
    }
  }
}
</style>
