var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "@angular/core";
import themes from "devextreme/ui/themes";
import { currentTheme, refreshTheme } from "devextreme/viz/themes";
import { Logoff } from "../../state";
let MainLayoutComponent = class MainLayoutComponent {
    constructor(store) {
        this.store = store;
        this.currentTheme = "generic.light";
        this.loggedIn$ = this.store.select(s => s.auth.loggedIn);
        this.username$ = this.store.select(s => s.auth.username);
        this.isAdmin$ = this.store.select(s => s.auth.isAdmin);
        this.isOwner$ = this.store.select(s => s.auth.isOwner);
        this.state$ = this.store.select(s => s.auth);
        this.themes = [
            {
                id: "generic.light",
                name: "Light",
                image: "assets/img/generic-light.svg"
            },
            {
                id: "generic.dark",
                name: "Dark",
                image: "assets/img/generic-dark.svg"
            },
            {
                id: "generic.contrast",
                name: "Contrast",
                image: "assets/img/generic-contrast.svg"
            },
            {
                id: "generic.darkviolet",
                name: "Dark Violet",
                image: "assets/img/generic-darkviolet.svg"
            },
            {
                id: "generic.darkmoon",
                name: "Dark Moon",
                image: "assets/img/generic-darkmoon.svg"
            }
        ];
    }
    setTheme(e) {
        themes.current(e.value);
        currentTheme(e.value);
        refreshTheme();
    }
    logoff() {
        this.store.dispatch(new Logoff());
    }
};
MainLayoutComponent = __decorate([
    Component({
        templateUrl: "./main-layout.component.html",
        styleUrls: ["./main-layout.component.css"]
    })
], MainLayoutComponent);
export { MainLayoutComponent };
class Theme {
}
//# sourceMappingURL=main-layout.component.js.map