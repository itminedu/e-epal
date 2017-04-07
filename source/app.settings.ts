// export const API_ENDPOINT = 'http://eduslim2.minedu.gov.gr/drupal';
export const API_ENDPOINT = 'http://localhost/drupal-8.2.6';
export class AppSettings {
   public static get API_ENDPOINT(): string {
//      return 'http://eduslim2.minedu.gov.gr/drupal';
    return 'http://localhost/drupal-8.2.6';
   }
}
