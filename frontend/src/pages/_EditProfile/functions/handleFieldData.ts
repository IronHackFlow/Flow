// import { IUser } from 'src/interfaces/IModels'
import { IUser } from '../../../../../backend/src/models/User'

export interface IFieldData {
  key: string
  value: string
  initialValue: string
  label: string
  placeholder: string
  hasValue: boolean
}

export type FieldObject = Record<string, IFieldData>

const getLabelText = (_field: string): string => {
  const upperCase = _field[0].toUpperCase() + _field.substring(1)
  if (_field !== 'firstName' && _field !== 'lastName') return upperCase
  return upperCase.split('N').join(' N')
}

const generateField = (_key: string, _value: string | undefined, _placeholder: string) => {
  const label = getLabelText(_key)

  const inputField = {
    key: _key,
    value: _value ?? '',
    initialValue: _value ?? '',
    label: label,
    placeholder: _value ?? _placeholder,
    hasValue: _value ? true : false,
    // isValid: function() {
    //   let isValid = false
    //   if (this.value !== this.initialValue) {
    //     isValid = true
    //   }
    //   return isValid
    // }
  }
  return inputField
}

export const getFieldData = (_section: string, _user: IUser): FieldObject => {
  switch (_section) {
    case 'Public':
      return {
        username: generateField('username', _user.username, `Add a username to your profile..`),
        about: generateField('about', _user.about, `Add a little about you..`),
        location: generateField('location', _user.location, `Where you from?`),
      }
    case 'Personal':
      return {
        firstName: generateField('firstName', _user.firstName, `What is your first name?..`),
        lastName: generateField('lastName', _user.lastName, `What is your last name?..`),
        email: generateField('email', _user.email, `What is your email address?..`),
      }
    default:
      return {
        twitter: generateField('twitter', _user.socials?.twitter, `Add your Twitter handle..`),
        instagram: generateField(
          'instagram',
          _user.socials?.instagram,
          `Add your Instagram handle..`,
        ),
        soundCloud: generateField(
          'soundCloud',
          _user.socials?.soundCloud,
          `Add your SoundCloud handle..`,
        ),
      }
  }
}
