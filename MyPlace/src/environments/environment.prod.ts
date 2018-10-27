import { environmentDefaults } from "./environment.default";

export const environment = {
    ...environmentDefaults,
    production: true,
    serverBaseUrl: "/"
};
