import { provideHttpClient, withFetch } from "@angular/common/http";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: "top",
        anchorScrolling: "enabled",
      }),
    ),
  ],
}).catch((error) => console.error(error));
