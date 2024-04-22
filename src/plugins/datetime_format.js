import Vue from 'vue'
import moment from 'moment'

Vue.filter('datetime', function (value) {
  const datetime = moment(value);
  return datetime.format("YYYY年MM月DD日 HH:mm:ss");
})