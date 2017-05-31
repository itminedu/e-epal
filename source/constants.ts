
import {ValidatorFn} from '@angular/forms';
import {AbstractControl} from '@angular/forms';


export const COURSEFIELDS_RECEIVED = 'COURSEFIELDS_RECEIVED';
export const COURSEFIELDS_SELECTED_SAVE = 'COURSEFIELDS_SELECTED_SAVE';

export const SECTORFIELDS_RECEIVED = 'SECTORFIELDS_RECEIVED';
export const SECTORFIELDS_SELECTED_SAVE = 'SECTORFIELDS_SELECTED_SAVE';
export const SECTORFIELDS_INIT = 'SECTORFIELDS_INIT';

export const REGIONSCHOOLS_RECEIVED = 'REGIONSCHOOLS_RECEIVED';
export const REGIONSCHOOLS_SELECTED_SAVE = 'REGIONSCHOOLS_SELECTED_SAVE';
export const REGIONSCHOOLS_ORDER_SAVE = 'REGIONSCHOOLS_ORDER_SAVE';
export const REGIONSCHOOLS_INIT = 'REGIONSCHOOLS_INIT';

export const SECTORCOURSES_RECEIVED = 'SECTORCOURSES_RECEIVED';
export const SECTORCOURSES_SELECTED_SAVE = 'SECTORCOURSES_SELECTED_SAVE';
export const SECTORCOURSES_INIT = 'SECTORCOURSES_INIT';

export const STUDENTDATAFIELDS_SAVE = 'STUDENTDATAFIELDS_SAVE';
export const STUDENTDATAFIELDS_INIT = 'STUDENTDATAFIELDS_INIT';

export const EPALCLASSES_SAVE = 'EPALCLASSES_SAVE';
export const EPALCLASSES_INIT = 'EPALCLASSES_INIT';

export const LOGININFO_SAVE = 'LOGININFO_SAVE';
export const PROFILE_SAVE = 'PROFILE_SAVE';
export const STATEMENTAGREE_SAVE = 'STATEMENTAGREE_SAVE';

export const LOGININFO_RECEIVED = 'LOGININFO_RECEIVED';

export const USERINFOS_RECEIVED = 'USERINFOS_RECEIVED';
export const USERINFO_SELECTED_SAVE = 'USERINFO_SELECTED_SAVE';

export const LOGININFO_INIT = 'LOGININFO_INIT';

export const CRITERIA_RECEIVED = 'CRITERIA_RECEIVED';
export const CRITERIA_SAVE = 'CRITERIA_SAVE';
export const CRITERIA_INIT = 'CRITERIA_INIT';

//export const VALID_NAMES_PATTERN = '[Α-ΩΆΈΉΊΎΌΏα-ωάέήίύόώ ]*$';
export const VALID_NAMES_PATTERN = '[A-Za-zΑ-ΩΆΈΉΊΙΎΌΏα-ωάέήίΐύόώ ]*$';
export const VALID_ADDRESS_PATTERN = '[0-9A-Za-zΑ-ΩΆΈΉΊΎΌΏα-ωάέήίύόώ ]*$';
export const VALID_ADDRESSTK_PATTERN = '[0-9 ]*$';
<<<<<<< HEAD
export const VALID_DIGITS_PATTERN = '69[0-9]*$';
export const VALID_CAPACITY_PATTERN = '[0-9]*$';


export const VALID_DIGITS_PATTERN = '2[0-9]*$';

export const VALID_EMAIL_PATTERN = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}';

//YYYY-MM-DD FULL
//export const VALID_DATE_PATTERN = '(?:19|20)[0-9]{2}/(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))';

//MM-DD-YYYY FULL
//export const VALID_DATE_PATTERN = '(?:(?:0[1-9]|1[0-2])[\/\\-. ]?(?:0[1-9]|[12][0-9])|(?:(?:0[13-9]|1[0-2])[\/\\-. ]?30)|(?:(?:0[13578]|1[02])[\/\\-. ]?31))[\/\\-. ]?(?:19|20)[0-9]{2}';

//DD-MM-YYYY
export const VALID_DATE_PATTERN = '([1-9]|0[1-9]|[12][0-9]|3[01])[- /.]([1-9]|0[1-9]|1[012])[- /.](19|20)[0-9][0-9]';

export const SCHOOL_ROLE = 'director';
export const STUDENT_ROLE = 'student';
export const PDE_ROLE = 'pde';
export const DIDE_ROLE = 'dide';
export const MINISTRY_ROLE = 'supervisor';

export function maxValue(max: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
          isValid = input > 99;
    if(isValid) 
        return { 'maxValue': {max} }
    else 
        return null;
  };
}
