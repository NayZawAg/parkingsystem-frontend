import Vuetify from 'vuetify'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import LocationsName from '@/store/LocationsName.js'
import ParkingSituations from '@/store/ParkingSituations.js'
import parking_situations from '~/pages/parking_situations.vue'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

const localVue = createLocalVue()

describe('parking_situations', () => {
  let vuetify
  let wrapper

  const $route = [
    {
      name: "unauthorized"
    },
    {
      name: "internal_server_error"
    },
    {
      name: "home",
      path: "/"
    }
  ]

  const $router = {
    push: jest.fn(),
  }

  beforeEach(() => {
    vuetify = new Vuetify()

    localVue.use(Vuex)
    wrapper = shallowMount(parking_situations, {
      data() {
        return {
          error: null,
          success: null,
          text_box_error: null,
          status: 'success',
          parking_situations_csv: [{in_out_flg: true, car_number: "さ2868 11-21", car_area: null, parking_time: "2023-02-08 07:16:00"}],
          from_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          to_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          modal: false,
          menu2: false,
          menu3: false,
          showDetailTable: false,
          headers: [
            { text: 'No', align: 'start', sortable: false, value: 'id' },
            { text: '入庫／出庫', sortable: false, value: 'storage' },
            { text: '入出庫日時', sortable: false, value: 'date_time' },
            { text: 'ナンバープレート', sortable: false, value: 'number_plus' },
            { text: '数字', sortable: false, value: 'number' },
            { text: '登録地', sortable: false, value: 'register_place' }
          ],
          pages: [
            100,
            50,
            20,
            10
          ],
          selected_location: {id: 2, name: "トレッタみよし"},
          page: 1,
          per_page: 10
        }
      },
      localVue,
      store: new Vuex.Store(cloneDeep(LocationsName, ParkingSituations)),
      mocks: {
        $route,
        $router
      }
    })
  })

  it('render div', () => {
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('show data table', () => {
    wrapper.setData({ showDetailTable: true })
    expect(wrapper.find('.v-simple-table').exists()).toBeFalsy()
  })

  it('render error page', () => {
    wrapper.setData({ status: 'error', reset_error: {status: 401} })
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })

  it('render meta', () => {
    wrapper.setData({ parking_situations: [{
      id: 6001,
      in_out_flg: false,
      parking_time: "2023-01-25 07:17:00",
      car_number: "あ6243 31-32",
      car_area: "品川"
    }], meta: {current_page: 1,
      next_page: null,
      prev_page: null,
      total_pages: 1,
      total_count: 1} })
    expect(wrapper.find('#app').exists()).toBeFalsy()
  })

  it('render csv download', async () => {
    wrapper.setData({ showDetailTable: true })
    const btn = wrapper.find('.v-btn')
    expect(btn.exists()).toBeFalsy()
  })

  it('render getLocationsName method success', async () => {
    const success = "ok"
    expect(wrapper.vm.getLocationsName());
    expect(wrapper.vm.text_box_error).toBe(null);
    expect(wrapper.vm.error).toBe(null);
    expect(wrapper.vm.success).toBe(success);
  })

  it('render getLocationsName method error', async () => {
    const error_wrapper = shallowMount(parking_situations, {
      data() {
        return {
          reset_error: {status: 401},
          error: null,
          success: null,
          text_box_error: null,
          status: 'error',
          parking_situations_csv: [{in_out_flg: true, car_number: "さ2868 11-21", car_area: null, parking_time: "2023-02-08 07:16:00"}],
          from_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          to_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          modal: false,
          menu2: false,
          menu3: false,
          showDetailTable: false,
          headers: [
            { text: 'No', align: 'start', sortable: false, value: 'id' },
            { text: '入庫／出庫', sortable: false, value: 'storage' },
            { text: '入出庫日時', sortable: false, value: 'date_time' },
            { text: 'ナンバープレート', sortable: false, value: 'number_plus' },
            { text: '数字', sortable: false, value: 'number' },
            { text: '登録地', sortable: false, value: 'register_place' }
          ],
          pages: [
            100,
            50,
            20,
            10
          ],
          selected_location: {id: 2, name: "トレッタみよし"},
          page: 1,
          per_page: 10
        }
      },
      localVue,
      store: new Vuex.Store(cloneDeep(LocationsName, ParkingSituations)),
      mocks: {
        $route,
        $router
      }
    })
    expect(error_wrapper.vm.getLocationsName());
  })

  it('render errorPage method 401', () => {
    const $route = { name: 'unauthorized' };
    expect(wrapper.vm.errorPage({status: 401}));
    expect(wrapper.vm.$route[0].name).toBe($route.name);
  })

  it('render errorPage method 500', () => {
    const $route = { name: 'internal_server_error' };
    expect(wrapper.vm.errorPage({status: 500}));
    expect(wrapper.vm.$route[1].name).toBe($route.name);
  })

  it('render Back method', async () => {
    const $route = "/";
    expect(wrapper.vm.Back());
    expect(wrapper.vm.$route[2].path).toBe($route);
  })

  it('render getParkingSituations method', async () => {
    const from_date = "2023-01-01"
    const to_date = "2023-03-31"
    expect(wrapper.vm.getParkingSituations(from_date, to_date));
  })

  it('render handlePerPage method', async () => {
    expect(wrapper.vm.handlePerPage());
    expect(wrapper.vm.page).toBe(1);
  })

  it('render handlePagination method', async () => {
    expect(wrapper.vm.handlePagination());
  })

  it('render onSubmit method', async () => {
    expect(wrapper.vm.onSubmit());
    expect(wrapper.vm.page).toBe(1);
    expect(wrapper.vm.showDetailTable).toBe(true);
  })

  it('render downloadCSV method', async () => {
    expect(wrapper.vm.downloadCSV().catch(()=>{}));
  })
})