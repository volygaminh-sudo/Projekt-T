const heroesData = [
  {
    "name": "Keera",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/8491520381ab2a66489a6c5e1ec98e785e452a5c9fd3c1.jpg",
    "tier": "S+",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Nakroth",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/769a9fe6cb9b9725127a094bb6dd36545f0ed6543592e1.jpg",
    "tier": "S+",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Butterfly",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/769a9fe6cb9b9725127a094bb6dd36545f0ed6543592e1.jpg",
    "tier": "S+",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Quillen",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f6004ed060dcff380fc5b13574986bbc5bf778bc905561.jpg",
    "tier": "S+",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Violet",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f91d8c95b3b0c11c6fe5b8ac20e48cbd5d25650254d571.jpg",
    "tier": "S+",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Capheny",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/5c3212f3d7a6f95ad04a309d4d1f340a5ca5c222bda911.jpg",
    "tier": "S+",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Lauriel",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/aea009bf921dd684d19ee76c0c1441215ef5c39d1bd6b1.jpg",
    "tier": "S+",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Airi",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/122fe2fc229ca42dcbe6946db07ccd435b345a87702a11.png",
    "tier": "S+",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Florentino",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/9527c1cbad1c0656d0a4adf1dcec38e35c25f62d77d671.jpg",
    "tier": "S+",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Zata",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/219b09a656af5274629409109ea2802d5d9472fe58bd81.jpg",
    "tier": "S+",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Yue",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/680ef284724e077237f33cfc2d8fa72d5fa194bad60f31.jpg",
    "tier": "S+",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Murad",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/7dba55e7f433ab78ac6bd2cdfeec13495983e122346461.jpg",
    "tier": "S",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Sinestrea",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/680ef284724e077237f33cfc2d8fa72d5fa194bad60f31.jpg",
    "tier": "S",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Bright",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/0045a9d59dc140647f4fa67b446c732c5fc55919650441.jpg",
    "tier": "S",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Kaine",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/bb649e26633a61d78f7147d56c0828c6658d3bb600ae01.jpg",
    "tier": "S",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Laville",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/c30059d2dc46ed31b72a4b02aa9e61f75eb136829228d1.jpg",
    "tier": "S",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Wisp",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f3a7fe63c79a26ea789064ea3361781f5aec0b6084aa01.jpg",
    "tier": "S",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Ignis",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/d5166c51f37b444810f2ae3df056920d5c4938c59a4821.jpg",
    "tier": "S",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Tulen",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/07210c9e529faa7766ba324bd86b75165a81722f3eab81.jpg",
    "tier": "S",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Sephera",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/eef053fb25793d536185559e8bf5a82d5c132caaa102e1.jpg",
    "tier": "S",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Thane",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/71e488144b7dc9f13d40321ce0556efc5847d39f2071a1.png",
    "tier": "S",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Maloch",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/e645dfa331fa48d593b33352e1f8030e636e1b3e19b951.jpg",
    "tier": "S",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Richter",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/749d47479eb9744d656b5e7c59f213555b1914bf90d291.jpg",
    "tier": "S",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Ryoma",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/bb649e26633a61d78f7147d56c0828c6658d3bb600ae01.jpg",
    "tier": "S",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Lu Bu",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/82a7e1d31f6b20d3faa502e1a215b76c6595119091e7a2-e1718879982854.jpg",
    "tier": "S",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Yena",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/61fa157164bf9d99e65bf40b802fb5745cfe1cd72c4671.jpg",
    "tier": "S",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Annette",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/17f4f562b9121128b4aff9e7b41644185f041e77964551.jpg",
    "tier": "S",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Erin",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f1db425eba8ea88e5d4d8427c1706bcf6100183de1cc11.jpeg",
    "tier": "S",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Ming",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/b4563fbfd5756caeea04b7ef488ee39f60fffd803e9ab1.jpeg",
    "tier": "S",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Dyadia",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2026/01/SeaTalk_IMG_20260119_104427.jpg",
    "tier": "A",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Edras",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2025/10/edrashead-2.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Biron",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/10/biron-artwork-1.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Zill",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/2b128ebef47ab5a8a2ae9d3db754cd585ee5e21149f621.jpg",
    "tier": "A",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Kriknak",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/0dac2ca73eb28c03de2e43f85e868df458e710b5baeb41.png",
    "tier": "A",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Ngộ Không",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/aea009bf921dd684d19ee76c0c1441215ef5c39d1bd6b1.jpg",
    "tier": "A",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Elsu",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/449789489494c0f108a3db5db3098e585bc98d17e666b1.jpg",
    "tier": "A",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Brunhilda",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/eef053fb25793d536185559e8bf5a82d5c132caaa102e1.jpg",
    "tier": "A",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Valhein",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/4b36c6e5e2d1ce9dd9e2841d2902043c5ee04efeb2f2d1.jpg",
    "tier": "A",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Slimz",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/122fe2fc229ca42dcbe6946db07ccd435b345a87702a11.png",
    "tier": "A",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Ilumia",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/7ae8bcd437d0787c9f3bb9aa54907ede5ef5e858aff141.jpg",
    "tier": "A",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Diao Chan",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/fe313975ef498b33a7bf995a05d6f8b75847d42a599181.png",
    "tier": "A",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Kahlii",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/cb7b811e7978882aefac079de6c93daf5fbcc5716f8ad1.jpg",
    "tier": "A",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Roxie",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/51400-1.jpg",
    "tier": "A",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Toro",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/ffd2c29391b67831e97a0b16534a65d45ef5921c2bcb41.jpg",
    "tier": "A",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Cresht",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/a450850337d6a5d19250b1d1e39692f15eccc530c915e1.jpg",
    "tier": "A",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Baldum",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/e751e70db18557783c2d23c9e5383e095b6bb947482b11.jpg",
    "tier": "A",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Omen",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/00a78d4f7222a428cd06b45252f88a565a73df2c56ad81.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Veres",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/46c5f246040b9e750779aa41ffcbeaa15c3f06d63ce241.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Qi",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/6da178e8a2c2871aeb856bec0f669ccd5d5684e01acd31.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Allain",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/3aa1f0f335f87801117dbfa1d69b072b5ef1f1c297fe21.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Zuka",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/bb649e26633a61d78f7147d56c0828c6658d3bb600ae01.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Arthur",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/06/Honeyview_Arthur_111-e1718875297358.jpg",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Alice",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/12700_B51-1.jpg",
    "tier": "A",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Flowborn",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Triệu Vân",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Zephys",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "The Flash",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Astrid",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Tachi",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Bijan",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Teeri",
    "avatar": "img/unnamed.webp",
    "tier": "A",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Goverra",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2025/07/goverra-1.jpg",
    "tier": "B",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Heino",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2025/04/heino-2.jpg",
    "tier": "B",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Billow",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2025/01/59900-2.jpg",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Bolt Baron",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/11/bolt-baron-225.jpg",
    "tier": "B",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Dolia",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/07/15900s.jpg",
    "tier": "B",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Charlotte",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/07/20600s.jpg",
    "tier": "B",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Paine",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/47861c6d53d72d0dbea2d1dba0b0e0365e8ade6f180931.jpg",
    "tier": "B",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Aoi",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f1db425eba8ea88e5d4d8427c1706bcf6100183de1cc11.jpeg",
    "tier": "B",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Enzo",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/81d7c827262287ce87639f3bfa048f5a5d149a6d571091.jpg",
    "tier": "B",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Yan",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f9471319a98fac8dce266dc86cd1efea658d4042ae0051.jpg",
    "tier": "B",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Yorn",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/44086d0bc26a170b21038a7cbf9413365c4938b95b2f91.jpg",
    "tier": "B",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Fennik",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/ab3f51a9731ffa085fd56a87139b8a775860e26837e191.jpg",
    "tier": "B",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Moren",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/acqqwc-1.jpg",
    "tier": "B",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Hayate",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/02c8e3d1db8ee8f32913b478884f33e05c8f254a7686f1.jpg",
    "tier": "B",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Stuart",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/aaba7b63f6e2f5577fbb3465925c8026658d3d704767f1.jpg",
    "tier": "B",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Krixi",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/cb7b811e7978882aefac079de6c93daf5fbcc5716f8ad1.jpg",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Veera",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/71e488144b7dc9f13d40321ce0556efc5847d39f2071a1.png",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Raz",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/2b128ebef47ab5a8a2ae9d3db754cd585ee5e21149f621.jpg",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Aleister",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/040403525e2882c0e3a6794c31976c89585357ba19a351.png",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Liliana",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/28b06811cb721a8ecb28d6a1db401e745a9fd3a39ae401.jpg",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Lorion",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/dab2c45af3206cd0ac30b450357aa8ce5fc5264d71f451.jpg",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Grakk",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/fd2a04f2b129ef58988f2d311eac83e45b6d0919e7d901.jpg",
    "tier": "B",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Chaugnar",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/d93ee5059a95c391548419e69b6b9d1a5d2564f4eba891.jpg",
    "tier": "B",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Taara",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f69423f533b12cbcd8ab15a7127e1e445e79e0b77e4ec1.jpg",
    "tier": "B",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Ata",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/71f7a36c0dd250ce0affeffcf14360f45e57c0420b4b61.jpg",
    "tier": "B",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Gildur",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/b9dd8e24c0fbad107475f6e31f5e36365847d373da15b1.png",
    "tier": "B",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Volkath",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/219b09a656af5274629409109ea2802d5d9472fe58bd81.jpg",
    "tier": "B",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Errol",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/5067bb53ba6435e11cc8777645d8de115cc136a9ca3b31.jpg",
    "tier": "B",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Helen",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/f3b0dc924b34f76c9265adb57758817a5b752794c417a1.jpg",
    "tier": "B",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Krizzix",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/a7e49f01ef9804d479cb6537a9b51dee5db6c75c945151.png",
    "tier": "B",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Skud",
    "avatar": "img/unnamed.webp",
    "tier": "B",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Marja",
    "avatar": "img/unnamed.webp",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Ishar",
    "avatar": "img/unnamed.webp",
    "tier": "B",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Dextra",
    "avatar": "img/unnamed.webp",
    "tier": "B",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Rourke",
    "avatar": "img/unnamed.webp",
    "tier": "B",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Arduin",
    "avatar": "img/unnamed.webp",
    "tier": "B",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Lindis",
    "avatar": "img/unnamed.webp",
    "tier": "B",
    "class": "Xạ thủ",
    "lane": "Bot"
  },
  {
    "name": "Amily",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/65b8d8e674af00ee4ecbb4030e8fac385b88ea13824d31.jpg",
    "tier": "C",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Superman",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/3310a88f1a679a6940e2f6e0da287c415a02b6ac709e01.jpg",
    "tier": "C",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Wonder Woman",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/108ae03944a6aa1eb4313a2baa64efcd5a0e6c1551db11.jpg",
    "tier": "C",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Riktor",
    "avatar": "img/unnamed.webp",
    "tier": "C",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Mganga",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/fe313975ef498b33a7bf995a05d6f8b75847d42a599181.png",
    "tier": "C",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Jinna",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/04b0a1140d89b8ef0cd4a655753bbb895c4938662bc9f1.jpg",
    "tier": "C",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Dirak",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/ab0b68ebd2e8df3116d91231ec0e55fc5e16e1f05c8701-1.jpg",
    "tier": "C",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Iggy",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/b4563fbfd5756caeea04b7ef488ee39f60fffd803e9ab1.jpeg",
    "tier": "C",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Bonnie",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/a2ed1b1815df9c719e4f9b4be5eb3a74658d4cd7d3ef61.jpg",
    "tier": "C",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Lumburr",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/119dc57d5a3a59b520b93a42301ffb135e7dedbf1c28a1.jpg",
    "tier": "C",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Xeniel",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/108ae03944a6aa1eb4313a2baa64efcd5a0e6c1551db11.jpg",
    "tier": "C",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Arum",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/7faf7c96faeb8721b936e323becb57265afea9c3c8b281.jpg",
    "tier": "C",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Omega",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/d7088075d6e144e11f476782718320865d256521539c41.jpg",
    "tier": "C",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Mina",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/ecbf2434edb2b16cc0d5b286a88ab4335d2565110472b1.jpg",
    "tier": "C",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Aya",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/d4510fa53f153c5e259543597c96bb88658d3efcbcd0f1.jpg",
    "tier": "C",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Preyta",
    "avatar": "img/unnamed.webp",
    "tier": "C",
    "class": "Pháp sư",
    "lane": "Giữa"
  },
  {
    "name": "Max",
    "avatar": "img/unnamed.webp",
    "tier": "C",
    "class": "Đấu sĩ",
    "lane": "Top"
  },
  {
    "name": "Wiro",
    "avatar": "img/unnamed.webp",
    "tier": "C",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "Batman",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/903191ed8212c2c6c91f1f6f0a677a565c6102d8ecf4a1.jpg",
    "tier": "D",
    "class": "Sát thủ",
    "lane": "Rừng"
  },
  {
    "name": "Zip",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/e0f8f382d1be41adc8947bf1b849479b5d3823c7418f71.jpg",
    "tier": "D",
    "class": "Đỡ đòn",
    "lane": "Top"
  },
  {
    "name": "TeeMee",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/d048143eef92ff2734c99f53b46e19db5a4dabef8a0fe1.jpg",
    "tier": "D",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Rouie",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/7f7ce6b3593a8ea52de5fa3be55469f85eb1402d093b71.jpg",
    "tier": "D",
    "class": "Trợ thủ",
    "lane": "Sp"
  },
  {
    "name": "Thorne",
    "avatar": "https://lienquan.garena.vn/wp-content/uploads/2024/05/dd8031b80a4fc5978cdd4886a65a6eb35f5070fd5d0221.jpg",
    "tier": "D",
    "class": "Xạ thủ",
    "lane": "Bot"
  }
];

export default heroesData;