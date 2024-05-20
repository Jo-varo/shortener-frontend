import { animate, state, style, transition, trigger } from "@angular/animations";

export const slideDown = trigger('slideDown', [
  transition(':enter', [
    style({ opacity: 0, visibility: 'hidden', transform: 'translateY(-50px)' }),
    animate(
      '.5s ease-in',
      style({ opacity: 1, visibility: 'visible', transform: 'translateY(0)' })
    ),
  ]),
]);

export const slideUp = trigger('slideUp', [
  state('up', style({ transform: 'translateY(0)' })),
  state('down', style({ transform: 'translateY(100px)' })),
  transition('down <=> up', [animate('.5s ease-in')]),
]);

export const blink = trigger('blink', [
  transition(':increment', [
    style({ opacity: 0 }),
    animate('.5s ease-in', style({ opacity: 1 })),
  ]),
]);
