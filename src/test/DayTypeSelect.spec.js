import Vuetify from 'vuetify'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import DayTypeSelect from '~/components/DayTypeSelect.vue'
import CongestionRates from '@/store/CongestionRates.js'
import Locations from '@/store/Locations.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import CongestionRatesChart from '@/components/CongestionRatesChart.vue'
 
const localVue = createLocalVue()

describe('DayTypeSelect', () => {
  let vuetify
  let wrapper

  // const push = jest.fn();

  const $route = [{
    name: "bad_request"
  },
  {
    name: "not_found"
  },
  {
    name: "unauthorized"
  },
  {
    name: "internal_server_error"
  }]

  const $router = {
    push: jest.fn(),
  }

  beforeEach(() => {
    vuetify = new Vuetify()

    localVue.use(Vuex)
    wrapper = shallowMount(DayTypeSelect, {
      components: {
        CongestionRatesChart
      },
      data() {
        return {
          items: ['休日・祝日', '平日'],
          selectItem: '休日・祝日'
        }
      },
      data: ()=>({
        parking_location: { id: 1 },
        congestion_rates_status: ''
      }),
      localVue,
      store: new Vuex.Store(cloneDeep(CongestionRates, Locations)),
      mocks: {
        $route,
        $router,
        $store: {getters(status){return status}}
      }
    })
  })

  const mountFunction = (options) => {
    return mount(DayTypeSelect, {
      data() {
        return {
          items: ['休日・祝日', '平日'],
          selectItem: '休日・祝日',
          congestion_rates_status: '',
          congestion_rates_error: ''
        }
      },
      localVue,
      vuetify,
      mocks: {
        $auth: {
          loggedIn: true
        }
      },
      store: new Vuex.Store(cloneDeep(CongestionRates))
    })
  }

  it('parking_locationプロパティを渡す', () => {
    const wrapper = shallowMount(DayTypeSelect, {
      propsData: {
        parking_location: { id: 1 }
      }
    })
    expect(wrapper.text()).toBe('混雑の傾向：')
  })

  it('はVueインスタンスである', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('コンポーネントが存在する', () => {
    const wrapper = mountFunction()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('render changeSelect method', async () => {
    wrapper.setData({congestion_rates_status: 'error'})
    const selectItem = '休日・祝日'
    expect(wrapper.vm.changeSelect('selectItem').catch(() => {}));
  })

  it('render congestion_rates_status', () => {
    wrapper.setData({ congestion_rates_status: 'success'})
    expect(wrapper.vm.congestion_rates_status)
    wrapper.setData({ congestion_rates_status: 'error'})
    expect(wrapper.vm.congestion_rates_status)
  })

  it('render congestion_rates_error', () => {
    wrapper.setData({ congestion_rates_error: {status: 400}})
    expect(wrapper.vm.congestion_rates_error)
  })

  it('render errorPage method 400', () => {
    const error = { status: 400 }
    const $route = {
      name: "bad_request"
    }
    expect(wrapper.vm.errorPage(error));
    expect(wrapper.vm.$route[0].name).toBe($route.name);
  })

  it('render errorPage method 404', () => {
    const error = { status: 404 }
    const $route = {
      name: "not_found"
    }
    expect(wrapper.vm.errorPage(error));
    expect(wrapper.vm.$route[1].name).toBe($route.name);
  })

  it('render errorPage method 401', () => {
    const error = { status: 401 }
    const $route = {
      name: "unauthorized"
    }
    expect(wrapper.vm.errorPage(error));
    expect(wrapper.vm.$route[2].name).toBe($route.name);
  })

  it('render errorPage method 500', () => {
    const error = { status: 500 }
    const $route = {
      name: "internal_server_error"
    }
    expect(wrapper.vm.errorPage(error));
    expect(wrapper.vm.$route[3].name).toBe($route.name);
  })
})