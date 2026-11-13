import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AppDownloadDialogComponent } from "../../shared/app-download/app-download-dialog.component";
import { CartDrawerComponent } from "../../shared/cart-drawer/cart-drawer.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { MobileTabsComponent } from "../../shared/mobile-tabs/mobile-tabs.component";

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    MobileTabsComponent,
    AppDownloadDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./main-layout.component.html",
})
export class MainLayoutComponent {}
