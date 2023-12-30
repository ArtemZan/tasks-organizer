import { setLocale } from 'yup'

setLocale({
  string: { email: 'Please enter a valid email address' },
  mixed: { required: 'This field is required' },
})