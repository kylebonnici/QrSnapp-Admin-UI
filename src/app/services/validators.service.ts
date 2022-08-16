import { Injectable } from '@angular/core';
import {FormControl} from '@angular/forms';

@Injectable()
export class ValidatorsService {

  constructor() { }

  public isInteger = (control: FormControl) => {
    return this.check_if_is_integer(control.value) ? null : {
      notNumeric: true
    };
  }

  public isPositiveInteger = (control: FormControl) => {
    if (this.check_if_is_integer(control.value)) {
      if (parseInt(control.value) > 0) {
        return null;
      } else {
        return {notNumeric: true};
      }
    } else {
       return {notNumeric: true};
    }
  }

  private check_if_is_integer(value) {
    if ((parseFloat(value) === parseInt(value)) && !isNaN(value)) {
      // I can have spacespacespace1 - which is 1 and validators pases but
      // spacespacespace doesn't - which is what i wanted.
      // 1space2 doesn't pass - good
      // of course, when saving data you do another parseInt.
      return true;
    } else {
      return false;
    }
  }
}
