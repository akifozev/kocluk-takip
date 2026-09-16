import { Question } from '../types/game';

export const INITIAL_QUESTIONS: Question[] = [
  // ================= SEVİYE 1 (1.000 ₺) - Isınma Soruları =================
  {
    id: 'q1_1',
    level: 1,
    category: 'komik',
    question: 'Tavada pişirilen, genelde sabah kahvaltılarında ekmek banılarak yenen klasik yumurta türüne ne ad verilir?',
    options: ['Göz göz yumurta', 'Kulak kulak yumurta', 'Burun burun yumurta', 'Diz diz yumurta'],
    correctAnswer: 0,
    explanation: 'Sarısı patlatılmadan pişirilen yumurtaya göze benzediği için göz göz yumurta denir.'
  },
  {
    id: 'q1_2',
    level: 1,
    category: 'genel',
    question: 'Halk arasında çok acıkan birinin karnından hangi seslerin geldiği söylenir?',
    options: ['Davullar çalıyor', 'Ziller çalıyor', 'Kornalar ötüyor', 'Gitarlar inliyor'],
    correctAnswer: 1,
    explanation: 'Deyim: "Karnım zil çalıyor."'
  },
  {
    id: 'q1_3',
    level: 1,
    category: 'populer',
    question: 'Akıllı telefonlarda ekran kilidini açmak veya onay vermek için ekrana dokundurulan uzuv hangisidir?',
    options: ['Dirsek', 'Parmak izi', 'Alın', 'Topuk'],
    correctAnswer: 1,
    explanation: 'Parmak izi biyometrik güvenlikte en yaygın kullanılan yöntemdir.'
  },
  {
    id: 'q1_4',
    level: 1,
    category: 'komik',
    question: 'Pikniklerin vazgeçilmezi olan duman altı aktiviteye ne ad verilir?',
    options: ['Mangal yakmak', 'Limon sıkmak', 'Kite sörfü yapmak', 'Dalış yapmak'],
    correctAnswer: 0,
    explanation: 'Türk piknik kültürünün resmi sporu mangaldır!'
  },

  // ================= SEVİYE 2 (2.000 ₺) =================
  {
    id: 'q2_1',
    level: 2,
    category: 'populer',
    question: 'Sosyal medyada bir içeriğin çok kısa sürede milyonlarca kişi tarafından paylaşılmasına ne denir?',
    options: ['Viral olmak', 'Grip olmak', 'Müzminleşmek', 'Karantinaya girmek'],
    correctAnswer: 0,
    explanation: 'Hızlı yayılan popüler içeriklere "viral" denir.'
  },
  {
    id: 'q2_2',
    level: 2,
    category: 'sinema-dizi',
    question: 'G.O.R.A filminde Arif karakterinin halı satarken uzaylılar tarafından kaçırıldığı gezegen hangisidir?',
    options: ['GORA', 'AROG', 'Kripton', 'Mars'],
    correctAnswer: 0,
    explanation: 'Cem Yılmaz\'ın unutulmaz filmi G.O.R.A\'da Arif uzaylılarca GORA gezegenine götürülür.'
  },
  {
    id: 'q2_3',
    level: 2,
    category: 'genel',
    question: 'Trafik ışıklarında "Geç" anlamına gelen ışık hangi renktir?',
    options: ['Kırmızı', 'Sarı', 'Yeşil', 'Mor'],
    correctAnswer: 2,
    explanation: 'Yeşil ışık geçiş serbestliğini ifade eder.'
  },
  {
    id: 'q2_4',
    level: 2,
    category: 'spor',
    question: 'Bir futbol maçında kaleci hariç sahadaki diğer 10 oyuncudan birinin topa elle bilerek dokunması durumunda hakem ne çalar?',
    options: ['Faul / Elle Oynama', 'Taç', 'Ofsayt', 'Aut'],
    correctAnswer: 0,
    explanation: 'Kaleci ceza sahası dışındayken veya diğer oyuncular elle oynadığında düdük çalar.'
  },

  // ================= SEVİYE 3 (5.000 ₺) =================
  {
    id: 'q3_1',
    level: 3,
    category: 'sinema-dizi',
    question: 'Hababam Sınıfı film serisinde Şener Şen\'in canlandırdığı unutulmaz beden eğitimi öğretmeni kimdir?',
    options: ['Badi Ekrem', 'Mahmut Hoca', 'Kel Mahmut', 'Şevket Hoca'],
    correctAnswer: 0,
    explanation: '"Kırmızı eşofmanlı Badi Ekrem", Türk sinemasının efsane karakteridir.'
  },
  {
    id: 'q3_2',
    level: 3,
    category: 'bilim',
    question: 'Güneş Sistemi\'nde Güneş\'e en yakın gezegen hangisidir?',
    options: ['Venüs', 'Merkür', 'Dünya', 'Mars'],
    correctAnswer: 1,
    explanation: 'Merkür Güneş\'e en yakın ve en küçük gezegendir.'
  },
  {
    id: 'q3_3',
    level: 3,
    category: 'populer',
    question: 'Pizza kuryelerinin kutuyu açtıklarında peynirin kapağa yapışmasını önlemek için ortaya koydukları minik plastik parçanın şekli nedir?',
    options: ['Üç bacaklı sehpa', 'Topaç', 'Dambıl', 'Gözlük'],
    correctAnswer: 0,
    explanation: 'Pizza sehpası (pizza saver) kapağın çöküp peyniri bozmasını engeller.'
  },
  {
    id: 'q3_4',
    level: 3,
    category: 'genel',
    question: 'İtalya denince akla gelen, Pisa şehrindeki meşhur kulenin en belirgin özelliği nedir?',
    options: ['Eğik olması', 'Camdan yapılmış olması', 'Kırmızı olması', 'Sualtında olması'],
    correctAnswer: 0,
    explanation: 'Pisa Kulesi zemin çökmesi sebebiyle güneye doğru eğiktir.'
  },

  // ================= SEVİYE 4 (10.000 ₺) =================
  {
    id: 'q4_1',
    level: 4,
    category: 'muzik',
    question: '"Arkadaşım Eşek", "Gülpembe" ve "Dönence" şarkılarıyla nesilleri büyüten efsanevi sanatçımız kimdir?',
    options: ['Barış Manço', 'Cem Karaca', 'Erkin Koray', 'İlhan İrem'],
    correctAnswer: 0,
    explanation: 'Barış Manço 7\'den 77\'ye tüm Türkiye\'nin sevgilisidir.'
  },
  {
    id: 'q4_2',
    level: 4,
    category: 'tarih',
    question: 'Osmanlı Devleti\'nin kurucusu olan ilk padişah kimdir?',
    options: ['Osman Gazi', 'Orhan Gazi', 'Fatih Sultan Mehmet', 'Yavuz Sultan Selim'],
    correctAnswer: 0,
    explanation: 'Devletin kurucusu Osman Gazi\'dir (1299).'
  },
  {
    id: 'q4_3',
    level: 4,
    category: 'bilim',
    question: 'İnsan vücudundaki en sert ve en dayanıklı madde hangisidir?',
    options: ['Diş minesi', 'Kaval kemiği', 'Tırnak', 'Kafatası'],
    correctAnswer: 0,
    explanation: 'Diş minesi vücuttaki en yoğun mineralleşmiş ve en sert maddedir.'
  },
  {
    id: 'q4_4',
    level: 4,
    category: 'komik',
    question: 'Hangi hayvan başını yaklaşık 270 derece çevirerek arkasını görebilir?',
    options: ['Baykuş', 'Zürafa', 'Bukalemun', 'Penguen'],
    correctAnswer: 0,
    explanation: 'Baykuşlar boyunlarındaki 14 omur sayesinde kafalarını 270 derece döndürebilirler.'
  },

  // ================= SEVİYE 5 (20.000 ₺) - 1. BARAJ SORUSU =================
  {
    id: 'q5_1',
    level: 5,
    category: 'genel',
    question: 'Türkiye Cumhuriyeti\'nin başkenti Ankara, hangi yılda resmen başkent ilan edilmiştir?',
    options: ['1920', '1923', '1924', '1927'],
    correctAnswer: 1,
    explanation: 'Ankara, 13 Ekim 1923 tarihinde TBMM tarafından başkent ilan edilmiştir.'
  },
  {
    id: 'q5_2',
    level: 5,
    category: 'sinema-dizi',
    question: 'Kurtlar Vadisi dizisinde "Sonunu düşünen kahraman olamaz" repliğiyle özdeşleşen karakter kimdir?',
    options: ['Polat Alemdar', 'Süleyman Çakır', 'Memati Baş', 'Aslan Akbey'],
    correctAnswer: 0,
    explanation: 'Polat Alemdar\'ın efsanevi felsefesidir.'
  },
  {
    id: 'q5_3',
    level: 5,
    category: 'spor',
    question: 'Futbolda Dünya Kupası\'nı en çok kazanan ülke (5 kez) hangisidir?',
    options: ['Brezilya', 'Almanya', 'İtalya', 'Arjantin'],
    correctAnswer: 0,
    explanation: 'Brezilya 1958, 1962, 1970, 1994 ve 2002 yıllarında 5 kez kupayı kaldırmıştır.'
  },
  {
    id: 'q5_4',
    level: 5,
    category: 'bilim',
    question: 'Periyodik tabloda "Au" sembolü hangi değerli metali temsil eder?',
    options: ['Altın', 'Gümüş', 'Bakır', 'Alüminyum'],
    correctAnswer: 0,
    explanation: 'Latince "Aurum" (ışıldayan şafak) kelimesinden Altın\'ı temsil eder.'
  },

  // ================= SEVİYE 6 (40.000 ₺) =================
  {
    id: 'q6_1',
    level: 6,
    category: 'tarih',
    question: 'Fatih Sultan Mehmet İstanbul\'u fethettiğinde kaç yaşındaydı?',
    options: ['21', '25', '29', '18'],
    correctAnswer: 0,
    explanation: 'Fatih Sultan Mehmet, 1453\'te İstanbul\'u fethettiğinde henüz 21 yaşındaydı.'
  },
  {
    id: 'q6_2',
    level: 6,
    category: 'populer',
    question: 'Hangisi Bluetooth teknolojisinin ismini aldığı tarihi şahsiyettir?',
    options: ['Danimarka Kralı Harald Bluetooth', 'Korsan Kara Sakal', 'Viking Ragnar', 'Kral Arthur'],
    correctAnswer: 0,
    explanation: 'Farklı İskandinav kabilelerini birleştiren Danimarka Kralı Harald Bluetooth anısına bu ad verilmiştir.'
  },
  {
    id: 'q6_3',
    level: 6,
    category: 'genel',
    question: 'Dünyanın yüzölçümü bakımından en büyük gölü olan ve "Deniz" olarak da adlandırılan su kütlesi hangisidir?',
    options: ['Hazar Denizi', 'Baykal Gölü', 'Van Gölü', 'Victoria Gölü'],
    correctAnswer: 0,
    explanation: 'Hazar Denizi aslında dünyanın en büyük kapalı su havzası/gölüdür.'
  },
  {
    id: 'q6_4',
    level: 6,
    category: 'sinema-dizi',
    question: 'Yüzüklerin Efendisi serisinde Tek Yüzük\'ü yok etmek için atıldığı volkanik dağın adı nedir?',
    options: ['Hüküm Dağı (Mount Doom)', 'Yalnız Dağ', 'Dumanlı Dağlar', 'Ağrı Dağı'],
    correctAnswer: 0,
    explanation: 'Frodo ve Sam yüzüğü Mordor\'daki Hüküm Dağı\'nın ateşine atmıştır.'
  },

  // ================= SEVİYE 7 (60.000 ₺) =================
  {
    id: 'q7_1',
    level: 7,
    category: 'bilim',
    question: 'Işık hızı saniyede yaklaşık kaç kilometredir?',
    options: ['300.000 km/s', '150.000 km/s', '1.000.000 km/s', '30.000 km/s'],
    correctAnswer: 0,
    explanation: 'Boşluktaki ışık hızı saniyede yaklaşık 299.792 kilometredir.'
  },
  {
    id: 'q7_2',
    level: 7,
    category: 'muzik',
    question: 'Piyano klavyesinde toplam kaç adet tuş (beyaz + siyah) bulunur?',
    options: ['88', '76', '92', '64'],
    correctAnswer: 0,
    explanation: 'Standart bir konser piyanosunda 52 beyaz, 36 siyah olmak üzere toplam 88 tuş vardır.'
  },
  {
    id: 'q7_3',
    level: 7,
    category: 'spor',
    question: 'Basketbolda 3 sayılık çizgi ilk kez resmi olarak hangi ligde uygulanmaya başlanmıştır?',
    options: ['ABA (American Basketball Association)', 'NBA', 'EuroLeague', 'NCAA'],
    correctAnswer: 0,
    explanation: '1967\'de ABA ligi 3 sayı çizgisini popülerleştirmiş, NBA ise 1979\'da kabul etmiştir.'
  },
  {
    id: 'q7_4',
    level: 7,
    category: 'komik',
    question: 'Flamingoların tüylerinin pembe renge bürünmesinin temel sebebi nedir?',
    options: ['Yedikleri karides ve yosunlardaki pigmentler', 'Güneş yanığı olmaları', 'Genetik mutasyon', 'Stresten'],
    correctAnswer: 0,
    explanation: 'Flamingolar yedikleri artemia (tuzlu su karidesi) içindeki karotenoid maddesi yüzünden pembeleşir.'
  },

  // ================= SEVİYE 8 (100.000 ₺) =================
  {
    id: 'q8_1',
    level: 8,
    category: 'genel',
    question: 'Mona Lisa tablosu günümüzde Paris\'teki hangi ünlü müzede sergilenmektedir?',
    options: ['Louvre Müzesi', 'Orsay Müzesi', 'Prado Müzesi', 'Uffizi Galerisi'],
    correctAnswer: 0,
    explanation: 'Leonardo da Vinci\'nin başyapıtı Paris Louvre Müzesi\'nde kurşun geçirmez cam arkasındadır.'
  },
  {
    id: 'q8_2',
    level: 8,
    category: 'tarih',
    question: 'Tarihte parayı ilk kez icat edip kullanan Anadolu uygarlığı hangisidir?',
    options: ['Lidyalılar', 'Urartular', 'Hititler', 'Frigyalılar'],
    correctAnswer: 0,
    explanation: 'Lidyalılar M.Ö. 7. yüzyılda Manisa/Salihli civarında madeni parayı basmıştır.'
  },
  {
    id: 'q8_3',
    level: 8,
    category: 'bilim',
    question: 'Dünyanın uydusu olan Ay\'a ayak basan ilk insan kimdir?',
    options: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'],
    correctAnswer: 0,
    explanation: 'Neil Armstrong 20 Temmuz 1969\'da "İnsan için küçük, insanlık için dev bir adım" diyerek ayak basmıştır.'
  },
  {
    id: 'q8_4',
    level: 8,
    category: 'sinema-dizi',
    question: 'The Matrix filminde Neo\'nun gerçek dünyayı seçmesi için yuttuğu hapın rengi nedir?',
    options: ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı'],
    correctAnswer: 0,
    explanation: 'Morpheus: "Mavi hapı alırsan hikaye biter, yatağında uyanırsın. Kırmızı hapı alırsan Harikalar Diyarı\'nda kalırsın."'
  },

  // ================= SEVİYE 9 (150.000 ₺) =================
  {
    id: 'q9_1',
    level: 9,
    category: 'tarih',
    question: 'Kurtuluş Savaşı\'nda Mustafa Kemal Atatürk\'e "Gazi" unvanı ve "Mareşal" rütbesi hangi zaferden sonra verilmiştir?',
    options: ['Sakarya Meydan Muharebesi', 'Büyük Taarruz', '1. İnönü Savaşı', 'Çanakkale Savaşı'],
    correctAnswer: 0,
    explanation: 'Sakarya Zaferi\'nin ardından 19 Eylül 1921\'de TBMM tarafından tevcih edilmiştir.'
  },
  {
    id: 'q9_2',
    level: 9,
    category: 'bilim',
    question: 'Ahtapotların toplam kaç adet kalbi vardır?',
    options: ['3', '1', '2', '4'],
    correctAnswer: 0,
    explanation: 'Ahtapotların 3 kalbi ve mavi renkli kanı vardır. İkisi solungaçlara, biri vücuda kan pompalar.'
  },
  {
    id: 'q9_3',
    level: 9,
    category: 'genel',
    question: 'Hem Asya hem de Avrupa kıtasında toprağı olan İstanbul Boğazı\'nın en dar yeri neresidir?',
    options: ['Anadoluhisarı - Rumelihisarı arası', 'Üsküdar - Beşiktaş arası', 'Sarıyer - Beykoz', 'Karaköy - Kadıköy'],
    correctAnswer: 0,
    explanation: 'Hisarlar arası mesafe yaklaşık 698 metre ile boğazın en dar boğumudur.'
  },
  {
    id: 'q9_4',
    level: 9,
    category: 'edebiyat',
    question: 'Dünya edebiyatında ilk modern roman kabul edilen "Don Kişot" adlı eserin yazarı kimdir?',
    options: ['Miguel de Cervantes', 'Victor Hugo', 'Dante Alighieri', 'William Shakespeare'],
    correctAnswer: 0,
    explanation: 'Cervantes, yel değirmenleriyle savaşan Don Kişot\'u 1605\'te yayımlamıştır.'
  },

  // ================= SEVİYE 10 (250.000 ₺) - 2. BARAJ SORUSU =================
  {
    id: 'q10_1',
    level: 10,
    category: 'genel',
    question: 'Nobel Ödülü kazanan ilk Türk vatandaşı kimdir?',
    options: ['Orhan Pamuk', 'Aziz Sancar', 'Yaşar Kemal', 'Cahit Arf'],
    correctAnswer: 0,
    explanation: 'Orhan Pamuk 2006 yılında Nobel Edebiyat Ödülü\'nü kazanmıştır.'
  },
  {
    id: 'q10_2',
    level: 10,
    category: 'bilim',
    question: 'DNA\'nın çift sarmal yapısını 1953 yılında keşfederek tıp tarihini değiştiren bilim insanları kimlerdir?',
    options: ['James Watson & Francis Crick', 'Marie Curie & Pierre Curie', 'Albert Einstein & Bohr', 'Louis Pasteur & Koch'],
    correctAnswer: 0,
    explanation: 'Watson ve Crick, Rosalind Franklin\'in X-ışını kırınımı verilerini kullanarak çift sarmalı keşfetti.'
  },
  {
    id: 'q10_3',
    level: 10,
    category: 'tarih',
    question: 'Mustafa Kemal Atatürk\'ün nüfusa kayıtlı olduğu il hangisidir?',
    options: ['Gaziantep', 'Selanik', 'Ankara', 'İstanbul'],
    correctAnswer: 0,
    explanation: 'Atatürk, Gaziantep\'in Bey Mahallesi nüfus kütüğüne tescil edilmiştir.'
  },
  {
    id: 'q10_4',
    level: 10,
    category: 'spor',
    question: 'Olimpiyat Oyunları\'nda Türkiye\'ye güreş branşı dışında ilk altın madalyayı kazandıran efsane haltercimiz kimdir?',
    options: ['Naim Süleymanoğlu', 'Halil Mutlu', 'Taner Sağır', 'Nurcan Taylan'],
    correctAnswer: 0,
    explanation: '1988 Seul Olimpiyatları\'nda "Cep Herkülü" Naim Süleymanoğlu tarihi altın madalyayı almıştır.'
  },

  // ================= SEVİYE 11 (500.000 ₺) =================
  {
    id: 'q11_1',
    level: 11,
    category: 'tarih',
    question: 'Tarihin bilinen en eski yazılı barış antlaşması olan "Kadeş Antlaşması" hangi iki büyük medeniyet arasında imzalanmıştır?',
    options: ['Hititler - Eski Mısır', 'Babilliler - Asurlar', 'Persler - Yunanlar', 'Romalılar - Kartaca'],
    correctAnswer: 0,
    explanation: 'M.Ö. 1258 civarında II. Ramses ile III. Hattuşili arasında imzalanmıştır.'
  },
  {
    id: 'q11_2',
    level: 11,
    category: 'bilim',
    question: 'İnsan vücudunda kendi kendini yenileyebilme (rejenerasyon) kapasitesi en yüksek olan iç organ hangisidir?',
    options: ['Karaciğer', 'Akciğer', 'Böbrek', 'Dalak'],
    correctAnswer: 0,
    explanation: 'Karaciğer dokusunun %70\'e kadarı alındığında bile kendini haftalar içinde tam boyutuna yenileyebilir.'
  },
  {
    id: 'q11_3',
    level: 11,
    category: 'sanat',
    question: 'Ünlü "Çığlık" (The Scream) tablosunun Norveçli dışavurumcu ressamı kimdir?',
    options: ['Edvard Munch', 'Vincent van Gogh', 'Gustav Klimt', 'Pablo Picasso'],
    correctAnswer: 0,
    explanation: 'Edvard Munch bu eseri 1893 yılında yaratmıştır.'
  },
  {
    id: 'q11_4',
    level: 11,
    category: 'genel',
    question: 'Dünyada hiçbir nehir veya akarsuyu bulunmayan yüzölçümü en büyük ülke hangisidir?',
    options: ['Suudi Arabistan', 'Mısır', 'Katar', 'Libya'],
    correctAnswer: 0,
    explanation: 'Suudi Arabistan kalıcı bir nehre sahip olmayan en büyük yüzölçümlü ülkedir.'
  },

  // ================= SEVİYE 12 (1.000.000 ₺) =================
  {
    id: 'q12_1',
    level: 12,
    category: 'tarih',
    question: 'Şanlıurfa yakınlarında bulunan ve "tarihin sıfır noktası" olarak kabul edilen, dünyanın en eski tapınak kompleksi hangisidir?',
    options: ['Göbeklitepe', 'Çatalhöyük', 'Efes', 'Truva'],
    correctAnswer: 0,
    explanation: 'Göbeklitepe yaklaşık M.Ö. 9600 yılına, yani yaklaşık 12.000 yıl öncesine tarihlenir.'
  },
  {
    id: 'q12_2',
    level: 12,
    category: 'bilim',
    question: 'Elementler tablosunda atom numarası 1 olan ve evrende en bol bulunan element hangisidir?',
    options: ['Hidrojen', 'Helyum', 'Oksijen', 'Karbon'],
    correctAnswer: 0,
    explanation: 'Hidrojen evrendeki atomların yaklaşık %75\'ini oluşturur.'
  },
  {
    id: 'q12_3',
    level: 12,
    category: 'edebiyat',
    question: 'İstiklal Marşı şairimiz Mehmet Akif Ersoy, kazandığı 500 liralık ödülü hangi yardım kuruluşuna bağışlamıştır?',
    options: ['Darülmesai', 'Hilal-i Ahmer', 'Darüşşafaka', 'Donanma Cemiyeti'],
    correctAnswer: 0,
    explanation: 'Milli marşı para için yazmadığını söyleyerek ödülü yoksul kadın ve çocuklara iş öğreten Darülmesai\'ye bağışlamıştır.'
  },
  {
    id: 'q12_4',
    level: 12,
    category: 'sinema-dizi',
    question: 'Sinema tarihinde Oscar ödüllerinde 11 heykelcik birden kazanarak rekoru paylaşan 3 filmden biri hangisidir?',
    options: ['Titanik', 'Baba (The Godfather)', 'Yıldız Savaşları', 'Forrest Gump'],
    correctAnswer: 0,
    explanation: 'Ben-Hur (1959), Titanik (1997) ve Yüzüklerin Efendisi: Kralın Dönüşü (2003) 11 Oscar kazanmıştır.'
  },

  // ================= SEVİYE 13 (2.500.000 ₺) =================
  {
    id: 'q13_1',
    level: 13,
    category: 'bilim',
    question: 'Venüs gezegeninde bir gün (kendi etrafında bir tam dönüş), bir Venüs yılından (Güneş etrafındaki dönüş) daha uzundur. Venüs\'ün kendi ekseni etrafında dönüş yönü nasıldır?',
    options: ['Güneş Sistemi\'ndeki çoğu gezegenin aksine Doğudan Batıya', 'Kuzeyden Güneye', 'Dünya ile tamamen aynı yönde', 'Dönüş hareketi yapmaz'],
    correctAnswer: 0,
    explanation: 'Venüs ters yönde (retrograde) döner, bu yüzden Venüs\'te Güneş batıdan doğar ve doğudan batar!'
  },
  {
    id: 'q13_2',
    level: 13,
    category: 'tarih',
    question: 'Piri Reis\'in 1513 yılında ceylan derisi üzerine çizdiği ünlü dünya haritası, 1929 yılında nerede tesadüfen bulunmuştur?',
    options: ['Topkapı Sarayı', 'Dolmabahçe Sarayı', 'Ayasofya', 'Süleymaniye Kütüphanesi'],
    correctAnswer: 0,
    explanation: 'Cumhuriyet döneminde Topkapı Sarayı müzeye dönüştürülürken envanter çalışmaları sırasında bulunmuştur.'
  },
  {
    id: 'q13_3',
    level: 13,
    category: 'genel',
    question: 'Okyanusların en derin noktası olan Mariana Çukuru\'nun yaklaşık derinliği kaç metredir?',
    options: ['11.000 metre', '7.500 metre', '15.000 metre', '4.200 metre'],
    correctAnswer: 0,
    explanation: 'Mariana Çukuru\'ndaki "Challenger Derinliği" yaklaşık 10.994 metredir (Everest Dağı ters çevrilse bile sığar).'
  },

  // ================= SEVİYE 14 (5.000.000 ₺) =================
  {
    id: 'q14_1',
    level: 14,
    category: 'tarih',
    question: '1923 Lozan Barış Konferansı\'nda Türkiye delegasyonu başkanı olarak müzakereleri yürüten devlet adamı kimdir?',
    options: ['İsmet İnönü', 'Rauf Orbay', 'Fevzi Çakmak', 'Ali Fethi Okyar'],
    correctAnswer: 0,
    explanation: 'İsmet Paşa dışişleri bakanı olarak heyete başkanlık etmiştir.'
  },
  {
    id: 'q14_2',
    level: 14,
    category: 'bilim',
    question: 'Kuantum fiziğinde, bir parçacığın gözlemlenene kadar tüm olası durumlarda aynı anda bulunabilmesi ilkesine ne ad verilir?',
    options: ['Kuantum Süperpozisyonu', 'Entropi Artışı', 'Fotoelektrik Etki', 'Doppler Kayması'],
    correctAnswer: 0,
    explanation: 'Schrödinger\'in Kedisi paradoksu ile meşhur olan ilke Kuantum Süperpozisyonudur.'
  },
  {
    id: 'q14_3',
    level: 14,
    category: 'edebiyat',
    question: 'Divanü Lûgati\'t-Türk adlı ilk Türkçe sözlük ve ansiklopedik eserin yazarı kimdir?',
    options: ['Kaşgarlı Mahmud', 'Yusuf Has Hacib', 'Edip Ahmet Yükneki', 'Ahmet Yesevi'],
    correctAnswer: 0,
    explanation: '1072-1074 yılları arasında Kaşgarlı Mahmud tarafından Bağdat\'ta kaleme alınmıştır.'
  },

  // ================= SEVİYE 15 (10.000.000 ₺) - BÜYÜK FİNAL! =================
  {
    id: 'q15_1',
    level: 15,
    category: 'tarih',
    question: 'Türkiye Cumhuriyeti\'nin ilk kadın valisi olarak 1991 yılında Muğla\'ya atanan bürokrat kimdir?',
    options: ['Lale Aytaman', 'Türkan Akyol', 'Tansu Çiller', 'Filiz Dinçmen'],
    correctAnswer: 0,
    explanation: 'Dr. Lale Aytaman, 1991 yılında Muğla Valiliği\'ne atanarak Türkiye\'nin ilk kadın valisi unvanını almıştır.'
  },
  {
    id: 'q15_2',
    level: 15,
    category: 'bilim',
    question: 'James Webb Uzay Teleskobu, Dünya\'dan yaklaşık 1.5 milyon km uzakta hangi kütleçekimsel denge noktasının (Lagrange noktası) etrafında dönmektedir?',
    options: ['L2 Noktası', 'L1 Noktası', 'L4 Noktası', 'L5 Noktası'],
    correctAnswer: 0,
    explanation: 'JWST, Güneş ve Dünya\'nın yerçekiminin dengelendiği ikinci Lagrange (L2) noktasında konumlanmıştır.'
  },
  {
    id: 'q15_3',
    level: 15,
    category: 'genel',
    question: 'Dünya Sağlık Örgütü (WHO) bayrağında ve tıp sembolünde bir asaya sarılı olarak tasvir edilen canlı hangisidir?',
    options: ['Yılan', 'Kartal', 'Akrep', 'Aslan'],
    correctAnswer: 0,
    explanation: 'Yunan mitolojisindeki tıp ve şifa tanrısı Asklepios\'un asasına sarılı yılan figürüdür.'
  }
];
