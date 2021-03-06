import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import themes from "devextreme/ui/themes";
import { currentTheme, refreshTheme } from "devextreme/viz/themes";
import { AppState, Logoff,AuthState } from "../../state";

@Component({
    templateUrl: "./main-layout.component.html",
    styleUrls: ["./main-layout.component.css"]
})
export class MainLayoutComponent {
    state$: Observable<AuthState>;
    loggedIn$: Observable<boolean>;
    username$: Observable<string>;
    currentTheme: string = "generic.light";
    themes: Theme[];
    isAdmin$: Observable<boolean>;
    isOwner$: Observable<boolean>;

    constructor(
        private store: Store<AppState>) {
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

    setTheme(e: any) {
        themes.current(e.value);
        currentTheme(e.value);
        refreshTheme();
    }

    logoff() {
        this.store.dispatch(new Logoff());
    }
}

class Theme {
    name: string;
    id: string;
    image: string;
}