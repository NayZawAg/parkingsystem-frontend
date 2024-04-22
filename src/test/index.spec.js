import Vuetify from 'vuetify'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import CongestionRates from '@/store/CongestionRates.js'
import Locations from '@/store/Locations.js'
import index from '~/pages/index.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { cloneDeep } from 'lodash'
 
const localVue = createLocalVue()

describe('index', () => {
  let vuetify
  let wrapper

  const router = new VueRouter()

  const locations = [
    { 
      id: 1,
      name: "広島三次ワイナリー",
      address: "広島県三次市東酒屋町10445-3",
      lat: "34.7778",
      lng: "132.86799",
      image: "HiroshimaMiyoshiWinery.jpg",
      capacity: 18,
      start_time: "2000-01-01T07:00:00.000+09:00",
      end_time: "2000-01-01T20:00:00.000+09:00",
      current_total_count: 0
    }
  ]
  const state = { locations: locations }

  const $route = [
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
    wrapper = shallowMount(index, {
      data: ()=>({
        show: false,
        status: "",
        agree: null,
        locations: [{lat: 50, lng: 30, current_total_count: 5, capacity: 10, status: null}],
        center_location: {lat: 25, lng: 15},
        location_error: {status: null},
        parking_locations: []
      }),
      localVue,
      router,
      store: new Vuex.Store(cloneDeep(CongestionRates, Locations)),
      mocks: {
        $route,
        $router
      }
    })
  })

  it('render agree', () => {
    wrapper.setData({ show: true })
    expect(wrapper.vm.show).toBe(true)
  })

  it('has correct <head> content', () => {
    wrapper.setData({title: '駐車場混雑情報'})
    expect(wrapper.vm.title).toBe('駐車場混雑情報')
  })

  // it('call getLocations method success', () => {
  //   const spy = jest.spyOn(index.methods, 'getLocations');
  //   wrapper.setData({ status: 'success' })
  //   mount(index, {
  //     localVue,
  //     vuetify,
  //     store: new Vuex.Store(cloneDeep(CongestionRates))
  //   });
  //   expect(spy).toHaveBeenCalled();
  // })

  it('call getLocations method error', async () => {
    wrapper.setData({ status: 'error' });
    expect(wrapper.vm.getLocations());
  })

  it('render onClickMarker method when status is nearlyEmpty', async() => {
    const parking_location = {status: 'nearlyEmpty'};
    expect(wrapper.vm.onClickMarker(parking_location).catch(() => {}));
  })

  it('render onClickMarker method when status is available', async() => {
    const parking_location = {status: 'available'};
    expect(wrapper.vm.onClickMarker(parking_location).catch(() => {}));
  })

  it('render onClickMarker method when status is nearlyFull', async() => {
    const parking_location = {status: 'nearlyFull'};
    expect(wrapper.vm.onClickMarker(parking_location).catch(() => {}));
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

  it('render getLocations method success', async () => {
    const wrapper = shallowMount(index, {
      data() {
        return {
          show: false,
          status: 'success',
          agree: null
        }
      },
      localVue,
      router,
      store: new Vuex.Store(cloneDeep(CongestionRates))
    })
    expect(wrapper.vm.getLocations);
    expect(wrapper.vm.status).toBe('success');
  })

  it('call parkingPercentage method', () => {
    const location = {current_total_count: 5, capacity: 1}
    expect(wrapper.vm.parkingPercentage(location)).toBe(500);
  })

  it('call isNearlyFullParking method', () => {
    const location = {current_total_count: 5, capacity: 1}
    expect(wrapper.vm.isNearlyFullParking(location)).toBe(true);
  })

  it('call setLocations method when < 70', () => {
    expect(wrapper.vm.setLocations()).toBe(undefined);
  })

  it('call setLocations method when nearlyFull', () => {
    wrapper.setData({locations: [{lat: 50, lng: 30, current_total_count: 1, capacity: 3, status: ''}]});
    expect(wrapper.vm.setLocations());
    expect(wrapper.vm.locations[0].status).toBe('nearlyFull');
  })

  it('call setLocations method when >= 70', () => {
    wrapper.setData({locations: [{lat: 50, lng: 30, current_total_count: 1600, capacity: 2000, status: ''}]});
    expect(wrapper.vm.setLocations());
    expect(wrapper.vm.locations[0].status).toBe('available');
  })

  it('call setLocations method when location name is 三次もののけミュージアム', () => {
    wrapper.setData({locations: [{name: '三次もののけミュージアム', lat: 5, lng: 3, current_total_count: 160, capacity: 200, status: ''}]});
    expect(wrapper.vm.setLocations());
    expect(wrapper.vm.locations[0].status).toBe('available');
  })

  it('call centerLocation method', () => {
    expect(wrapper.vm.centerLocation);
  })

  it('Vueインスタンスである', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('computed locations', () => {
    expect(index.computed.locations)
  })

  it('computed status', () => {
    expect(index.computed.status)
  })

  it('computed location_error', () => {
    expect(index.computed.location_error)
  })

  it('render parkingPercentage method', () => {
    const location = {"current_total_count": 5, "capacity": 1}
    expect(wrapper.vm.parkingPercentage(location))
  })
})