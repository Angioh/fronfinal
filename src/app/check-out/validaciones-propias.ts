import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidacionesPropias {
  static esNum(control: AbstractControl): ValidationErrors | null {
    const num = control.value;
    if (num) {
      if (!isNaN(num)) {
        return null;
      } else {
        return { esNum: true };
      }
    }
    return null;
  }
  static esLetra(control: AbstractControl): ValidationErrors | null {
    const name = control.value;
    if (name) {
      if (isNaN(name)) {
        return null;
      } else {
        return { esLetra: true };
      }
    }
    return null;
  }
  static cPostalExiste(control: AbstractControl): ValidationErrors | null {
    const cPostal = control.value;
    if (cPostal) {
      if (parseInt(cPostal) > 52999 || parseInt(cPostal) < 1000) {
        return { cPostalExiste: true };
      }
      return null;
    }
    return null;
  }
  static mismoCaptcha(control: AbstractControl): ValidationErrors | null {
    const captcha = control.get('captcha');
    const captchaS = control.get('captchaS');
    if (captcha && captchaS) {
      const sumCaptcha =
        parseInt(captcha.value.split('+')[0]) +
        parseInt(captcha.value.split('+')[1]);
      if (sumCaptcha != captchaS.value) {
        return { mismoCaptcha: true };
      }
      return null;
    }
    return null;
  }

  static esTelef(control: AbstractControl): ValidationErrors | null {
    const telef = control.value;
    if (telef) {
      if (
        telef.substr(0, 1) == 7 ||
        telef.substr(0, 1) == 6 ||
        telef.substr(0, 1) == 9
      ) {
        console.log(telef.substr(0, 1));
        return null;
      } else {
        return { esTelef: true };
      }
    }
    return null;
  }

  static docValido(control: AbstractControl): ValidationErrors | null {
    const typeDoc = control.get('tDocumento');
    const numDoc = control.get('nDocumento');
    if (typeDoc && numDoc) {
      if (typeDoc.value == 'CIF') {
        const cifPattern = /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/i;
        if (!cifPattern.test(numDoc.value)) {
          return { docValido: true };
        }

        const letter = numDoc.value[0].toUpperCase();
        const numbers = numDoc.value.slice(1, 8);
        const controlChar = numDoc.value[8].toUpperCase();

        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
          const digit = parseInt(numbers[i], 10);
          if (i % 2 === 0) {
            const doubled = digit * 2;
            sum += doubled > 9 ? doubled - 9 : doubled;
          } else {
            sum += digit;
          }
        }

        const calculatedControlDigit = (10 - (sum % 10)) % 10;

        if (letter.match(/[KLMNPQRSW]/)) {
          const controlLetter = 'JABCDEFGHI'[calculatedControlDigit];
          if (controlChar !== controlLetter) {
            return { docValido: true };
          }
        } else {
          if (controlChar !== calculatedControlDigit.toString()) {
            return { docValido: true };
          }
        }

        return null;
      } else if (typeDoc.value == 'NIF') {
        const nifPattern = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        if (!nifPattern.test(numDoc.value)) {
          return { docValido: true };
        }

        const numbers = numDoc.value.slice(0, 8);
        const letter = numDoc.value[8].toUpperCase();
        const calculatedLetter = 'TRWAGMYFPDXBNJZSQVHLCKE'[
          parseInt(numbers, 10) % 23
        ];

        if (letter !== calculatedLetter) {
          return { docValido: true };
        }

        return null;
      }
    }
    return null;
  }

  static fechaValida(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    if (fecha) {
      const reGex_fecha =
        /^(0[1-9]|[1-2]\d|3[01])(\/)(0[1-9]|1[012])\2(\d{4})$/;

      if (!reGex_fecha.test(fecha)) {
        return { fechaValida: true };
      }

      const [dia, mes, anho] = fecha.split('/').map(Number);

      const diasEnElMes = new Date(anho, mes, 0).getDate();
      if (dia > diasEnElMes) {
        return { fechaValida: true };
      }

      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);

      const fechaIngresada = new Date(anho, mes - 1, dia);
      fechaIngresada.setHours(0, 0, 0, 0);

      if (fechaIngresada < fechaActual) {
        return { fechaValida: true };
      }

      return null;
    }
    return null;
  }
}
