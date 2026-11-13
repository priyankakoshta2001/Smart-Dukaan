import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-section-heading",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./section-heading.component.html",
})
export class SectionHeadingComponent {
  readonly eyebrow = input("");
  readonly title = input.required<string>();
  readonly copy = input("");
  readonly link = input("");
  readonly linkLabel = input("View all");
}
