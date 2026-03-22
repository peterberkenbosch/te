import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]

  toggle() {
    const isOpen = this.element.dataset.menuOpen === "true"
    this.#setOpen(!isOpen)
  }

  close() {
    this.#setOpen(false)
  }

  #setOpen(open) {
    this.element.dataset.menuOpen = open
    this.buttonTarget.setAttribute("aria-expanded", open)
    this.buttonTarget.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu")

    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }
}
