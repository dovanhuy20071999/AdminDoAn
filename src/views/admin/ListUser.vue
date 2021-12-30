<template>
  <div>
    <CCard>
      <CCardBody>
        <div class="box-title d-flex justify-content-between">
          <h1 class="title">
            Quản lý học viên ({{
              listUser.filter((item) => item.status == 0).length
            }}
            người dùng active)
          </h1>
          <router-link :to="{ name: 'Create User' }" class="btn btn-success"
            ><b-icon icon="plus"></b-icon>Thêm mới</router-link
          >
        </div>
        <Tables :items="listUser" :fields="fields" :itemsPerPage="5">
          <template v-slot:id="{ item }">
            <td>#{{ item.id }}</td>
          </template>
          <template v-slot:avatar="{ item }">
            <td>
              <img
                :src="`${item.avatar}`"
                style="width: 60px; height: 60px; border-radius: 50%"
              />
            </td>
          </template>
          <template v-slot:phone_number="{ item }">
            <td style="text-align: right">
              {{ item.phone_number }}
            </td>
          </template>
          <template v-slot:current_point="{ item }">
            <td style="text-align: right">
              {{ item.current_point }}
            </td>
          </template>
          <template v-slot:birthday="{ item }">
            <td style="text-align: right">
              {{
                moment(new Date(item.birthday).toLocaleDateString()).format(
                  "MM-DD-YYYY"
                )
              }}
            </td>
          </template>
          <template v-slot:status="{ item }">
            <td v-if="item.status == 0">
              <b-badge variant="success">Active</b-badge>
            </td>
            <td v-if="item.status == 1">
              <b-badge variant="danger">Block</b-badge>
            </td>
          </template>
          <template v-slot:action="{ item }">
            <td class="py-2 pl-2 pr-1 d-flex justify-content-center">
              <CButton
                class="mx-1"
                v-b-popover.hover.top="'Chỉnh sửa'"
                color="primary"
                square
                v-on:click="editUser(item.id)"
                variant="outline"
                size="sm"
                v-b-modal.modal-comfirm
              >
                <b-icon icon="pencil-fill" aria-hidden="true"></b-icon>
              </CButton>
              <CButton
                class="mx-1"
                v-b-popover.hover.top="'Xóa'"
                color="danger"
                square
                v-on:click="showConfirm(item.id)"
                variant="outline"
                size="sm"
                v-b-modal.delete-modal-user
              >
                <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
              </CButton>
              <CButton
                class="mx-1"
                v-b-popover.hover.top="'Xem mã QR'"
                color="warning"
                square
                v-on:click="detailUser(item.id)"
                variant="outline"
                size="sm"
                v-b-modal.modal-qrcode
              >
                <b-icon icon="dice5" aria-hidden="true"></b-icon>
              </CButton>
              <CButton
                class="mx-1"
                v-b-popover.hover.top="'Block'"
                color="danger"
                square
                v-on:click="showConfirmBlock(item.id)"
                variant="outline"
                size="sm"
                v-b-modal.block-modal-user
              >
                <b-icon icon="x-circle" aria-hidden="true"></b-icon>
              </CButton>
            </td>
          </template>
        </Tables>
      </CCardBody>
    </CCard>
    <div>
      <b-modal id="delete-modal-user" hide-header hide-footer>
        <div class="d-block text-center">
          <h5>Bạn có chắc chắn muốn xóa người này không ?</h5>
        </div>
        <div class="d-flex justify-content-center">
          <b-button
            class="mx-2 mt-3 btn btn-danger"
            block
            v-on:click="deleteUsers(dataModal)"
            >Xóa</b-button
          >
          <b-button
            class="mx-2 mt-3 btn btn-secondary"
            block
            @click="$bvModal.hide('delete-modal-user')"
          >
            Hủy
          </b-button>
        </div>
      </b-modal>
    </div>
    <div>
      <b-modal id="block-modal-user" hide-header hide-footer>
        <div class="d-block text-center">
          <h5>Bạn có chắc chắn muốn block người dùng này không ?</h5>
        </div>
        <div class="d-flex justify-content-center">
          <b-button
            class="mx-2 mt-3 btn btn-danger"
            block
            v-on:click="blockNewUser(dataModal)"
            >Block</b-button
          >
          <b-button
            class="mx-2 mt-3 btn btn-secondary"
            block
            @click="$bvModal.hide('block-modal-user')"
          >
            Hủy
          </b-button>
        </div>
      </b-modal>
      <!-- modal QR code -->
      <b-modal id="modal-qrcode" hide-header hide-footer>
        <div class="header-modal-qrcode text-center py-3">
          <h4 style="color: white !important">Mã QR</h4>
        </div>
        <div>
          <CContainer>
            <div class="d-flex justify-content-center align-items-center">
              <vue-qr
                class="QR"
                :text="
                  this.username +
                  '' +
                  this.fullname +
                  '' +
                  this.email +
                  '' +
                  this.address +
                  '' +
                  this.phone_number +
                  '' +
                  this.current_point +
                  '' +
                  this.status +
                  '' +
                  this.sex
                "
              ></vue-qr>
            </div>
          </CContainer>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Tables from "../../components/common/Tables";
import { tableFields } from "../../utils/table-fields.js";
import { mapActions, mapGetters } from "vuex";
import VueQr from "vue-qr";
import moment from "moment";

export default {
  name: "ListUser",
  data() {
    return {
      fields: tableFields.USER_ADMIN,
      dataModal: "",
      dataModalQRCode: "",
      optionUser: "",
      username: "",
      email: "",
      phone_number: "",
      sex: "",
      address: "",
      current_point: "",
      fullname: "",
      stt: "",
      status: "",
      moment: false,
    };
  },
  components: {
    Tables,
    VueQr,
  },
  created() {
    this.moment = moment;
    this.getListUser();
    this.listUserCurrent = this.listUser.filter((item) => item.status == 0);
  },
  computed: {
    ...mapGetters(["listUser", "message", "success", "error"]),
  },
  watch: {
    success() {
      if (this.success) {
        if (this.message === "Delete user complete") {
          this.message_success = "Xóa người dùng thành công";
          this.$toaster.success(this.message_success);
          this.$store.commit("set", ["message", ""]);
          this.$store.commit("set", ["success", false]);
        } else {
          this.$toaster.success(this.message);
          this.$store.commit("set", ["message", ""]);
          this.$store.commit("set", ["success", false]);
        }
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
    ...mapActions({ getListUser: "getListUser" }),
    ...mapActions({ deleteUser: "deleteUser" }),
    ...mapActions({ blockUser: "blockUser" }),
    editUser(id) {
      this.$router.push({ name: "Edit User", params: { id: id } });
    },
    transferHistory(id) {
      this.$router.push({ name: "History Transfer User", params: { id: id } });
    },
    showConfirm(id) {
      this.dataModal = id;
    },
    showConfirmBlock(id) {
      this.dataModal = id;
    },
    deleteUsers(id) {
      this.deleteUser(id);
      this.getListUser();
      this.$nextTick(() => {
        this.$bvModal.hide("delete-modal-user");
      });
    },
    blockNewUser(id) {
      this.dataModal = id;
      const formData = {
        status: 1,
        id: id,
      };
      this.blockUser(formData);
      this.getListUser();
      this.$nextTick(() => {
        this.$bvModal.hide("block-modal-user");
      });
    },
    detailUser(id) {
      this.dataModalQRCode = id;
      this.optionUser = this.listUser.filter((item) => item.id == id);
      this.username = "Username: " + this.optionUser[0].username;
      this.email = "\nEmail: " + this.optionUser[0].email;
      this.phone_number = "\nSố điện thoại: " + this.optionUser[0].phone_number;
      this.fullname = "\nTên đầy đủ: " + this.optionUser[0].fullname;
      this.sex = "\nGiới tính: " + this.optionUser[0].sex;
      this.address = "\nĐịa chỉ: " + this.optionUser[0].address;
      this.current_point =
        "\nPoint hiện tại: " + this.optionUser[0].current_point;
      this.stt = this.optionUser[0].status;
      if (this.stt == "1") {
        this.status = "\nTrạng thái: Block";
      } else this.status = "\nTrạng thái: Active";
    },
  },
};
</script>
<style lang="scss">
.modal-backdrop {
  opacity: 0.5 !important;
}
.header-modal-qrcode {
  background: #303c54;
  border-radius: 10px 10px 0 0;
  .h4 {
    color: white !important;
  }
}
#modal-qrcode___BV_modal_content_ {
  border-radius: 11px;
}
#modal-qrcode___BV_modal_body_ {
  padding: unset !important;
}
</style>
