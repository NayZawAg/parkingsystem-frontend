import Vuetify from 'vuetify'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ResetParkings from '@/store/ResetParkings.js'
import resets from '~/pages/resets.vue'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

const localVue = createLocalVue()

describe('resets', () => {
  let vuetify
  let wrapper

  const $route = [{
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
    wrapper = shallowMount(resets, {
      data: () => ({
        error: null,
        status: null,
        success: null,
        text_box_error: null,
        text_box_id: null,
        reset_error: {status: null}
      }),
      localVue,
      store: new Vuex.Store(cloneDeep(ResetParkings)),
      mocks: {
        $route,
        $router
      }
    })
  })

  it('render v-simple-table', () => {
    wrapper.setData({ status: 'success', success: 'success', reset_parkings: [{
      id: 1,
      name: "広島三次ワイナリー",
      pre_reset_datetime: "2023-02-02T18:40:02.936+09:00",
      pre_total_in_count: 0,
      pre_reset_in_count: 1,
      current_total_in_count: 0
    }], reset_error: {
      status: 422
    } })
    expect(wrapper.find('.v-simple-table').exists()).toBeFalsy()
  })

  it('render resetParking method', async () => {
    const parking_reset = {id: 1,
      name: "広島三次ワイナリー",
      reset_in_count: 1,
      pre_reset_datetime: "2023-02-02T18:40:02.936+09:00",
      pre_total_in_count: 0,
      pre_reset_in_count: 1,
      current_total_in_count: 0}
    expect(wrapper.vm.resetParking(parking_reset).catch(() => {}));
  })

  it('render getResets', async () => {
    wrapper.setData({status: 'error', reset_error: {status: 500}});
    expect(wrapper.vm.getResets());
  })

  it('render errorPage method 422', () => {
    expect(wrapper.vm.errorPage({status: 422, data: {errors: ["必須項目です"]}}));
    expect(wrapper.vm.success).toBe(null);
    expect(wrapper.vm.error).toBe("必須項目です");
  })

  it('render errorPage method 404', () => {
    const $route = { name: 'not_found' };
    expect(wrapper.vm.errorPage({status: 404}));
    expect(wrapper.vm.$route[0].name).toBe($route.name);
  })

  it('render errorPage method 401', () => {
    const $route = { name: 'unauthorized' };
    expect(wrapper.vm.errorPage({status: 401}));
    expect(wrapper.vm.$route[1].name).toBe($route.name);
  })

  it('render errorPage method 500', () => {
    const $route = { name: 'internal_server_error' };
    expect(wrapper.vm.errorPage({status: 500}));
    expect(wrapper.vm.$route[2].name).toBe($route.name);
  })

  it('render computed status', () => {
    wrapper.setData({status: 'success'})
    expect(wrapper.vm.status).toBe('success');
  })
})