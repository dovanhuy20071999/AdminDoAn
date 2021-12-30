<template>
  <div class="list-news">
    <CCard>
      <CCardBody>
        <div class="box-title d-flex justify-content-between">
          <h1 class="title">
            Quản lý tin tức ({{
              fillterAll ? listNews.length : fillterItem.length
            }}
            tin tức)
          </h1>
          <div class="d-flex">
            <CButton color="dark" variant="outline" v-b-modal.modal-filter
              ><b-icon icon="funnel"></b-icon
            ></CButton>
            <download-csv :data="fillterItem" name="listnews.csv">
              <CButton color="dark" variant="outline" class="mx-3"
                ><b-icon icon="download"></b-icon
              ></CButton>
            </download-csv>

            <CButton
              class="mx-1 btn btn-success"
              style="width: 100px; font-size: 14px"
              v-on:click="updateNews(null)"
              square
              variant="outline"
              size="sm"
              v-b-modal.modal-update-news
            >
              +Thêm mới
            </CButton>
          </div>
        </div>
        <Tables :items="fillterItem" :fields="fields" :itemsPerPage="10">
          <template v-slot:title="{ item }">
            <td>
              <div style="text-transform: uppercase">{{ item.title }}</div>
            </td>
          </template>
          <template v-slot:content="{ item }">
            <td>
              <div v-html="item.content"></div>
            </td>
          </template>
          <template v-slot:created_at="{ item }">
            <td>
              {{ moment(item.created_at).format("YYYY-MM-DD") }}
            </td>
          </template>
          <template v-slot:action="{ item }">
            <td class="py-2 pl-2 pr-1 d-flex justify-content-center">
              <CButton
                class="mx-1"
                v-b-popover.hover.top="'Chỉnh sửa'"
                color="primary"
                square
                v-on:click="updateNews(item.id)"
                variant="outline"
                size="sm"
                v-b-modal.modal-update-news
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
                v-b-modal.modal-delete-news
              >
                <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
              </CButton>
              <CButton
                class="mx-1"
                v-b-popover.hover.top="'Xem thông tin chi tiết'"
                color="warning"
                v-on:click="detailNewsById(item.id)"
                square
                variant="outline"
                size="sm"
                v-b-modal.modal-detail-news
              >
                <b-icon icon="eye" aria-hidden="true"></b-icon>
              </CButton>
            </td>
          </template>
        </Tables>
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
                ></date-picker>
                <div style="color: red; margin-top: 1px" v-if="startDateErr">
                  {{ startDateErr }}
                </div>
              </div></CCol
            >
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
    <!-- modal detail news -->
    <b-modal size="lg" id="modal-detail-news" hide-header hide-footer>
      <div class="header-modal-detail text-center py-3">
        <h5 style="color: white !important">Thông tin chi tiết</h5>
      </div>
      <div>
        <CContainer>
          <div class="detail-main-content pt-4 pb-3">
            <div class="py-3 mx-3 position-relative">
              <CRow class="bg-news justify-content-center">
                <CCol
                  lg="2"
                  class="py-1 text-left"
                  style="font-size: 16px; font-weight: 600"
                  >TIÊU ĐỀ</CCol
                >
                <CCol
                  lg="10"
                  class="py-1 text-left"
                  style="font-size: 16px; text-transform: uppercase"
                  >{{ this.detailNews.title }}</CCol
                >
              </CRow>
              <CRow class="bg-news justify-content-center my-3">
                <CCol
                  lg="2"
                  class="py-1 text-left"
                  style="font-size: 16px; font-weight: 600"
                  >URL</CCol
                >
                <CCol
                  lg="10"
                  class="py-1 text-left"
                  style="font-size: 16px; text-transform: uppercase"
                  >{{ this.detailNews.url }}</CCol
                >
              </CRow>
            </div>
            <div class="py-1 pr-3 mx-3 my-3 position-relative">
              <CRow class="justify-content-between">
                <CCol lg="4" class="text-left">
                  <div class="bg-news" style="color: #333">
                    <div
                      class="py-1 text-center"
                      style="font-size: 16px; font-weight: 600"
                    >
                      HÌNH ẢNH
                    </div>
                    <div class="py-1 text-center">
                      <img
                        v-if="this.detailNews.image != null"
                        :src="`${this.detailNews.image}`"
                        style="width: 100%; height: 100%"
                      />
                      <img
                        v-if="this.detailNews.image == null"
                        src="@/assets/img/no-image.jpg"
                        style="width: 100%; height: 100%"
                      />
                    </div>
                  </div>
                  <div class="p-3">
                    <span
                      class="py-1 text-center"
                      style="font-size: 16px; font-weight: 600"
                      >Thời gian:
                      {{
                        moment(this.detailNews.created_at).format("YYYY-MM-DD")
                      }}</span
                    >
                  </div>
                </CCol>
                <CCol lg="7" class="bg-news py-1 text-left">
                  <div class="justify-content-center h-100" style="color: #333">
                    <div
                      class="py-1 text left"
                      style="font-size: 16px; font-weight: 600"
                    >
                      NỘI DUNG
                    </div>
                    <div
                      class="py-1 text left h-75"
                      style="
                        font-size: 16px;
                        border-radius: 10px;
                        padding: 10px;
                      "
                    >
                      <span><div v-html="this.detailNews.content"></div></span>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </div>
          </div>
        </CContainer>
      </div>
    </b-modal>
    <!-- modal update news -->
    <b-modal size="lg" id="modal-update-news" hide-header hide-footer>
      <div class="header-modal-detail text-center py-3">
        <h5 style="color: white !important" v-if="this.dataModal == null">
          Thêm tin tức
        </h5>
        <h5 style="color: white !important" v-else>Chỉnh sửa tin tức</h5>
      </div>
      <div>
        <CContainer>
          <div class="detail-main-content pt-4 pb-3">
            <div class="py-3 mx-3 position-relative">
              <CRow class="bg-news justify-content-center">
                <CCol
                  lg="2"
                  class="py-1 text-left"
                  style="font-size: 16px; font-weight: 600"
                  >TIÊU ĐỀ</CCol
                >
                <CCol lg="10" class="text-left">
                  <CInput
                    class="input-title"
                    placeholder="Nhập tiêu đề..."
                    v-model="detail.title"
                  />
                </CCol>
              </CRow>
              <CRow class="my-3 bg-news justify-content-center">
                <CCol
                  lg="2"
                  class="py-1 text-left"
                  style="font-size: 16px; font-weight: 600"
                  >URL</CCol
                >
                <CCol lg="10" class="text-left">
                  <CInput
                    class="input-title"
                    placeholder="Nhập url..."
                    v-model="detail.url"
                  />
                </CCol>
              </CRow>
            </div>
            <div class="py-1 pr-3 mx-3 my-3 position-relative">
              <CRow class="justify-content-between">
                <CCol lg="4" class="text-left">
                  <div class="bg-news">
                    <p
                      style="
                        text-align: center;
                        color: black;
                        font-size: 16px;
                        font-weight: 600;
                      "
                    >
                      CHỌN HÌNH ẢNH
                    </p>
                    <div class="py-1 text-center" style="color: #333">
                      <b-form-group
                        id="input-group-8"
                        label-for="input-8"
                        class="d-flex flex-column mx-3 my-2"
                      >
                        <b-form-file
                          @change="uploadImage"
                          v-model="detail.image"
                          plain
                        ></b-form-file>
                      </b-form-group>
                    </div>
                    <div class="py-1 text-center">
                      <img
                        v-if="this.image_temp === null"
                        src="@/assets/img/no-image.jpg"
                        style="width: 100%; height: 100%"
                      />
                      <img
                        v-else
                        :src="`${this.image_temp}`"
                        style="width: 100%; height: 100%"
                      />
                    </div>
                  </div>
                  <div class="p-3 text-center">
                    <CRow>
                      <CCol>
                        <CButton
                          class="mx-1 btn btn-success create-button"
                          v-on:click="createNew()"
                          square
                          variant="outline"
                          size="sm"
                          v-if="this.dataModal === null"
                        >
                          Thêm mới
                        </CButton>
                        <CButton
                          class="mx-1 btn btn-success create-button"
                          v-on:click="editNew(dataModal)"
                          square
                          variant="outline"
                          size="sm"
                          v-else
                        >
                          Lưu thay đổi
                        </CButton>
                        <CButton
                          class="mx-1 btn btn-danger create-button"
                          v-on:click="cancelUpdateModal()"
                          square
                          variant="outline"
                          size="sm"
                        >
                          Hủy
                        </CButton>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>
                <CCol lg="8" class="bg-news py-1 text-left">
                  <div class="justify-content-center h-100" style="color: #333">
                    <div
                      class="py-1 text left"
                      style="font-size: 16px; font-weight: 600"
                    >
                      NỘI DUNG
                    </div>
                    <div class="py-1 text left h-75">
                      <vue-editor
                        class="input-content"
                        v-model="detail.content"
                      ></vue-editor>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </div>
          </div>
        </CContainer>
      </div>
    </b-modal>
    <!-- modal delete news -->
    <b-modal id="modal-delete-news" hide-header hide-footer>
      <div class="header-modal-detail text-center py-3">
        <h5 style="color: white !important">Xoá tin tức</h5>
      </div>
      <div>
        <CContainer>
          <div class="detail-main-content pt-4 pb-3">
            <div
              class="py-3 mx-3 position-relative justify-content-center text-center"
            >
              <h4>Bạn có chắc chắn muốn xoá tin tức này?</h4>
            </div>
            <div class="py-1 pr-3 mx-3 my-3 position-relative">
              <CRow class="justify-content-between">
                <CCol lg="6" class="py-1 text-center">
                  <CButton
                    class="mx-1 btn btn-danger"
                    square
                    variant="outline"
                    size="lg"
                    @click="$bvModal.hide('modal-delete-news')"
                  >
                    Huỷ
                  </CButton>
                </CCol>
                <CCol lg="6" class="py-1 text-center">
                  <CButton
                    class="mx-1 btn btn-success"
                    v-on:click="deleteNew(dataModal)"
                    square
                    variant="outline"
                    size="lg"
                  >
                    Xoá
                  </CButton>
                </CCol>
              </CRow>
            </div>
          </div>
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
import { VueEditor } from "vue2-editor";
import "vue2-datepicker/index.css";
import moment from "moment";

export default {
  name: "ListNews",
  data() {
    return {
      fields: tableFields.NEWS,
      dataModal: "",
      startDate: null,
      endDate: null,
      startDateErr: "",
      endDateErr: "",
      fillterItem: [],
      reset: false,
      moment: false,
      detail: {
        title: "",
        image: null,
        content: "",
        url: "",
      },
      image_temp: null,
      fillterAll: true,
    };
  },
  components: {
    Tables,
    DatePicker,
    VueEditor,
  },
  created() {
    this.moment = moment;
    this.getListNews();
  },
  computed: {
    ...mapGetters(["listNews", "detailNews", "message", "success", "error"]),
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
      }
    },
    listNews() {
      this.fillterItem = this.listNews;
    },
    detailNews() {
      this.detail.title = this.detailNews.title;
      this.detail.content = this.detailNews.content;
      this.image_temp = this.detailNews.image;
      this.detail.url = this.detailNews.url;
    },
  },
  methods: {
    ...mapActions({ getListNews: "getListNews" }),
    ...mapActions({ getNewsById: "getNewsById" }),
    ...mapActions({ createNews: "createNews" }),
    ...mapActions({ editNews: "editNews" }),
    ...mapActions({ deleteNews: "deleteNews" }),
    cancelUpdateModal() {
      this.$nextTick(() => {
        this.$bvModal.hide("modal-update-news");
      });
      this.image_temp = null;
    },
    detailNewsById(id) {
      this.dataModal = id;
      this.getNewsById(id);
    },
    showConfirm(id) {
      this.dataModal = id;
    },
    deleteNew(id) {
      this.deleteNews(id);
      this.getListNews();
      this.$nextTick(() => {
        this.$bvModal.hide("modal-delete-news");
      });
    },
    updateNews(id) {
      this.dataModal = id;
      this.image_temp = null;
      this.detail.title = "";
      this.detail.content = "";
      this.detail.url = "";
      if (this.dataModal !== null) {
        this.getNewsById(id);
      }
    },
    createNew() {
      if (this.detail.title == "") {
        this.$toaster.error("Vui lòng nhập tiêu đề");
      } else if (this.detail.url == "") {
        this.$toaster.error("Vui lòng nhập url");
      } else if (this.detail.content == "") {
        this.$toaster.error("Vui lòng nhập nội dung");
      } else {
        var formData = new FormData();
        formData.append("title", this.detail.title);
        formData.append("url", this.detail.url);
        if (this.detail.image !== null) {
          formData.append("image", this.detail.image);
        }
        formData.append("content", this.detail.content);
        this.createNews(formData);
        this.getListNews();
        this.$nextTick(() => {
          this.$bvModal.hide("modal-update-news");
        });
      }
    },
    editNew(id) {
      if (this.detail.url == "") {
        this.$toaster.error("Vui lòng nhập url");
      } else {
        var formData = new FormData();
        formData.append("id", id);
        formData.append("title", this.detail.title);
        formData.append("url", this.detail.url);
        if (this.detail.image !== null) {
          formData.append("image", this.detail.image);
        }
        formData.append("content", this.detail.content);
        this.editNews(formData);
        this.getListNews();
        this.$nextTick(() => {
          this.$bvModal.hide("modal-update-news");
        });
      }
    },
    filterDate() {
      this.fillterAll = !this.fillterAll;
      this.fillterItem = this.listNews.filter((dt) => {
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
      this.fillterItem = this.listNews;
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
    uploadImage: function () {
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();
      const _this = this;
      reader.onload = function (e) {
        _this.image_temp = e.target.result;
      };
      reader.onerror = function (error) {
        alert(error);
      };
      reader.readAsDataURL(file);
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
.list-news {
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
#modal-detail-news___BV_modal_content_ {
  border-radius: 15px !important;
  #modal-detail-news___BV_modal_body_ {
    padding: unset !important;
    .container {
      background: #f5f5f5 !important;
      border-radius: 0 0 10px 10px;
      .detail-main-content {
        .bg-news {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin: 0;
        }
      }
    }
    .modal-content {
      border-radius: 10px;
    }
    .header-modal-detail {
      background: #303c54;
      border-radius: 10px 10px 0 0;
      .h5 {
        color: white !important;
      }
    }
  }
}
#modal-update-news___BV_modal_content_ {
  border-radius: 15px !important;
  width: 112%;
  #modal-update-news___BV_modal_body_ {
    padding: unset !important;
    .container {
      background: #f5f5f5 !important;
      border-radius: 0 0 10px 10px;
      .detail-main-content {
        .bg-news {
          background: white;
          border-radius: 10px;
          padding: 25px 20px 10px 20px;
          margin: 0;
          div {
            .input-title {
              input {
                font-size: 16px;
                border-radius: 5px;
                box-shadow: none;
              }
            }
            div {
              .input-content {
                textarea {
                  font-size: 16px;
                  border-radius: 5px;
                  padding: 10px;
                  height: 100%;
                  box-shadow: none;
                }
              }
            }
          }
        }
      }
    }
    .modal-content {
      border-radius: 10px;
    }
    .header-modal-detail {
      background: #303c54;
      border-radius: 10px 10px 0 0;
      .h5 {
        color: white !important;
      }
    }
    .create-button {
      width: 100px;
      height: 50px;
      font-size: 14px;
    }
  }
}
#modal-delete-news___BV_modal_content_ {
  border-radius: 15px !important;
  #modal-delete-news___BV_modal_body_ {
    padding: unset !important;
    .container {
      background: #f5f5f5 !important;
      border-radius: 0 0 10px 10px;
    }
    .modal-content {
      border-radius: 10px;
    }
    .header-modal-detail {
      background: #303c54;
      border-radius: 10px 10px 0 0;
      .h5 {
        color: white !important;
      }
    }
  }
}
</style>
