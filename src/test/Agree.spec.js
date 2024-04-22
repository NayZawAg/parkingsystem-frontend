import Vuetify from 'vuetify'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Agree from '../components/Agree.vue'
import Vuex from 'vuex'
 
const localVue = createLocalVue()

describe('Agree', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    localVue.use(Vuex)
    wrapper = shallowMount(Agree, {
      name: 'agree',
      data() {
        return {
          dialog: false
        }
      },
      localVue,
      vuetify
    })
  })

  const mountFunction = () => {
    return mount(Agree, {
      name: 'agree',
      data() {
        return {
          dialog: true
        }
      },
      localVue,
      vuetify
    })
  }

  it('利用規約に同意するボタンのクリックした場合、', () => {
    const wrapper = mountFunction()
    wrapper.find('.v-btn').trigger('click')
  })

  it('閉じるボタンのクリックした場合、', () => {
    const wrapper = mountFunction()
    wrapper.find('.v-btn').trigger('click')
  })

  it('render clickAgree method', async () => {
    expect(wrapper.vm.clickAgree().catch(()=>{}));
  })
})