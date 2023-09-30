import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') toggle: boolean = false;

  constructor() {}
  @HostListener('click') onToggle() {
    this.toggle = !this.toggle;
  }
}
