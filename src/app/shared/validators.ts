import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const username = control.value;
    const minLength = 3;
    const latinCharRegex = /[a-zA-Z]/;
    const isValid = username.length >= minLength && latinCharRegex.test(username);
    return isValid ? null : { invalidUsername: true };
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const minLength = 8;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const isValid =
      password.length >= minLength &&
      upperCaseRegex.test(password) &&
      lowerCaseRegex.test(password) &&
      numberRegex.test(password);
    return isValid ? null : { invalidPassword: true };
  };
}