import { RouterModule }  from '@angular/router';

import { MainRoutes, MainDeclarations }
 from './containers/main.routes';

export const routes = [
  ...MainRoutes
];

export const APP_DECLARATIONS = [
  ...MainDeclarations
];

export const APP_ROUTER_PROVIDERS = RouterModule.forRoot(routes);
