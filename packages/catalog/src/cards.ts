import type { Card } from './types'
import { links } from './links'

export const cards: Card[] = [
  {
    title: 'Bajet',
    value: 'Nearrrrrrrrly readyyy!',
    description: 'Basically tracking and managing surplus ✨',
    icon: 'zap',
    service: links.mybajet.service,
    img: [
      'https://repository-images.githubusercontent.com/995529140/258d08f1-5937-4dd1-9679-222dd26a0190',
    ],
    link: links.mybajet.url,
    status: 'Inactive',
  },
  {
    title: 'Cukai',
    value: 'In progress...',
    description:
      "LHDN Receipt Tracker: It's time to meet LHDN but lost your receipts? -cant imagine without this app💅🏻",
    icon: 'trending-up',
    service: links.mycukai.service,
    img: [
      'https://repository-images.githubusercontent.com/995533142/e03b5d8f-ec8a-4808-bc36-4b273ef40f5f',
    ],
    link: links.mycukai.url,
    status: 'Inactive',
  },
  {
    title: 'Hafalah',
    value: 'Coming soon!',
    description:
      'Fun and gamified way to hafaz (or hafal!) your favourite verses or doa!',
    icon: 'brain',
    service: links.hafalah.service,
    img: [
      'https://repository-images.githubusercontent.com/1001527692/4e7923ec-1017-40ff-b509-e16533cb1758',
    ],
    link: links.hafalah.url,
    status: 'Inactive',
  },
  {
    title: 'NakMasak!',
    value: 'Prototype Ready 😉',
    description:
      "Still fighting over what's for dinner? Scroll infinite recipes, switch the difficulties to adjust with your mood and start cooking! 👩🏻‍🍳\t\t\t *Note that only prototype is available for now, with limited testing recipes*",
    icon: 'star',
    service: links.nakmasakapa.service,
    img: [
      'https://repository-images.githubusercontent.com/1004191160/86048d54-b1ca-4235-b953-49d4db588b9e',
    ],
    link: links.nakmasakapa.url,
    status: 'Active',
  },
  {
    title: 'Mustajab',
    value: 'Coming soon!',
    description:
      'Bayangkan ada orang ingatkan kita, "Hey, waktu mustajab untuk berdoa sekarang!" best kan? Try sekarang! [Chrome Extension]',
    icon: 'brain',
    service: links.mustajab.service,
    img: [
      'https://repository-images.githubusercontent.com/995534229/529e24ec-937a-434d-ac03-2f9af6f9f602',
    ],
    link: links.mustajab.url,
    status: 'Inactive',
  },
  {
    title: 'NakSalam',
    value: 'Progress: 92% [halted]',
    description: 'Ada orang hulur tangan, nak salam tak?',
    icon: 'target',
    service: links.naksalam.service,
    img: [
      'https://camo.githubusercontent.com/5e1b6ccf808611a49ca2cfc69479b7cdfe7ddfc4737a33058c25f63a9b77f432/68747470733a2f2f692e696d6775722e636f6d2f554256484f62552e706e67',
    ],
    link: links.naksalam.url,
    status: 'Inactive',
  },
  {
    title: 'Tadarus',
    value: 'Coming soon!',
    description: `Seronok kan baca quran ramai-ramai? Boleh buat group, baca sama-sama pastu track bacaan!
     `,
    icon: 'users',
    service: links.tadarus.service,
    img: [
      'https://github.com/gitresetsoft/library/blob/main/data/tadarus/29cc73d3-7385-48f5-9f5c-597ce302c45d.jpg?raw=true',
    ],
    link: links.tadarus.url,
    status: 'Inactive',
  },
  {
    title: 'Ragdolls',
    value: 'Coming soon!',
    description: 'RAG for kids!',
    icon: 'percent',
    service: links.ragdolls.service,
    img: [],
    link: links.ragdolls.url,
    status: 'Inactive',
  },
  {
    title: 'MunchIQ',
    value: 'Live!',
    description:
      'A cute little snack business site with a menu and contact form.',
    icon: 'star',
    service: links.munchiq.service,
    img: [],
    link: links.munchiq.url,
    status: 'Active',
  },
]
