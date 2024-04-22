import Vuetify from 'vuetify'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import ParkingDialog from '~/components/ParkingDialog.vue'
import CongestionRates from '@/store/CongestionRates.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { appUtilsMixin } from '../plugins/app_utils.js'
import Select from '../components/DayTypeSelect.vue'
 
const localVue = createLocalVue()

describe('ParkingDialog', () => {
  let vuetify
  let wrapper
  let display

  const $route = [
    {
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
    wrapper = shallowMount(ParkingDialog, {
      components: {
        Select
      },
      data() {
        return {
          dialog: false,
          parking_location: {},
          status: ''
        }
      },
      data: () => ({
        dialog: false,
        parking_location: {},
        status: '',
        congestion_rates: [],
        congestion_rates_status: '',
        congestion_rates_error: ''
      }),
      localVue,
      store: new Vuex.Store(cloneDeep(CongestionRates)),
      mocks: {
        $route,
        $router,
        $refs: {select: {selectItem: ""}}
      }
    })
  })

  const mountFunction = (options) => {
    return mount(ParkingDialog, {
      data() {
        return {
          dialog: false,
          parking_location: {},
          status: '',
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

  test('はVueインスタンスである', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('$emitの検証', async () => {
    const wrapper = mount(ParkingDialog)

    wrapper.vm.$emit('ChangeChartData')
    wrapper.vm.$emit('ChangeChartData', 123)
  
    await wrapper.vm.$nextTick()
    // assert event has been emitted
    expect(wrapper.emitted().ChangeChartData).toBeTruthy()
    // assert event count
    expect(wrapper.emitted().ChangeChartData.length).toBe(2)
    // assert event payload
    expect(wrapper.emitted().ChangeChartData[1]).toEqual([123])
  })

  // it('correctly updates the dialog when open method is called', () => {

  //   expect(wrapper.vm.dialog).toBe(false); //initial dialog false
  //   wrapper.vm.open(true, {id: 1, day_type: 1});  // calling component method
  //   expect(wrapper.vm.dialog).toBe(true); // open method to true

  // })

  it('render congestionRates method success', async () => {
    wrapper.setData({ congestion_rates_status: 'success'});
    expect(wrapper.vm.congestionRates({id: 1}));
  })

  it('render congestionRates method error', async () => {
    wrapper.setData({ congestion_rates_status: 'error', congestion_rates_error: 500});
    expect(wrapper.vm.congestionRates({id: 1}));
  })

  it('render errorPage method 400', () => {
    const $route = { name: 'bad_request' };
    expect(wrapper.vm.errorPage({status: 400}));
    expect(wrapper.vm.$route[0].name).toBe($route.name);
  })

  it('render errorPage method 404', () => {
    const $route = { name: 'not_found' };
    expect(wrapper.vm.errorPage({status: 404}));
    expect(wrapper.vm.$route[1].name).toBe($route.name);
  })

  it('render errorPage method 401', () => {
    const $route = { name: 'unauthorized' };
    expect(wrapper.vm.errorPage({status: 401}));
    expect(wrapper.vm.$route[2].name).toBe($route.name);
  })

  it('render errorPage method 500', () => {
    const $route = { name: 'internal_server_error' };
    expect(wrapper.vm.errorPage({status: 500}));
    expect(wrapper.vm.$route[3].name).toBe($route.name);
  })
})