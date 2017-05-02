export const API_ENDPOINT = 'https://eduslim2.minedu.gov.gr/drupal';
// export const API_ENDPOINT = 'http://eepal.dev/drupal';
// export const API_ENDPOINT = 'http://eduslim2.minedu.gov.gr/angular/eepal-front/drupal';
// export const API_ENDPOINT_PARAMS = '?config=2';
export const API_ENDPOINT_PARAMS = '';
export class AppSettings {
   public static get API_ENDPOINT(): string {
      return 'https://eduslim2.minedu.gov.gr/drupal';
//      return 'http://eepal.dev/drupal';
//    return 'http://eduslim2.minedu.gov.gr/angular/eepal-front/drupal';
   }
   public static get API_ENDPOINT_PARAMS(): string {
//      return '?config=2';
      return '';
   }
}
