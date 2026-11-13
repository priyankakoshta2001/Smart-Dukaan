import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PwaService } from "../../core/services/pwa.service";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-app-download-dialog",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./app-download-dialog.component.html",
})
export class AppDownloadDialogComponent {
  readonly pwa = inject(PwaService);

  readonly perks = [
    { icon: "store", title: "Shop from nearby stores", copy: "Every verified shop in your area" },
    { icon: "zap", title: "30–45 min delivery", copy: "Express slots, live rider tracking" },
    { icon: "gift", title: "App-only offers", copy: "Extra coupons & member prices" },
    { icon: "shield", title: "Safe payments", copy: "UPI, cards, COD — fully secure" },
  ];
}
