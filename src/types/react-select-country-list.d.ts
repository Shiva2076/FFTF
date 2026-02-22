declare module 'react-select-country-list' {
  export interface CountryOption {
    label: string;
    value: string;
  }

  export interface CountryList {
    getData(): CountryOption[];
  }

  export default function countryList(): CountryList;
}
