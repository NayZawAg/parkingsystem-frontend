import Vuetify from 'vuetify'
import { mount, createLocalVue } from '@vue/test-utils'
import login from '~/pages/login.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()

describe('login', () => {
  let vuetify
  let wrapper

  const $route = ["/", "/parking_situations"]

  const $router = {
    push: jest.fn(),
  }

  beforeEach(() => {
    vuetify = new Vuetify()

    localVue.use(Vuex)
    wrapper = mount(login, {
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
      localVue,
      mocks: {
        $route,
        $router
      }
    })
  })

  const mountFunction = () => {
    return mount(login, {
      localVue
    })
  }

  it('render v-card-title', () => {
    const title = wrapper.find('.v-card__title')
    expect(title.text()).toBe('内部管理機能ログイン')
  })

  it('render error', () => {
    wrapper.setData({ form: {username: 'miyoshi', password: 'password00'} })
    wrapper.setData({ error: 'ユーザー名またはパスワードに誤りがあります。'})
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })

  it('render submit btn click', async () => {
    const wrapper = mountFunction()
    await wrapper.find('.v-btn').trigger('click')
    expect(wrapper.vm.$data.checkRequired()).toBe("必須項目です")
  })

  it('call Back btn click', async () => {
    const wrapper = mountFunction()
    await wrapper.find('.v-btn').trigger('click')
    const button = wrapper.find('.v-btn')
    expect(button.exists()).toBe(true)
  })

  it('validation submit btn click', async () => {
    const username = '';
    const password = '';
    wrapper.find('#username').setValue(username);
    wrapper.find('#password').setValue(password);

    expect(wrapper.vm.form.username).toBe(username);
    expect(wrapper.vm.form.password).toBe(password);

    expect(wrapper.vm.login_form).toBeFalsy();
  })

  it('render Back method', async () => {
    const $route = "/";
    expect(wrapper.vm.Back());
    expect(wrapper.vm.$route[0]).toBe($route);
  })

  it('render onSubmit method error', async () => {
    const username = 'c1user01'
    const password = 'password00'

    wrapper.find('#username').setValue(username);
    wrapper.find('#password').setValue(password);

    expect(wrapper.vm.form.username).toBe(username);
    expect(wrapper.vm.form.password).toBe(password);

    expect(wrapper.vm.onSubmit().catch(()=>{}));
  })
})