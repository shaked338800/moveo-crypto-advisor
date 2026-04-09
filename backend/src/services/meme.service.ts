const MEMES = [
  { id: '1', url: 'https://i.imgflip.com/1bij.jpg',    title: 'When Bitcoin dips again' },
  { id: '2', url: 'https://i.imgflip.com/2fm6x.jpg',   title: 'HODLing through the bear market' },
  { id: '3', url: 'https://i.imgflip.com/3oevdk.jpg',  title: 'Me checking my portfolio every 5 minutes' },
  { id: '4', url: 'https://i.imgflip.com/26am.jpg',    title: 'This is fine — crypto edition' },
  { id: '5', url: 'https://i.imgflip.com/1otk96.jpg',  title: 'When the dip keeps dipping' },
  { id: '6', url: 'https://i.imgflip.com/30b1gx.jpg',  title: 'Buying the dip like' },
  { id: '7', url: 'https://i.imgflip.com/4t0m5.jpg',   title: 'When someone says crypto is dead' },
  { id: '8', url: 'https://i.imgflip.com/9ehk.jpg',    title: 'My portfolio on a red day' },
];

export const getRandomMeme = () => {
  const index = Math.floor(Math.random() * MEMES.length);
  return MEMES[index];
};
