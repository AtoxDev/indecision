import { shallowMount } from "@vue/test-utils";
import indecision from '@/components/indecision';

describe('Indecision component', () => {
    let wrapper
    let clgSpy

    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({
            answer: 'yes',
            forced: false,
            image: 'https://yesno.wtf/assets/yes/2.gif'
        })
    }))

    beforeAll(() => {
        wrapper = shallowMount(indecision)
        clgSpy = jest.spyOn(console, 'log')
    })

    test('Debe de hacer match con el snapshoo', () => {
        expect(wrapper.html()).toMatchSnapshot();
    })

    test('Escribir en el input no debe de disparar nada (console.log)', async() => {

        const getAnswerSpy = jest.spyOn(wrapper.vm, 'getAnswer')
        const input = wrapper.find('input')
        await input.setValue('Hola mundo')
        expect(clgSpy).toHaveBeenCalledTimes(1)
        expect(getAnswerSpy).toHaveReturnedTimes(0)

    })

    test('Escribir el simbolo de "?" debe de disparar el getAnwer', async() => {
        const getAnswerSpy = jest.spyOn(wrapper.vm, 'getAnswer')
        const input = wrapper.find('input')
        await input.setValue('voy a ser millonario?')
        expect(getAnswerSpy).toHaveReturnedTimes(1)
    })

    test('Pruebas en getAnswer', async() => {
        await wrapper.vm.getAnswer()
        const img = wrapper.find('img')
        expect(img.exists()).toBeTruthy()
        expect(wrapper.vm.img).toBe('https://yesno.wtf/assets/yes/2.gif')
        expect(wrapper.vm.answer).toBe('SI')

    })

    test('Pruebas en getAnswer - Fallo en el API', async() => {
        fetch.mockImplementationOnce(() => Promise.reject('API is down'))
        await wrapper.vm.getAnswer()
        const img = wrapper.find('img')
        expect(img.exists()).toBeFalsy()
        expect(wrapper.vm.img).toBeNull()
        expect(wrapper.vm.answer).toBe('No se pudo cargar una imagen del API')
    })



})