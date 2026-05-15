export interface Product {
  id: number;
  name: string;
  price: number;
  category: "fashion" | "handicraft";
  image: string;
  description: string;
  artisan: string;
  rating?: number;
  originalPrice?: number;
}

export const products: Product[] = [
  // ================= FASHION =================
  {
    id: 1,
    name: "Ibitenge w'Abagore",
    price: 85000,
    originalPrice: 100000,
    category: "fashion",
    image: "image/2.jpeg",
    description:
      "Umushanana mwiza wa Kinyarwanda uboshywe neza kandi ubereye ibirori gakondo.",
    artisan: "Kigali Fashion Designers",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Agaseke",
    price: 35000,
    category: "fashion",
    image: "image/4.jpeg",
    description:
      "Ijipo ikozwe mu gitambaro cya Kitenge gifite amabara meza kandi kiramba.",
    artisan: "Mama Rwanda Styles",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Ishati ya Kitenge y'Abagabo",
    price: 40000,
    category: "fashion",
    image: "imgage/boss.jpeg",
    description:
      "Ishati nziza y'abagabo ikozwe muri Kitenge igezweho kandi yoroshye.",
    artisan: "Kigali Men Wear",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Ikoti rya Kitenge",
    price: 75000,
    category: "fashion",
    image: "image/gentle.jpeg",
    description:
      "Ikoti rigezweho rihuza umuco nyarwanda n'imyambarire ya moderne.",
    artisan: "Urban Rwanda Fashion",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Inkweto z'Imigongo",
    price: 30000,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    description:
      "Inkweto nziza zifite imitako y'Imigongo ikorwa n'abanyabugeni b'u Rwanda.",
    artisan: "Rwanda Handmade Shoes",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Agaseke Hand Bag",
    price: 45000,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
    description:
      "Isakoshi nziza ikozwe mu buryo bwa Agaseke gakondo k'u Rwanda.",
    artisan: "Agaseke Collections",
    rating: 4.8,
  },
  {
    id: 7,
    name: "Igitambaro cya Kinyarwanda",
    price: 18000,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600",
    description:
      "Igitambaro cyoroshye kandi cyiza gifite ibirango by'umuco nyarwanda.",
    artisan: "Nyanza Fashion Hub",
    rating: 4.7,
  },
  {
    id: 8,
    name: "Umukufi w'Amasaro",
    price: 15000,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    description: "Umukufi w'amasaro meza akoze mu buryo bwa gakondo nyarwanda.",
    artisan: "Kigali Beads",
    rating: 4.8,
  },

  // ================= HANDICRAFT =================
  {
    id: 9,
    name: "Agaseke k'Amahoro",
    price: 25000,
    originalPrice: 32000,
    category: "handicraft",
    image: "image/4.jpeg",
    description:
      "Agaseke gakondo gakozwe n'intoki, ikimenyetso cy'amahoro n'ubumwe.",
    artisan: "Abanyabukorikori b'i Huye",
    rating: 5.0,
  },
  {
    id: 10,
    name: "Igishushanyo cy'Imigongo",
    price: 60000,
    category: "handicraft",
    image: "image/imigongo.jpeg",
    description:
      "Ubukorikori bw'Imigongo bukozwe mu buryo gakondo bw'u Rwanda.",
    artisan: "Imigongo Artists Rwanda",
    rating: 4.9,
  },
  {
    id: 11,
    name: "Ingoma Nyarwanda",
    price: 95000,
    category: "handicraft",
    image: "image/ingoma.jpeg",
    description: "Ingoma nziza ikoreshwa mu mbyino n'umuco nyarwanda.",
    artisan: "Cultural Drums Rwanda",
    rating: 5.0,
  },
  {
    id: 12,
    name: "Agacuma k'Amata",
    price: 28000,
    category: "handicraft",
    image: "image/akebo.jpeg",
    description:
      "Agacuma gakondo gakoreshwaga mu kubikamo amata mu Rwanda rwo hambere.",
    artisan: "Nyanza Heritage Crafts",
    rating: 4.7,
  },
  {
    id: 13,
    name: "Ikibindi cy'Ibikoresho",
    price: 22000,
    category: "handicraft",
    image: "image/igisabo.jpeg",
    description: "Ikibindi cyiza gikozwe mu mibereshi n'imigwegwe gakondo.",
    artisan: "Rwanda Basket Makers",
    rating: 4.6,
  },
  {
    id: 14,
    name: "Akabindi k'Ikawa",
    price: 35000,
    category: "handicraft",
    image: "image/3.jpeg",
    description:
      "Akabindi gakozwe mu ibumba kabugenewe gutekesha ikawa nyarwanda.",
    artisan: "Gisenyi Pottery",
    rating: 4.8,
  },
  {
    id: 15,
    name: "Igikoresho cy'Umuziki Inanga",
    price: 120000,
    category: "handicraft",
    image: "image/ingoma.jpeg",
    description: "Inanga gakondo y'u Rwanda ikozwe mu giti cyiza kandi iramba.",
    artisan: "Rwanda Music Crafts",
    rating: 5.0,
  },
  {
    id: 16,
    name: "Icyibo cy'Amasaro",
    price: 30000,
    category: "handicraft",
    image: "image/akebo.jpeg",
    description: "Icyibo cyiza cyubakishijwe amasaro n'imigwegwe gakondo.",
    artisan: "Kigali Women Cooperative",
    rating: 4.8,
  },
  {
    id: 17,
    name: "Ifoto y'Inyambo",
    price: 50000,
    category: "handicraft",
    image: "image/inyambo.jpeg",
    description: "Igishushanyo cy'Inyambo, inka z'umuco nyarwanda.",
    artisan: "Royal Arts Rwanda",
    rating: 4.9,
  },
  {
    id: 18,
    name: "Agatadowa k'Icyuma",
    price: 18000,
    category: "handicraft",
    image: "image/imigongo.jpeg",
    description: "Igishushanyo cy'Inyambo, inka z'umuco nyarwanda.",
    artisan: "Royal Arts Rwanda",
    rating: 4.9,
  },
];
