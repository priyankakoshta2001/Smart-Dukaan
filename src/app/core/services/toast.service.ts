import { Injectable, signal } from "@angular/core";
import type { ToastMessage } from "../models";

@Injectable({ providedIn: "root" })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);
  private nextId = 1;

  show(text: string, tone: ToastMessage["tone"] = "success"): void {
    const id = this.nextId++;
    this.messages.update((list) => [...list.slice(-2), { id, text, tone }]);
    setTimeout(() => this.dismiss(id), 3400);
  }

  dismiss(id: number): void {
    this.messages.update((list) => list.filter((message) => message.id !== id));
  }
}
