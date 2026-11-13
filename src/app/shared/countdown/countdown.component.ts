import { ChangeDetectionStrategy, Component, computed, OnDestroy, signal } from "@angular/core";

@Component({
  selector: "app-countdown",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./countdown.component.html",
})
export class CountdownComponent implements OnDestroy {
  private readonly now = signal(Date.now());
  private readonly timer = setInterval(() => this.now.set(Date.now()), 1000);

  readonly parts = computed(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const total = Math.max(0, Math.floor((end.getTime() - this.now()) / 1000));
    const pad = (value: number) => String(value).padStart(2, "0");
    return [
      { label: "Hrs", value: pad(Math.floor(total / 3600)) },
      { label: "Min", value: pad(Math.floor((total % 3600) / 60)) },
      { label: "Sec", value: pad(total % 60) },
    ];
  });

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
