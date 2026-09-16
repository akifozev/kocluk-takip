import 'dart:math';

enum HostType { kenan, kanka, prof }

class HostInfo {
  final HostType type;
  final String name;
  final String title;
  final String avatar;
  final String description;

  const HostInfo({
    required this.type,
    required this.name,
    required this.title,
    required this.avatar,
    required this.description,
  });
}

class HostData {
  static const Map<HostType, HostInfo> hosts = {
    HostType.kenan: HostInfo(
      type: HostType.kenan,
      name: 'Kenan Bey',
      title: 'Karizmatik Usta',
      avatar: '🤵🏻‍♂️',
      description: 'Klasik, vakur ve derin bakışlarıyla gerilimi tavana vuran efsanevi sunucu.',
    ),
    HostType.kanka: HostInfo(
      type: HostType.kanka,
      name: 'Kanka Burak',
      title: 'Mahalle Çocuğu',
      avatar: '🧢',
      description: 'Rahat, esprili ve sürekli parayı kırışma peşinde koşan samimi arkadaş.',
    ),
    HostType.prof: HostInfo(
      type: HostType.prof,
      name: 'Prof. Muzaffer',
      title: 'Ukala Akademisyen',
      avatar: '🧐',
      description: 'Her şeye mantıkla yaklaşan, yanlış cevap verince hafiften iğneleyen dahi hoca.',
    ),
  };

  static const Map<HostType, List<String>> onQuestionLines = {
    HostType.kenan: [
      'İşte merakla beklenen soru geliyor. Sakin ol ve dikkatle oku.',
      'Ödül basamağı yükseliyor, stüdyoda nefesler tutuldu.',
      'Bu soru oyunun kaderini değiştirebilir.',
    ],
    HostType.kanka: [
      'Bak bu soru tam senlik kanka, dikkatli bak!',
      'Hadi bakalım, mantık çalıştırıyoruz paraları topluyoruz!',
      'Vay be paraya bak, benim bile gözüm döndü!',
    ],
    HostType.prof: [
      'Bu soruda rasyonel bir mantık çıkarımı yapmanızı öneririm.',
      'Görünüşe aldanmayın, şıklar arasında ince bir ayrım var.',
      'Bilişsel kapasitenizi gösterme sırası sizde.',
    ],
  };

  static const Map<HostType, List<String>> onSelectLines = {
    HostType.kenan: [
      'Son kararın mı?',
      'Emin misin? Kilitliyorum cevabını?',
      'Gözlerindeki kararlılığı görüyorum... Bakalım doğru mu?',
    ],
    HostType.kanka: [
      'Ciddi misin kanka? Bak kilitliyorum son kararın mı?',
      'Bunu işaretledin ama yanarsan karışmam ha!',
      'Bak bu şık pek tekin durmuyor ama sen bilirsin!',
    ],
    HostType.prof: [
      'Bu tercihi hangi bilimsel hipoteze dayandırdınız? Son kararın mı?',
      'Kararınızı onaylıyor musunuz?',
      'İstatistiki olarak oldukça cesur bir hamle...',
    ],
  };

  static const Map<HostType, List<String>> onCorrectLines = {
    HostType.kenan: [
      'Harika bir cevap! Doğru!',
      'Tebrik ediyorum, adım adım zirveye!',
      'İşte bu! Stüdyo seni ayakta alkışlıyor!',
    ],
    HostType.kanka: [
      'ADAMSIN! Bildin be!',
      'Helal olsun sana! Paralar cebe akıyor!',
      'Yürü be kim tutar seni! Aynen böyle devam!',
    ],
    HostType.prof: [
      'Mükemmel bir analitik zeka örneği. Doğru cevap.',
      'Aklın yolu bir! Tebrik ediyorum.',
      'Bilim ve mantık bir kez daha kazandı.',
    ],
  };

  static const Map<HostType, List<String>> onWrongLines = {
    HostType.kenan: [
      'Maalesef... Cevabın yanlıştı.',
      'Ah, çok yazık oldu! Buraya kadarmış.',
      'Yolculuğumuz burada bitti ama harika yarıştın.',
    ],
    HostType.kanka: [
      'Yapma be reis... Yandık iyi mi!',
      'Gitti canım paralar... Sağlık olsun be kanka!',
      'Neyse bir dahaki sefere döneriz, üzülme!',
    ],
    HostType.prof: [
      'Ne yazık ki hipoteziniz çöktü. Doğru cevap başkaydı.',
      'Tarih ve mantık yanıltmaz, lakin bu kez yanıldınız.',
      'Biraz daha genel kültür okuması tavsiye ederim.',
    ],
  };

  static String getRandomLine(HostType type, Map<HostType, List<String>> linesMap) {
    final list = linesMap[type] ?? [];
    if (list.isEmpty) return '...';
    return list[Random().nextInt(list.length)];
  }
}
