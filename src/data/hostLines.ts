import { HostInfo, HostType } from '../types/game';

export const HOSTS: Record<HostType, HostInfo> = {
  kenan: {
    id: 'kenan',
    name: 'Kenan Bey',
    title: 'Karizmatik Usta',
    avatar: '🤵🏻‍♂️',
    description: 'Klasik, vakur ve derin bakışlarıyla gerilimi tavana vuran efsanevi sunucu.'
  },
  kanka: {
    id: 'kanka',
    name: 'Kanka Burak',
    title: 'Mahalle Çocuğu',
    avatar: '🧢',
    description: 'Rahat, esprili ve sürekli para hayali kuran samimi sunucu.'
  },
  prof: {
    id: 'prof',
    name: 'Prof. Muzaffer',
    title: 'Ukala Akademisyen',
    avatar: '🧐',
    description: 'Her şeye mantıkla yaklaşan, yanlış cevap verince hafiften iğneleyen dahi hoca.'
  }
};

export const HOST_LINES: Record<
  HostType,
  {
    welcome: string[];
    onQuestion: string[];
    onSelect: string[];
    onCorrect: string[];
    onWrong: string[];
    onWalkAway: string[];
    onMilestone: string[];
  }
> = {
  kenan: {
    welcome: [
      'Hoş geldiniz! Türkiye\'nin en heyecanlı bilgi arenasına hazır mısınız?',
      'Stüdyomuz hazır, ödül kasası açık. Bakalım 10 Milyon TL kime gidecek?'
    ],
    onQuestion: [
      'İşte merakla beklenen soru geliyor. Sakin ol ve dikkatle oku.',
      'Ödül basamağı yükseliyor, nefesler tutuldu.',
      'Bu soru oyunun kaderini değiştirebilir.'
    ],
    onSelect: [
      'Son kararın mı?',
      'Emin misin? Kilitliyorum cevabını?',
      'Gözlerindeki kararlılığı görüyorum... Bakalım doğru mu?'
    ],
    onCorrect: [
      'Harika bir cevap! Doğru!',
      'Tebrik ediyorum, adım adım zirveye!',
      'İşte bu! Stüdyo seni ayakta alkışlıyor!'
    ],
    onWrong: [
      'Maalesef... Cevabın yanlıştı.',
      'Ah, çok yazık oldu! Buraya kadarmış.',
      'Yolculuğumuz burada bitti ama harika yarıştın.'
    ],
    onWalkAway: [
      'Mantıklı bir strateji. Paran cebinde güzel bir gün dilerim!',
      'Risk almadın, tebrik ederim. Büyük parayla ayrılıyorsun.'
    ],
    onMilestone: [
      'Tebrikler! Barajı geçtin, artık bu ödül tamamen senin garantinde!',
      'Önemli bir eşik aşıldı, şimdi arkana yaslan ve devam et!'
    ]
  },
  kanka: {
    welcome: [
      'Selam kral! Parayı kırmaya hazır mıyız? Akşama tatlılar senden!',
      'Gel otur şöyle rahatına bak, bugün o 10 milyonu cebe indiriyoruz!'
    ],
    onQuestion: [
      'Bak bu soru tam senlik gibi duruyor, dikkatli bak.',
      'Hadi bakalım, salla salla tutsun demiyoruz, mantık çalıştırıyoruz!',
      'Vay be paraya bak, benim bile gözüm döndü!'
    ],
    onSelect: [
      'Ciddi misin kanka? Bak kilitliyorum son kararın mı?',
      'Bunu işaretledin ama son kararın mı bak yanarsan karışmam ha!',
      'Bak bu şık pek tekin durmuyor ama sen bilirsin!'
    ],
    onCorrect: [
      'ADAMSIN! Bildin be!',
      'Helal olsun sana! Paralar cebe akıyor!',
      'Yürü be kim tutar seni! Aynen böyle devam!'
    ],
    onWrong: [
      'Yapma be reis... Yandık iyi mi!',
      'Gitti canım paralar... Sağlık olsun be kanka!',
      'Neyse bir dahaki sefere döneriz, üzülme!'
    ],
    onWalkAway: [
      'Parayı kaptın kaçtın ha! Helal olsun, akşama yemekler senden!',
      'Güzel taktik kanka, garanti paradan iyisi Şam\'da kayısı!'
    ],
    onMilestone: [
      'Ooo barajı kaptık! En azından artık eve boş dönmeyeceğiz!',
      'Tertemiz para garantilendi, şimdi kafan rahat salla gitsin!'
    ]
  },
  prof: {
    welcome: [
      'Bilgi kütüphanesine hoş geldiniz. Bakalım zihniniz bu meydan okumaya hazır mı?',
      'Bilim ve mantığın ışığında 15 basamaklı yolculuğumuz başlıyor.'
    ],
    onQuestion: [
      'Bu soruda basit bir mantık çıkarımı yapmanızı öneririm.',
      'Görünüşe aldanmayın, şıklar arasında ince bir ayrım var.',
      'Bilişsel kapasitenizi gösterme sırası sizde.'
    ],
    onSelect: [
      'Bu seçimi yaparken hangi rasyonel hipoteze dayandınız? Son kararın mı?',
      'Kararınızı onaylıyor musunuz?',
      'İstatistiki olarak cesur bir tercih...'
    ],
    onCorrect: [
      'Mükemmel bir analitik zeka örneği. Doğru cevap.',
      'Aklın yolu bir! Tebrik ediyorum.',
      'Bilim bir kez daha kazandı.'
    ],
    onWrong: [
      'Ne yazık ki hipoteziniz çöktü. Doğru cevap başkaydı.',
      'Tarih ve mantık yanıltmaz, lakin bu kez yanıldınız.',
      'Biraz daha genel kültür okuması tavsiye ederim.'
    ],
    onWalkAway: [
      'Olasılık teorisini doğru hesaplayıp çekildiniz. Rasyonel bir karar.',
      'Risk kazanç analizini iyi yaptınız.'
    ],
    onMilestone: [
      'Eşik başarıyla geçildi. Kazancınız matematiksel olarak teminat altında.',
      'Baraj aşıldı, tebrik ederim.'
    ]
  }
};

export const getRandomLine = (
  host: HostType,
  category: keyof (typeof HOST_LINES)['kenan']
): string => {
  const lines = HOST_LINES[host][category];
  return lines[Math.floor(Math.random() * lines.length)];
};
