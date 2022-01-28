import * as yup from "yup"

export let logInSchema = yup.object().shape({
  user_name: 
    yup
      .string()
      .required()
      .matches(/^[a-zA-Z0-9]+$/, "username must contain only letters and numbers and no spaces"),
  password:
   yup
    .string()
    .required()
})
  
export let signUpSchema = yup.object().shape({
  user_name: 
    yup
      .string()
      .required()
      .min(5)
      .max(25)
      .matches(/^[a-zA-Z0-9]+$/, "username must contain only letters and numbers and no spaces"),
  email: 
    yup
      .string()
      .required()
      .email()
      .min(5)
      .max(25),
  password: 
    yup
      .string()
      .required()
      .min(6)
      .max(25)
})

export let saveSongSchema = yup.object().shape({
  name: 
    yup
      .string()
      .required("name is required to save your Flow")
      .max(30),
  caption:
    yup
      .string()
      .max(40)
})
// export const useValidateInput = ({type}) => {
//   let schema = type === "signUp" ? signUpSchema : logInSchema


//   const validateAll = (toValidate) => {
//     schema.validate(toValidate, { abortEarly: false})
//       .then(res => {

//       })
//       .catch(err => {

//       })
//   }

//   const validateOne = (error, setError)  => {
//     let errors = []
//     yup.reach(schema, error?.name).validate(error?.state)
//       .then(res => {

//       })
//       .catch(err => {
//         err.errors.forEach(error => {
//           errors.push(error)
//         })
//       })
//     return { errors, }
//   }

//   return { validateOne, validateAll }
// }