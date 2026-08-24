export const AUDIO_CATEGORIES = [
  { id: 'all', title: 'အားလုံး' },
  { id: 'paritta', title: 'ပရိတ်တော်' },
  { id: 'sutta', title: 'သုတ္တန်' },
  { id: 'dhamma', title: 'ဓမ္မတရား' },
  { id: 'chanting', title: 'ရွတ်ဖတ်ခြင်း' },
];

export const AUDIO_DATA = [
  {
    id: '1',
    title: 'အတ္တနိတ္တသုတ်',
    category: 'sutta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:14',
    text: 'အတ္တန္တာ ဟေတံ အတ္တန္တံ...',
  },
  {
    id: '2',
    title: 'မေတ္တာသုတ်',
    category: 'paritta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '5:30',
    text: 'သဗ္ဗေ စတော ဘိက္ခေံ...',
  },
  {
    id: '3',
    title: 'ရတနာသုံးဆူ',
    category: 'paritta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '4:45',
    text: 'ဘဂဝါ သံဃသော ဘဂဝါ...',
  },
  {
    id: '4',
    title: 'ဓမ္မစကြာသုတ်',
    category: 'sutta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '7:20',
    text: 'ဝိရာဂိယေ ကိန္နိ ဘဂဝတော...',
  },
  {
    id: '5',
    title: 'မဟာသတ္တန္နသုတ်',
    category: 'sutta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '8:15',
    text: 'သတ္တေ ဘိက္ခဝေ...',
  },
  {
    id: '6',
    title: 'ကမ္မဝိဘတ္တသုတ်',
    category: 'paritta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: '5:50',
    text: 'ကမ္မာ ခမ္မာ ဇိတာတော...',
  },
  {
    id: '7',
    title: 'မေတ္တာပိတ်',
    category: 'chanting',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: '3:40',
    text: 'သဗ္ဗေ စတော ဘိက္ခေံ...',
  },
  {
    id: '8',
    title: 'ပစိတ္တသံယောဂသုတ်',
    category: 'dhamma',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: '6:55',
    text: 'ဒေတံ ဘိက္ခဝေ...',
  },
  {
    id: '9',
    title: 'အာနန္ဒသုတ်',
    category: 'paritta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: '4:10',
    text: 'အာနန္ဒေ ဘဂဝတော...',
  },
  {
    id: '10',
    title: 'တေလကုတ္တရာသုတ်',
    category: 'sutta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: '5:25',
    text: 'တေလကုတ္တရော...',
  },
  {
    id: '11',
    title: 'အာယေကသုတ်',
    category: 'dhamma',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    duration: '7:05',
    text: 'အာယေကေ ပဗ္ဗတော...',
  },
  {
    id: '12',
    title: 'မုဆိတ္တသုတ်',
    category: 'chanting',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    duration: '4:35',
    text: 'အာဟေဝစ္ဆော...',
  },
  {
    id: '13',
    title: 'သင်္ဂဟသုတ်',
    category: 'paritta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    duration: '6:30',
    text: 'သင်္ဂဟေ သဗ္ဗဿ...',
  },
  {
    id: '14',
    title: 'ဘိက္ခူသမဂ္ဂသုတ်',
    category: 'sutta',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    duration: '5:15',
    text: 'အသောကေ...',
  },
  {
    id: '15',
    title: '၂၄ ပစ္စည်း',
    category: 'dhamma',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    duration: '9:00',
    text: 'ပစ္စည်းနိတ္တေ...',
  },
];

export const getAudioByCategory = (categoryId) => {
  if (categoryId === 'all') return AUDIO_DATA;
  return AUDIO_DATA.filter((audio) => audio.category === categoryId);
};

export const searchAudio = (query, categoryId = 'all') => {
  const filtered = getAudioByCategory(categoryId);
  if (!query.trim()) return filtered;
  const lowerQuery = query.toLowerCase();
  return filtered.filter(
    (audio) =>
      audio.title.toLowerCase().includes(lowerQuery) ||
      audio.text.toLowerCase().includes(lowerQuery),
  );
};

export const getAudioById = (id) => {
  return AUDIO_DATA.find((audio) => audio.id === id);
};
