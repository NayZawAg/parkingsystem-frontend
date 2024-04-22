import Vuetify from 'vuetify'
import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import GlobalNavBar from '~/components/GlobalNavBar.vue'
import assert from 'assert'

describe('GlobalNavBar', () => {
  const localVue = createLocalVue()
  let vuetify

  const $route = [
    {
      name: "login",
      path: "/login"
    }]
  
  const $router = {
    push: jest.fn(),
  }

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountFunction = (options) => {
    return mount(GlobalNavBar, {
      data: () => ({
        nuxt_link: "",
        user_type: null,
        loggedIn: null
      }),
      localVue,
      vuetify,
      mocks: {
        $route,
        $router,
        $auth: {
          loggedIn: true,
          logout: () => {}
        },
        $store: {state: {auth: {loggedIn: true, user: {user_type: 1}}}}
      },
      stubs: {
        NuxtLink: RouterLinkStub,
        RouterLink: RouterLinkStub
      }
    })
  }

  it('コンポーネントが存在する', () => {
    const wrapper = mountFunction()
    expect(wrapper.exists()).toBeTruthy()
    const links = wrapper.findAllComponents(RouterLinkStub)

    assert(links.at(0).text() === '駐車場混雑情報')
    assert(links.at(0).props().to === '/')
  })

  it('コンポーネントが存在する', () => {
    const wrapper = mountFunction()
    expect(wrapper.exists()).toBeTruthy()
    const links = wrapper.findAllComponents(RouterLinkStub)

    assert(links.at(0).text() === '駐車場混雑情報')
    assert(links.at(0).props().to === '/')
  })

  it('render login method', async () => {
    const $route = {name: 'login', path: '/login'}
    const wrapper = mountFunction()
    expect(wrapper.vm.login());
    expect(wrapper.vm.$route[0].path).toBe($route.path)
  })

  it('render logout method', async () => {
    const wrapper = mountFunction()
    expect(wrapper.vm.logout());
  })

  it('render mounted method', async () => {
    const wrapper = mountFunction()
    expect(wrapper.vm.mounted);
  })
})