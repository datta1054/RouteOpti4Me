import tinycolor from 'tinycolor2';

export const generateColor = (seed=null) => {
  seed = seed ?? Math.random();
  const color = '#' + Math.floor(
    Math.abs(Math.sin(seed) * 16777215)
  ).toString(16)
  return color
}

export const darken = (color) => {
  const tc = tinycolor(color);
  if (tc.isValid) {
    const format = tc.getFormat();
    const hslOc = tc.toHsl();
    let nc = color;
    if(hslOc.l > 0.5) {
      nc = tinycolor({...hslOc, l: 0.5}).toString(format);
    }
    return nc;
  } else {
    return color;
  }
}