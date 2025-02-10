const auContext = new window.AudioContext();
const buffers: { [index: string]: AudioBuffer } = {};


async function loadSound(name: string, url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  buffers[name] = await auContext.decodeAudioData(arrayBuffer);
}


export default function playSound(name: string): void {
  if (!buffers[name]) {
    console.warn(`"${name}" not loaded yet.`);
    return;
  }

  const fonte = auContext.createBufferSource();
  fonte.buffer = buffers[name];
  fonte.connect(auContext.destination);
  fonte.start(0);
}


loadSound('placing', '../assets/placeItem.wav');