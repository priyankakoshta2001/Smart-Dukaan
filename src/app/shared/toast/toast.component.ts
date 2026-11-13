import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./toast.component.html",
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
