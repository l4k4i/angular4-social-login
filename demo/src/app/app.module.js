"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var navbar_component_1 = require("./navbar/navbar.component");
var demo_component_1 = require("./demo/demo.component");
var angular4_social_login_1 = require("angular4-social-login");
var angular4_social_login_2 = require("angular4-social-login");
var config = new angular4_social_login_2.AuthServiceConfig([
    {
        id: angular4_social_login_2.GoogleLoginProvider.PROVIDER_ID,
        provider: new angular4_social_login_2.GoogleLoginProvider("624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com")
    },
    {
        id: angular4_social_login_2.FacebookLoginProvider.PROVIDER_ID,
        provider: new angular4_social_login_2.FacebookLoginProvider("561602290896109")
    }
]);
function provideConfig() {
    return config;
}
exports.provideConfig = provideConfig;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            navbar_component_1.NavbarComponent,
            demo_component_1.DemoComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            angular4_social_login_1.SocialLoginModule
        ],
        providers: [
            {
                provide: angular4_social_login_2.AuthServiceConfig,
                useFactory: provideConfig
            }
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
