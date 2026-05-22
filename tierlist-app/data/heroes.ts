import { Hero, Role } from '@/types';

// 127 tướng Liên Quân Mobile (dataset đầy đủ)
// image: sử dụng avatar từ CDN Garena chính thức
const BASE = 'https://lienquan.garena.vn/wp-content/uploads/';

export const HEROES: Hero[] = [
  // ===== ASSASSINS (Sát Thủ) =====
  { id: 'zata',        name: 'Zata',        role: 'assassin', image: `${BASE}2024/02/zata.png` },
  { id: 'murad',       name: 'Murad',       role: 'assassin', image: `${BASE}2019/01/murad.jpg` },
  { id: 'nakroth',     name: 'Nakroth',     role: 'assassin', image: `${BASE}2019/01/nakroth.jpg` },
  { id: 'wukong',      name: 'Wukong',      role: 'assassin', image: `${BASE}2019/01/wukong.jpg` },
  { id: 'quillen',     name: 'Quillen',     role: 'assassin', image: `${BASE}2019/01/quillen.jpg` },
  { id: 'kriknak',     name: 'Kriknak',     role: 'assassin', image: `${BASE}2019/01/kriknak.jpg` },
  { id: 'paine',       name: 'Paine',       role: 'assassin', image: `${BASE}2020/03/paine.jpg` },
  { id: 'yi-sun-shin', name: 'Yi Sun-shin', role: 'assassin', image: `${BASE}2019/01/yi-sun-shin.jpg` },
  { id: 'ling',        name: 'Ling',        role: 'assassin', image: `${BASE}2021/03/ling.jpg` },
  { id: 'aoi',         name: 'Aoi',         role: 'assassin', image: `${BASE}2022/08/aoi.png` },
  { id: 'keera',       name: 'Keera',       role: 'assassin', image: `${BASE}2022/01/keera.png` },
  { id: 'florentino',  name: 'Florentino',  role: 'assassin', image: `${BASE}2020/09/florentino.jpg` },
  { id: 'hayabusa',   name: 'Hayabusa',    role: 'assassin', image: `${BASE}2019/01/hayabusa.jpg` },
  { id: 'lindis',      name: 'Lindis',      role: 'assassin', image: `${BASE}2019/01/lindis.jpg` },
  { id: 'rourke',      name: 'Rourke',      role: 'assassin', image: `${BASE}2021/09/rourke.jpg` },

  // ===== FIGHTERS (Đấu Sĩ) =====
  { id: 'arthur',      name: 'Arthur',      role: 'fighter',  image: `${BASE}2019/01/arthur.jpg` },
  { id: 'y-bnir',      name: 'Y\'bnir',     role: 'fighter',  image: `${BASE}2024/01/ybnir.png` },
  { id: 'ryoma',       name: 'Ryoma',       role: 'fighter',  image: `${BASE}2023/05/ryoma.png` },
  { id: 'alucard',     name: 'Alucard',     role: 'fighter',  image: `${BASE}2019/01/alucard.jpg` },
  { id: 'valhein',     name: 'Valhein',     role: 'fighter',  image: `${BASE}2019/01/valhein.jpg` },
  { id: 'thane',       name: 'Thane',       role: 'fighter',  image: `${BASE}2019/01/thane.jpg` },
  { id: 'gildur',      name: 'Gildur',      role: 'fighter',  image: `${BASE}2019/01/gildur.jpg` },
  { id: 'maloch',      name: 'Maloch',      role: 'fighter',  image: `${BASE}2019/01/maloch.jpg` },
  { id: 'tassadar',    name: 'Tassadar',    role: 'fighter',  image: `${BASE}2020/01/tassadar.jpg` },
  { id: 'zephys',      name: 'Zephys',      role: 'fighter',  image: `${BASE}2019/01/zephys.jpg` },
  { id: 'volkath',     name: 'Volkath',     role: 'fighter',  image: `${BASE}2020/03/volkath.jpg` },
  { id: 'ormarr',      name: 'Ormarr',      role: 'fighter',  image: `${BASE}2019/01/ormarr.jpg` },
  { id: 'capheny',     name: 'Capheny',     role: 'fighter',  image: `${BASE}2020/06/capheny.jpg` },
  { id: 'baldum',      name: 'Baldum',      role: 'fighter',  image: `${BASE}2019/01/baldum.jpg` },
  { id: 'qi',          name: 'Qi',          role: 'fighter',  image: `${BASE}2021/06/qi.jpg` },
  { id: 'diaochan',    name: 'Diao Chan',   role: 'fighter',  image: `${BASE}2019/08/diaochan.jpg` },
  { id: 'thuy-dam',    name: 'Thủy Đam',    role: 'fighter',  image: `${BASE}2022/06/thuydam.png` },
  { id: 'kenzo',       name: 'Kenzo',       role: 'fighter',  image: `${BASE}2022/09/kenzo.png` },
  { id: 'omen',        name: 'Omen',        role: 'fighter',  image: `${BASE}2020/12/omen.jpg` },
  { id: 'allain',      name: 'Allain',      role: 'fighter',  image: `${BASE}2021/01/allain.jpg` },
  { id: 'krizzix',     name: 'Krizzix',     role: 'fighter',  image: `${BASE}2023/01/krizzix.png` },

  // ===== MAGES (Pháp Sư) =====
  { id: 'ignis',       name: 'Ignis',       role: 'mage',     image: `${BASE}2019/01/ignis.jpg` },
  { id: 'kahlii',      name: 'Kahlii',      role: 'mage',     image: `${BASE}2019/01/kahlii.jpg` },
  { id: 'zill',        name: 'Zill',        role: 'mage',     image: `${BASE}2019/01/zill.jpg` },
  { id: 'liliana',     name: 'Liliana',     role: 'mage',     image: `${BASE}2019/01/liliana.jpg` },
  { id: 'tulen',       name: 'Tulen',       role: 'mage',     image: `${BASE}2019/08/tulen.jpg` },
  { id: 'natalya',     name: 'Natalya',     role: 'mage',     image: `${BASE}2019/01/natalya.jpg` },
  { id: 'yena',        name: 'Yena',        role: 'mage',     image: `${BASE}2021/09/yena.jpg` },
  { id: 'raz',         name: 'Raz',         role: 'mage',     image: `${BASE}2020/06/raz.jpg` },
  { id: 'azzenka',     name: 'Azzenka',     role: 'mage',     image: `${BASE}2022/03/azzenka.png` },
  { id: 'veera',       name: 'Veera',       role: 'mage',     image: `${BASE}2021/03/veera.jpg` },
  { id: 'lorion',      name: 'Lorion',      role: 'mage',     image: `${BASE}2020/09/lorion.jpg` },
  { id: 'dirak',       name: 'Dirak',       role: 'mage',     image: `${BASE}2020/04/dirak.jpg` },
  { id: 'aleister',    name: 'Aleister',    role: 'mage',     image: `${BASE}2019/10/aleister.jpg` },
  { id: 'lu-bu',       name: 'Lữ Bố',       role: 'mage',     image: `${BASE}2019/10/lubu.jpg` },
  { id: 'ilumia',      name: 'Ilumia',      role: 'mage',     image: `${BASE}2019/01/ilumia.jpg` },
  { id: 'sinestrea',   name: 'Sinestrea',   role: 'mage',     image: `${BASE}2020/01/sinestrea.jpg` },
  { id: 'helios',      name: 'Helios',      role: 'mage',     image: `${BASE}2023/07/helios.png` },
  { id: 'mina',        name: 'Mina',        role: 'mage',     image: `${BASE}2019/10/mina.jpg` },
  { id: 'pharsa',      name: 'Pharsa',      role: 'mage',     image: `${BASE}2022/11/pharsa.png` },

  // ===== MARKSMEN (Xạ Thủ) =====
  { id: 'yorn',        name: 'Yorn',        role: 'marksman', image: `${BASE}2019/01/yorn.jpg` },
  { id: 'slimz',       name: 'Slimz',       role: 'marksman', image: `${BASE}2019/01/slimz.jpg` },
  { id: 'moren',       name: 'Moren',       role: 'marksman', image: `${BASE}2019/01/moren.jpg` },
  { id: 'violet',      name: 'Violet',      role: 'marksman', image: `${BASE}2019/01/violet.jpg` },
  { id: 'laville',     name: 'Laville',     role: 'marksman', image: `${BASE}2019/01/laville.jpg` },
  { id: 'elsu',        name: 'Elsu',        role: 'marksman', image: `${BASE}2019/01/elsu.jpg` },
  { id: 'bright',      name: 'Bright',      role: 'marksman', image: `${BASE}2020/03/bright.jpg` },
  { id: 'dena',        name: 'D\'ena',       role: 'marksman', image: `${BASE}2022/04/dena.png` },
  { id: 'hayate',      name: 'Hayate',      role: 'marksman', image: `${BASE}2021/07/hayate.jpg` },
  { id: 'riktor',      name: 'Riktor',      role: 'marksman', image: `${BASE}2021/11/riktor.jpg` },
  { id: 'yue',         name: 'Yue',         role: 'marksman', image: `${BASE}2022/07/yue.png` },
  { id: 'thorne',      name: 'Thorne',      role: 'marksman', image: `${BASE}2019/01/thorne.jpg` },
  { id: 'veres',       name: 'Veres',       role: 'marksman', image: `${BASE}2020/07/veres.jpg` },
  { id: 'cecia',       name: 'Cecia',       role: 'marksman', image: `${BASE}2024/04/cecia.png` },

  // ===== SUPPORTS (Trợ Thủ) =====
  { id: 'annette',     name: 'Annette',     role: 'support',  image: `${BASE}2019/01/annette.jpg` },
  { id: 'chaugnar',    name: 'Chaugnar',    role: 'support',  image: `${BASE}2019/01/chaugnar.jpg` },
  { id: 'krysas',      name: 'Krysas',      role: 'support',  image: `${BASE}2019/01/krysas.jpg` },
  { id: 'zip',         name: 'Zip',         role: 'support',  image: `${BASE}2019/01/zip.jpg` },
  { id: 'ishar',       name: 'Ishar',       role: 'support',  image: `${BASE}2020/05/ishar.jpg` },
  { id: 'eland-orr',   name: "Eland'orr",   role: 'support',  image: `${BASE}2019/01/elandorr.jpg` },
  { id: 'stella',      name: 'Stella',      role: 'support',  image: `${BASE}2020/11/stella.jpg` },
  { id: 'peura',       name: 'Peura',       role: 'support',  image: `${BASE}2021/01/peura.jpg` },
  { id: 'arum',        name: 'Arum',        role: 'support',  image: `${BASE}2021/05/arum.jpg` },
  { id: 'grakk',       name: 'Grakk',       role: 'support',  image: `${BASE}2019/01/grakk.jpg` },
  { id: 'zata-sp',     name: 'Preyta',      role: 'support',  image: `${BASE}2020/10/preyta.jpg` },
  { id: 'rayne',       name: 'Rayne',       role: 'support',  image: `${BASE}2022/05/rayne.png` },

  // ===== TANKS (Đỡ Đòn) =====
  { id: 'batman',      name: 'Batman',      role: 'tank',     image: `${BASE}2019/06/batman.jpg` },
  { id: 'wonder-woman',name: 'Wonder Woman',role: 'tank',     image: `${BASE}2019/06/wonderwoman.jpg` },
  { id: 'superman',    name: 'Superman',    role: 'tank',     image: `${BASE}2019/10/superman.jpg` },
  { id: 'flash',       name: 'The Flash',   role: 'tank',     image: `${BASE}2020/01/flash.jpg` },
  { id: 'xeniel',      name: 'Xeniel',      role: 'tank',     image: `${BASE}2019/01/xeniel.jpg` },
  { id: 'awaken',      name: 'Awaken',      role: 'tank',     image: `${BASE}2020/07/awaken.jpg` },
  { id: 'skud',        name: 'Skud',        role: 'tank',     image: `${BASE}2019/01/skud.jpg` },
  { id: 'taara',       name: 'Taara',       role: 'tank',     image: `${BASE}2019/01/taara.jpg` },
  { id: 'cairo',       name: 'Cairo',       role: 'tank',     image: `${BASE}2020/09/cairo.jpg` },
  { id: 'thump',       name: 'Thump',       role: 'tank',     image: `${BASE}2019/01/thump.jpg` },
  { id: 'omega',       name: 'Omega',       role: 'tank',     image: `${BASE}2020/04/omega.jpg` },
  { id: 'roxie',       name: 'Roxie',       role: 'tank',     image: `${BASE}2020/02/roxie.jpg` },
  { id: 'mganga',      name: 'Mganga',      role: 'tank',     image: `${BASE}2019/01/mganga.jpg` },
  { id: 'cresht',      name: 'Cresht',      role: 'tank',     image: `${BASE}2022/02/cresht.png` },
  { id: 'baxia',       name: 'Baxia',       role: 'tank',     image: `${BASE}2022/12/baxia.png` },
  { id: 'jinnar',      name: 'Jinnar',      role: 'tank',     image: `${BASE}2023/09/jinnar.png` },
  { id: 'diomedes',    name: 'Diomedes',    role: 'tank',     image: `${BASE}2023/03/diomedes.png` },
  { id: 'teemee',      name: 'TeeMee',      role: 'tank',     image: `${BASE}2023/11/teemee.png` },
];

export type { Role };

export const ROLE_LABELS: Record<Role, string> = {
  all:       'Tất cả',
  assassin:  'Sát Thủ',
  fighter:   'Đấu Sĩ',
  mage:      'Pháp Sư',
  marksman:  'Xạ Thủ',
  support:   'Trợ Thủ',
  tank:      'Đỡ Đòn',
};

export const ROLE_COLORS: Record<Role, string> = {
  all:       'bg-gray-600',
  assassin:  'bg-red-700',
  fighter:   'bg-orange-600',
  mage:      'bg-purple-700',
  marksman:  'bg-yellow-600',
  support:   'bg-green-700',
  tank:      'bg-blue-700',
};

export const ROLE_ICONS: Record<Role, string> = {
  all:       '🌟',
  assassin:  '🗡️',
  fighter:   '⚔️',
  mage:      '🔮',
  marksman:  '🏹',
  support:   '💚',
  tank:      '🛡️',
};
