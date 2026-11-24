import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "../icon/icon.component";

export interface BannerCrumb {
  label: string;
  link?: string;
}
export interface BannerStat {
  value: string | number;
  label: string;
  icon?: string;
}
export interface BannerChip {
  icon: string;
  title: string;
  sub?: string;
}

/**
 * One banner for the whole site, built only with Tailwind utilities.
 *
 * Text mode  : eyebrow + 2-line headline + copy + actions (+ art on the right).
 * Image mode : pass `desktopBanner` / `mobileBanner` to show a ready-made
 *              banner image exactly like the Home and Nearby Shops banners;
 *              buttons given in the `[actions]` slot sit on top of the image.
 *
 * Slots: [actions] buttons · [art] custom artwork · default = extra content.
 */
@Component({
  selector: "app-page-banner",
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./page-banner.component.html",
})
export class PageBannerComponent {
  readonly crumbs = input<BannerCrumb[]>([]);
  readonly eyebrow = input("");
  readonly eyebrowIcon = input("");
  readonly title = input.required<string>();
  readonly highlight = input("");
  readonly copy = input("");
  readonly points = input<string[]>([]);
  readonly stats = input<BannerStat[]>([]);

  /** artwork on the right (text mode) */
  readonly image = input("");
  readonly imageAlt = input("");
  readonly imageFit = input<"cover" | "contain">("cover");
  readonly badge = input("");
  readonly badgeIcon = input("");
  readonly chips = input<BannerChip[]>([]);
  /** set true when projecting your own `[art]` content */
  readonly split = input(false, { transform: booleanAttribute });

  /** ready-made banner images (image mode) */
  readonly desktopBanner = input("");
  readonly mobileBanner = input("");
  readonly bannerAlt = input("");
  /** aspect ratios of the two images (width / height) */
  readonly wideRatio = input("1400 / 440");
  readonly stackRatio = input("700 / 900");
  /** render an sr-only <h1> (turn off for secondary banners) */
  readonly srHeading = input(true, { transform: booleanAttribute });

  readonly align = input<"left" | "center">("left");
  readonly compact = input(false, { transform: booleanAttribute });

  readonly isSplit = computed(() => this.split() || !!this.image());
  readonly centered = computed(() => this.align() === "center");
}
