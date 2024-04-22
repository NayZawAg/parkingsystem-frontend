<template>
  <v-main>
    <global-nav :title_menu="title_menu" menulink="/management_menu" />
    <GlobalPageTitle :titleName="title" @click="goBack" />
    <Divider class="divider-position" />
    <v-container class="px-7">
      <p class="mt-5 about-date">2023年2月28日</p>
      <p>
        三次市　駐車場混雑表示サービス（以下「本サービス」といいます。）は、三次市の住民及び、三次市への来訪者の皆様が、三次市内の対象の駐車場について、現地に行かなくともWebサイト上で混雑状況を確認可能とすることを目的としたサービスです。
      </p>
      <p>
        本サービスは、三次市との合意のもと、EYストラテジー・アンド・コンサルティング株式会社（以下「当社」といいます。）が、対象の駐車場に設置したカメラの画像から自動車の入庫、出庫をカウントし、駐車場の混雑状況を算出、表示します。
      </p>
      <p>
        なお、カメラの画像は、本サービスで必要な以下の情報を取得した後、速やかに削除する仕組みとなっております。
      </p>
      <section class="hide-on-mobile">
        <p>[カメラ画像から取得する情報]</p>
        <ul>
          <li>対象の駐車場に入庫、出庫する自動車の台数</li>
          <li>
            対象の駐車場に入庫、出庫する自動車のナンバープレートの登録地名及び、4桁の番号
          </li>
        </ul>
        <p>
          ※4桁の番号は、異なる値に置き換え、実際の車両の特定はできない状態となっております
        </p>
        <p>
          本サービスで取得した情報は、本サービスの目的及び、三次市のサービス向上の目的のみに使用します。
        </p>
      </section>
      <h4 class="cookie-style">クッキーポリシー</h4>
      <v-divider style="border-top-width: 3px"></v-divider>
      <ol class="mt-3 cookie-list-style">
        <li>クッキーとは</li>
        <li>どのようなタイプのクッキーが使用されているか</li>
        <li>クッキーの管理・削除方法</li>
        <li>過去に設定されたクッキー</li>
        <li>本クッキーポリシーの変更</li>
      </ol>
      <div class="mt-4 mb-4">最終改訂日 : 2023年10月</div>
      <p>
        三次市　駐車場混雑表示サービス（以下、「本サービス」といいます。）のウェブサイト（<a
          href="https://purple-field-0781de800.2.azurestaticapps.net/"
          class="link-text-style"
          >https://purple-field-0781de800.2.azurestaticapps.net/</a
        >）（以下、「本ウェブサイト」といいます。）では、ユーザーの利用状況の把握、及び利便性の向上を目的としてCookieを利用
        しています。三次市　駐車場混雑表示サービス　クッキーポリシー　（以下、「本クッキーポリシー」といいます。）は、Cookieを利用するにあたり、Cookieの利用目的ならびにCookieの管理方法等について定めます。
      </p>
      <p>
        クッキーとその管理⽅法については、以下の情報で詳細をご確認いただけます。利⽤者は、
        <a
          href="https://purple-field-0781de800.2.azurestaticapps.net/cookie-settings"
          class="link-text-style"
          >https://purple-field-0781de800.2.azurestaticapps.net/cookie-settings</a
        >

        において、いつでも本ウェブサイトのクッキー設定を変更し、クッキーを無効にすることができます。また、ブラウザー設定を変更して、ウェブサイトのクッキーを⾃分のデバイスに配置できないようにすることもできます。
      </p>
      <p class="cookie-title-style">1. クッキーとは</p>
      <p>
        「クッキー」は、利⽤者がウェブサイトに滞在している間、ウェブサイトが使⽤する情報トークン（「識別⼦」）をブラウザーに格納することを可能にする技術です。クッキーは、その後の訪問ごとに当初のウェブサイトまたは別のウェブページに返信され、クッキーが認識されます。クッキーは、ウェブサイトの機能、または機能の効率化を⽬的として使⽤され、ウェブサイトの所有者にも情報が提供されます。
      </p>
      <p>
        クッキーはさまざまな機能を果たします。これには、利⽤者がページ間を効率的に移動すること、利⽤者の好みの記憶、ユーザーエクスペリエンスの全般的な改善などがあります。クッキーでは例えば、利⽤者が以前にウェブサイトを訪問したことがあるか、または新規訪問者であるかを確認できます。
      </p>
      <p>
        本ウェブサイトを訪問したとき、利⽤者には、本ウェブサイトで利⽤されるクッキーを受け⼊れる、またはすべてのクッキーを拒否する機会が与えられています。クッキーを使⽤することを受け⼊れた場合、以下の情報は、本ウェブサイトで使⽤されるクッキーにのみ該当します。クッキーの受け⼊れまたは拒否に関する同意は、本ウェブサイトにのみ限定され、本ウェブサイトにハイパーリンクで接続されることがある他のサイトまたはその他のページには適⽤されないことに注意してください。これらのウェブサイトで使⽤されるクッキーの詳細については、当該ウェブサイトのプライバシー通知またはクッキーポリシーを参照してください。
      </p>
      <p>
        クッキーは、さまざまな期間にわたって、利⽤者のコンピューターまたはモバイル機器に保存されます。⼀部のクッキーは「セッションクッキー」であり、ブラウザーが開かれているときのみ存在します。ブラウザーを閉じると⾃動的に削除されます。他のクッキーは「パーマネントクッキー」であり、ブラウザーを閉じた後も残ります。これはウェブサイトが使⽤し、ブラウザーを開いてインターネットを再度閲覧したときに利⽤者のコンピューターが認識されます。
      </p>
      <p class="cookie-subtitle-style mb-0">
        トラッキング拒否／グローバル・プライバシー・コントロール
      </p>
      <p>
        利⽤者がブラウザーの「トラッキング拒否」設定または「グローバル・プライバシー・コントロール」のシグナルを有効にしていることが確認されると、クッキーは⾃動的に無効化されます。
      </p>
      <p class="cookie-title-style">
        2. どのようなタイプのクッキーが使⽤されているか
      </p>
      <p class="mb-1">
        本ウェブサイトでは利用者の利便性向上を目的にCookieを利用します。具体的には、以下の利用目的があります。
      </p>
      <ul>
        <li>
          本ウェブサイトの利用状況を分析し、本ウェブサイトにおける操作性の改善や三次市駐車場混雑表示サービスの改善を図るため
        </li>
        <li>
          <div>
            駐車場混雑表示サービスを提供する三次市の交通関連分野のデータ集計、分析のため　（※）
          </div>
          ※関連分野でのデータ集計、分析を目的に、取得情報を匿名、統計加工したうえで本サービス関係者へ共有します。
        </li>
        <li>上記の利用目的に付随する利用目的のため</li>
      </ul>
      <p class="mt-4 mb-0">
        本ウェブサイトではGoogle
        Analyticsを使用し、Cookie情報に基づくWebサイトのアクセスログの収集・解析を実施しています。なお、Google
        Analyticsで収集するアクセスログはGoogle社のプライバシーポリシーに基づき管理されます。
      </p>
      <p class="mb-1">
        Google
        Analyticsについて、およびGoogle社のプライバシーポリシーについては以下をご参照ください。
      </p>
      <ul>
        <li>
          <div>Google Analytics 公式Webサイト</div>
          <a
            href="https://marketingplatform.google.com/intl/ja/about/analytics/"
            target="_blank"
            class="link-text-style"
            >https://marketingplatform.google.com/intl/ja/about/analytics/</a
          >
        </li>
        <li>
          <div>Google プライバシーポリシー</div>
          <a
            href="https://policies.google.com/privacy?hl=ja"
            target="_blank"
            class="link-text-style"
            >https://policies.google.com/privacy?hl=ja</a
          >
        </li>
      </ul>
      <p class="cookie-title-style mt-4">3. クッキーの管理・削除方法</p>
      <p class="mb-1">
        利⽤者には、クッキーの受け⼊れと拒否を選択する権利があります。この権利の⾏使⽅法は以下で説明するとおりです。
      </p>
      <p class="mb-1">
        利⽤者は、<a
          href="https://purple-field-0781de800.2.azurestaticapps.net/cookie-settings"
          class="link-text-style"
          >https://purple-field-0781de800.2.azurestaticapps.net/cookie-settings</a
        >
        において、いつでも本クッキー設定を変更できます。
      </p>
      <p class="mb-1">
        または、クッキーの全部または⼀部の設定を拒否するブラウザー設定を有効にすることで、すべてのクッキーをブロックできます。
      </p>
      <p>
        本ウェブサイトのクッキーを受け⼊れる場合でも、ブラウザーの設定によりクッキーを受信したときに通知を受け、それを受け⼊れるかどうか決めることができます。
      </p>
      <p class="cookie-title-style mt-4">4. 過去に設定されたクッキー</p>
      <p>
        ⼀つまたは複数のクッキーを無効にする場合でも、無効になる前にクッキーから収集された情報を利⽤します。ただし、無効にされたクッキーについては使⽤を停⽌し、さらなる情報を収集しません。
      </p>
      <p class="cookie-title-style mt-4">5. クッキーポリシーの変更</p>
      <p class="mb-10">
        本クッキーポリシーは更新し、⾃らの業務とサービスにおける変更を反映することがあります。本クッキーポリシーに対する変更を掲⽰する場合、本クッキーポリシーの上部にある「最終改訂⽇」を改訂します。クッキーに格納される情報を収集、使⽤、および／または共有する⽅法において重要な変更を⾏う場合、変更通知をウェブサイトに⽬⽴つ⽅法で掲⽰することで利⽤者に通知します。利⽤者がこのページを随時閲覧し、本クッキーポリシーまたはその他のポリシーの変更を確認することを推奨します。
      </p>
    </v-container>
    <GlobalFooter />
  </v-main>
</template>

<script>
import GlobalNav from "@/components/GlobalNavBar";
import Divider from "@/components/parts/Divider.vue";
import GlobalPageTitle from "@/components/template/GlobalPageTitle.vue";
import GlobalFooter from "@/components/template/GlobalFooter";
export default {
  components: {
    GlobalNav,
    Divider,
    GlobalPageTitle,
    GlobalFooter,
  },
  auth: false,
  data() {
    return {
      title_menu: "内部管理機能メニュー",
      title: "三次市　駐車場混雑表示サービスについて",
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.divider-position {
  margin: auto auto 10px auto;
}
.cookie-style {
  font-size: 1.1rem !important;
  margin-top: 94px !important;
}
.cookie-title-style {
  font-size: 18px !important;
  font-weight: bold !important;
}
.cookie-list-style {
  font-weight: 700 !important;
}
.cookie-subtitle-style {
  font-weight: bold !important;
}
.link-text-style {
  color: #337ab7 !important;
  text-decoration: underline !important;
  word-wrap: break-word !important;
}
</style>
