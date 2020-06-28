import * as yup from 'yup'

yup.addMethod(yup.string, 'req', function(message) {
  return this.required(message || 'Это поле обязательно')
})

yup.addMethod(yup.string, 'series', function(message) {
  return this.matches(/^[0-9]{6}$/, message || 'Серия состоит из 6-ти цифр')
})

yup.addMethod(yup.string, 'number', function(message) {
  return this.matches(/^[0-9]{7}$/, message || 'Номер состоит из 7-ти цифр')
})

yup.addMethod(yup.string, 'reg_number', function(message) {
  return this.matches(/^[0-9]+$/, message || 'Номер должен быть целым положительным числом')
})

yup.addMethod(yup.string, 'specialty', function(message) {
  return this.matches(/^[0-9.]{4,10} .+$/, message || 'Специальность должна иметь числовой код (цифры, разделенные точками) и описание, разделенные пробелом')
})

yup.addMethod(yup.string, 'id', function(message) {
  return this.matches(/^\s*\w{4}-\w{4}-\w{4}-\w{4}\s*$/, message || 'Код документа имеет вид XXXX-XXXX-XXXX-XXXX')
})

yup.addMethod(yup.date, 'req', function(message) {
  return this.required(message || 'Это поле обязательно')
})

export default yup
