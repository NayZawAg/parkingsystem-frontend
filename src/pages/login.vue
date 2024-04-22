<template>
  <v-main>
    <v-container fluid>
      <global-nav />
      <v-row>
        <v-col cols="12" class="back-btn">
          <BackButton @click="Back" class="pl-0 pl-md-3" />
        </v-col>
      </v-row>
        <v-row class="login-title">
          <v-col cols="12" md="4" class="mx-auto">
            <v-card flat>
              <v-card-title class="justify-center title-letter-space font-weight-bold">
                {{ title }}
              </v-card-title>
              <v-card-text class="text-center enter-password-text">ID、パスワードを入力してください。</v-card-text>
              <v-card-text>
                <v-form @submit.prevent="onSubmit" ref="form" id="login_form">
                  <v-alert
                    v-if="error != null"
                    type="error"
                    border="left"
                  >
                    {{ error }}
                  </v-alert>
                  <div class="v-txt-padding">
                    <v-row>
                      <v-col cols="12" class="py-0">
                        <v-text-field
                          id="username"
                          v-model="form.username"
                          label="ID"
                          type="text"
                          autocomplete="username"
                          required
                          :rules="[checkRequired]"
                        />
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-text-field
                          id="password"
                          v-model="form.password"
                          label="パスワード"
                          type="password"
                          autocomplete="current-password"
                          required
                          :rules="[checkRequired]"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-form>
              </v-card-text>
              <div class="v-btn-padding">
                <v-card-actions class="flex-wrap">
                  <v-btn
                    class="white--text font-weight-bold "
                    color="#e2002e"
                    large
                    block
                    type="submit"
                    form="login_form"
                  >ログイン</v-btn>
                </v-card-actions>
    
                <v-card-actions class="flex-wrap">
                  <v-btn        
                    class="mb-6 font-weight-bold"
                    outlined
                    color="#e2002e"
                    large
                    block
                    @click="Back"
                  >戻る</v-btn>
                </v-card-actions>
              </div> 
            </v-card>
          </v-col>
        </v-row>
      <!-- </div> -->
    </v-container>
  </v-main>
</template>

<script>
import GlobalNav from '@/components/GlobalNavBar';
import MediaStyle from '@/styles/globals.scss';
import BackButton from "@/components/parts/BackButton.vue";

export default {
  auth: 'guest',
  components:{
    GlobalNav,
    MediaStyle,
    BackButton,
  },
  data() {
    return {
      title: '内部管理機能ログイン',
      form: {
        username: null,
        password: null
      },
      error: null,
      checkRequired: v => !!v || '必須項目です'
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  methods: {
    async onSubmit() {
      if(this.$refs.form.validate()) {
        try {
          let response = await this.$auth.loginWith('local', { data: this.form });
          this.$refs.form.reset()
          // do google analytics event
          this.$gtag('event', 'login_btn_click', {
            'login_status': 'succeed',
          })
          // set token
          this.$auth.strategy.token.set(response.data.token)
          this.$router.push('/management_menu')
          // this.$router.push('/parking_situations')
        } catch(error) {
          console.log("error");
          this.error = error.data.errors[0]
          // do google analytics event
          this.$gtag('event', 'login_btn_click', {
            'login_status': 'failed',
          })
        }
      } else {
        // do google analytics event
        this.$gtag('event', 'login_btn_click', {
          'login_status': 'validation_error',
        })
      }
    },
    async Back() {
      this.$router.push("/")
    }
  }
}
</script>
<style scoped>
  .title-letter-space {
    letter-spacing: 0.3rem !important;
  }
  .enter-password-text{
    font-size: 11px;
  }
</style>