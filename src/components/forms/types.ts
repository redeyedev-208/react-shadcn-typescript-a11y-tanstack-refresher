export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  country: string;
  phoneNumber: string;
  bio: string;
  newsletter: boolean;
  dataProcessing: boolean;
  accountType: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormFieldProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
}
