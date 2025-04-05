export const avatars = [
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/16860528',
    profileUrl: 'https://github.com/dillionverma',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/20110627',
    profileUrl: 'https://github.com/tomonarifeehan',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/106103625',
    profileUrl: 'https://github.com/BankkRoll',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/59228569',
    profileUrl: 'https://github.com/safethecode',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/59442788',
    profileUrl: 'https://github.com/sanjay-mali',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/89768406',
    profileUrl: 'https://github.com/itsarghyadas',
  },
];

export const assignAvatar = (name: string) => {
  const key = `avatar-${name}`;
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const random = avatars[Math.floor(Math.random() * avatars.length)];
  localStorage.setItem(key, random.imageUrl); // store image URL only
  return random.imageUrl;
};
