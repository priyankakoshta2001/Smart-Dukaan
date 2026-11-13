import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "inline-flex flex-none" },
  templateUrl: "./icon.component.html",
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(1.8);
}
