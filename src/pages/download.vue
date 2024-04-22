<template>
  <v-main>
    <v-app-bar
      app
      color="white"
      flat
    >
      <NuxtLink to="/download">
        <div class="icon mr-3">三次市スマートシティ　データダウンロードサイト</div>
      </NuxtLink>
    </v-app-bar>
    <v-row class="pa-0 pt-3">
      <div class="col-6 mx-auto">
        <p class="ml-3">このサイトでは三次市スマートシティの取組みで収集、整備したデータを公開しています</p>
        <p class="ml-3">■利用可能なデータ</p>
        <p class="ml-7">現在公開しているデータは以下の通りです。</p>
        <ul class="ml-9">
          <li>観光案内チャットボットサービス利用データ</li>
          <li class="pt-2">駐車場利用データ</li>
        </ul>
        <p class="ml-3 pt-4">■データダウンロード</p>
        <p class="ml-7 pb-4">以下から、利用するデータを選択してください。</p>
        <div class="col-12 m-auto">
          <v-card class="fill-height grey lighten-3">
            <v-card-text class="card pt-9">
              <v-form ref="form">
                <v-row class="ml-3">
                  <p>データの種類：</p>
                  <v-col cols="8" class="py-0">
                    <v-select
                      solo
                      :items="dataTypes"
                      v-model="item_name"
                      style="width: 450px"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="ml-3">
                  <p>データの期間：</p>
                  <v-col cols="10" class="ml-3">
                    <v-row>
                      <div>
                        <v-select
                          solo
                          :items="startYear" 
                          v-model="from_year"
                          style="width: 100px"
                        ></v-select>
                      </div>
                      <div class="ml-3">
                        <v-select
                          solo
                          :items="startMonth"
                          v-model="from_month"
                          style="width: 100px"
                        ></v-select>
                      </div>
                      <div class="ml-4">～</div>
                      <div class="ml-4">
                        <v-select
                          solo
                          :items="endYear"
                          v-model="to_year"
                          style="width: 100px"
                        ></v-select>
                      </div>
                      <div class="ml-3">
                        <v-select
                          solo
                          :items="endMonth"
                          v-model="to_month"
                          style="width: 100px"
                        ></v-select>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="text-center">
                  <v-col class="py-0 mb-4">
                    <v-btn
                      width="121px"
                      color="primary"
                      :disabled="isDisabled"
                      @click="downloadCSV()"
                    >
                      ダウンロード
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </div> 
      </div>
    </v-row>
  </v-main>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      title: '三次市スマートシティ　データダウンロードサイト',
      dataTypes:['観光案内チャットボットサービス利用データ', '駐車場利用データ'],
      startMonth: [],
      endMonth: [],
      startYear: [],
      endYear:[],
      error: null,
      success: null,
      from_year: null,
      to_year: null,
      from_month: null,
      to_month: null,
      item_name: null
    }
  },
  head() {
    return {
      titleTemplate: '',
      title: this.title

    }
  },
  computed: {
    status() {
      return this.$store.getters['Download/status']
    },
    download_error() {
      return this.$store.getters['Download/error']
    },
    download_csv() {
      return this.$store.getters['Download/download_csv']
    },
    isDisabled(){
      return !(this.item_name && this.from_year && this.from_month && this.to_year && this.to_month)
    }
  },
  mounted() {
    const startYear = 1990;
    const endYear = new Date().getFullYear();
    for (let i = endYear; i >= startYear; i--) {
      this.startYear.push(i)
      this.endYear.push(i)
    }
    const month = 1;
    for (let i = month; i <= 12; i++) {
      this.startMonth.push(i)
      this.endMonth.push(i)
    }
  },
  methods: {
    async downloadCSV() {
      try{
        const current = new Date();
        const current_date = current.toJSON().slice(0,10).replace(/-/g,'');
        const current_time = current.getHours() + "" + current.getMinutes() + "" + current.getSeconds();
        let from_month = null
        let to_month = null
        if (this.from_month.toString().length == 1) {
          from_month = "0" + this.from_month
        }
        if (this.to_month.toString().length == 1) {
          to_month = "0" + this.to_month
        }
        let params = {"from_year_month": this.from_year + "-" + from_month, "to_year_month": this.to_year + "-" + to_month}

        if (this.item_name == "観光案内チャットボットサービス利用データ") {
          await this.$store.dispatch('Download/getDownloadChatbotCsv', params)
          let csv = '\ufeff' + 'No,日時,ユーザーID,会話ID,メッセージ,ボタン/直接入力,質問カテゴリL1,質問カテゴリL2,質問カテゴリL3,想定外返答,ユーザが選択した言語,ユーザが選択したエリア,居住国,居住エリア,ユーザー利用インターフェース\n'
          this.download_csv.forEach((el, index) => {
            let no = index+1
            let user_id = el['user_id'].replace('\n', '')
            let line = no + ',' +
                      el['conversation_at'] + ',' +
                      user_id + ',' +
                      el['conversation_id'] + ',' +
                      el['message'] + ',' +
                      el['button'] + ',' +
                      el['question_category_one'] + ',' +
                      el['question_category_two'] + ',' +
                      el['question_category_three'] + ',' +
                      el['reply'] + ',' +
                      el['language'] + ',' +
                      el['area'] + ',' +
                      el['country'] + ',' +
                      el['residential_area'] + ',' +
                      el['user_interface'] +'\n'
            csv += line
          })
          let blob = new Blob([csv], { type: 'text/csv' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `観光案内チャットボットサービス利用データ_${current_date}${current_time}.csv`
          link.click()
        } else if (this.item_name == "駐車場利用データ") {
          await this.$store.dispatch('Download/getDownloadParkingCsv', params)
          let csv = '\ufeff' + 'No,入庫/出庫,入出庫日時,数字,登録地\n'
          this.download_csv.forEach((el, index) => {
            let no = index+1
            let in_out_flg = el['in_out_flg'] == true ? "出庫" : "入庫"
            let car_number = el['car_number'] == null ? "" : el['car_number']
            let car_area = el['car_area'] == null ? "" : el['car_area']
            let line = no + ',' + in_out_flg + ',' + el['parking_time'] + ',' + car_number + ',' + car_area +'\n'
            csv += line
          })
          let blob = new Blob([csv], { type: 'text/csv' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `駐車場利用データ_${current_date}${current_time}.csv`
          link.click()
        }
        this.$refs.form.reset();
        // do google analytics event
        this.$gtag('event', 'data_download_btn_click', {
          'location_name': this.item_name,
          'from_year_month': this.from_year + '-' + this.from_month,
          'to_year_month': this.to_year + '-' + this.to_month
        })
      } catch(error) {
        console.log("error");
      }
    }
  }
}
</script>
<style>
  .v-input__slot{
    min-height: 10px !important;
    margin-top: -5px;
  }
  .theme--light.v-card > .v-card__text {
    color: rgba(0,0,0,.87) !important;
  }
  a,
  a:visited {
    text-decoration: none;
    color: inherit;
  }

  .v-application a {
    color: black !important;
  }
</style>