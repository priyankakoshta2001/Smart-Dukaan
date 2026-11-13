import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastComponent } from "./shared/toast/toast.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./app.component.html",
})
export class AppComponent {
  constructor() {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      });
    }
  }
}
