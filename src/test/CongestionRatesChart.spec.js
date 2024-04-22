import Vuetify from 'vuetify'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import CongestionRates from '@/store/CongestionRates.js'
import CongestionRatesChart from '~/components/CongestionRatesChart.vue'
import { Line } from '@antv/g2plot';
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
 
const localVue = createLocalVue()

describe('CongestionRatesChart', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    localVue.use(Vuex)
    wrapper = shallowMount(CongestionRatesChart, {
      data() {
        return {
          line: null,
          fomatted_congestion_rates: []
        }
      },
      data: () => ({
        congestion_rates: 0,
        line: {changeData(congestion_rates){return congestion_rates}}
      }),
      props: {
        parking_location: {
          type: Object
        }
      },
      localVue,
      store: new Vuex.Store(cloneDeep(CongestionRates)),
      Line
    })
  })

  const mountFunction = () => {
    return mount(CongestionRatesChart, {
      localVue,
      store: new Vuex.Store(cloneDeep(CongestionRates))
    })
  }

  it('renders a div', () => {
    const wrapper = mountFunction()
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('find div id congestion_chart', () => {
    const wrapper = mountFunction()
    wrapper.find('#congestion_chart').text()
    expect(wrapper.exists()).toBeTruthy()
  })

  it("renders methods showChart", () => {
    document.body.innerHTML = `
    <template>
      <v-row align="center">
        <v-col>
          <div id="congestion_chart" style="width: 10; height: 168px;"></div>
        </v-col>
      </v-row>
    </template>
    `;
    const congestionRates = [
      { parking_time: '16:30', congestion_rate: 555.555555 }
    ]
    wrapper.setData({congestion_rates: 20.3});
    wrapper.vm.showChart()

    expect(congestionRates[0].parking_time).toBe('16:30')
    expect(congestionRates[0].congestion_rate).toBe(555.555555)
  })

  it("render changeChartData", () => {
    wrapper.setData({congestion_rates: 20.5});
    wrapper.vm.changeChartData();
    expect(wrapper.vm.congestion_rates).toBe(20.5);
  })
})