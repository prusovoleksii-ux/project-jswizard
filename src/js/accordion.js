import Accordion from 'accordion-js';

export default function accordionInit() {
  new Accordion('.accordion-container', {
    duration: 300,
    showMultiple: false,
  });
}
