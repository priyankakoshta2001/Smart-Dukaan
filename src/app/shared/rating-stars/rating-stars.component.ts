import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-rating",
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./rating-stars.component.html",
})
export class RatingStarsComponent {
  readonly rating = input.required<number>();
  readonly reviews = input<number | null>(null);
  readonly size = input(13);
  readonly showValue = input(true);
  readonly stars = [1, 2, 3, 4, 5];

  readonly filled = computed(() => Math.round(this.rating()));
}
