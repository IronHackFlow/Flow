import * as yup from 'yup'

export const logInSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]+$/, 'username must contain only letters and numbers and no spaces'),
  password: yup.string().required(),
})

export const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(5)
    .max(25)
    .matches(/^[a-zA-Z0-9]+$/, 'username must contain only letters and numbers and no spaces'),
  email: yup.string().required().email().min(5).max(25),
  password: yup.string().required().min(6).max(25),
})

export const saveSongSchema = yup.object().shape({
  title: yup.string().required('title is required to save your Flow').max(30),
  caption: yup.string().max(60),
})
