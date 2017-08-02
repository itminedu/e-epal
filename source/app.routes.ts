import { RouterModule } from "@angular/router";

import { MainDeclarations, MainRoutes } from "./containers/main.routes";

export const routes = [
    ...MainRoutes
];

export const APP_DECLARATIONS = [
    ...MainDeclarations
];

export const APP_ROUTER_PROVIDERS = RouterModule.forRoot(routes);
