import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMapMenuToggler]',
})
export class MapMenuTogglerDirective {
  constructor() { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    // console.log(document.querySelector('#map-menu'));
    $event.preventDefault();
    document.querySelector('#map-menu').classList.toggle('map-menu-hidden');
  }
}
