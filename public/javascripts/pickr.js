const root = document.documentElement;

const pickr = Pickr.create({
  el: '.color-picker',
  theme: 'nano', 
  default: localStorage.getItem('colorPreference') || 'darkorchid',
  autoReposition: false,

  swatches: [
      'rgba(0, 137, 255, 1)',
      'rgba(0, 255, 9, 1)',
      'rgba(255, 253, 0, 1)',
      'rgba(197, 0, 255, 1)',
      'rgba(0, 255, 245, 1)',
      'rgba(255, 135, 0, 1)',
      'rgba(255, 0, 185, 1)',
  ],

  components: {

      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
          rgba: true,
          input: true,
          clear: true,
          save: true
      }
  }
});

pickr.on('save', (color, instance) => {
  setColors(color.toRGBA().toString());
  localStorage.setItem('colorPreference', color.toRGBA());
});


function setColors(color) {
  const [r, g, b, a] = color.split(',');
  const borderColor = color;
  let boxShadow = `${r}, ${g-10}, ${b-10}, ${a}`;

  const brightness = Math.round((
                      (parseInt(r.slice(r.indexOf('(') + 1)) * 299) +
                      (parseInt(g) * 587) +
                      (parseInt(b) * 114)) / 1000);

  const textColor = (brightness > 125) ? 'black' : 'white';

  document.getElementById('createTask').setAttribute('style', `color: ${textColor}`);
  root.style.setProperty('--borderColor', borderColor);
  root.style.setProperty('--boxShadow', boxShadow);
}

window.addEventListener('load', () => {
  setColors(localStorage.getItem('colorPreference'));
})
