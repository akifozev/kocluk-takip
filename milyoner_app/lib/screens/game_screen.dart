import 'dart:math';
import 'package:flutter/material.dart';
import '../models/host.dart';
import '../models/ladder.dart';
import '../models/question.dart';
import '../services/game_service.dart';
import '../services/sound_service.dart';
import 'game_over_screen.dart';
import 'victory_screen.dart';

class GameScreen extends StatefulWidget {
  final HostType hostType;

  const GameScreen({super.key, required this.hostType});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  int _level = 1;
  late Question _currentQuestion;
  int? _selectedIndex;
  bool _isLocked = false;
  bool _isRevealed = false;
  List<int> _eliminatedIndices = [];

  // Jokerler
  bool _lifelineFifty = true;
  bool _lifelinePhone = true;
  bool _lifelineAudience = true;
  bool _lifelineChange = true;
  bool _lifelineDouble = true;
  bool _isDoubleActive = false;
  bool _doubleUsedFirstTry = false;

  String _hostSpeech = '';
  int _correctCount = 0;

  @override
  void initState() {
    super.initState();
    GameService().resetSession();
    _loadNewQuestion(_level);
  }

  void _loadNewQuestion(int level) {
    setState(() {
      _level = level;
      _currentQuestion = GameService().getRandomQuestionForLevel(level);
      _selectedIndex = null;
      _isLocked = false;
      _isRevealed = false;
      _eliminatedIndices.clear();
      _isDoubleActive = false;
      _doubleUsedFirstTry = false;
      _hostSpeech = HostData.getRandomLine(widget.hostType, HostData.onQuestionLines);
    });
  }

  void _onSelectOption(int index) {
    if (_isLocked || _eliminatedIndices.contains(index)) return;

    SoundService().playClick();
    setState(() {
      _selectedIndex = index;
      _hostSpeech = HostData.getRandomLine(widget.hostType, HostData.onSelectLines);
    });
  }

  void _confirmAnswer() {
    if (_selectedIndex == null || _isLocked) return;

    setState(() {
      _isLocked = true;
      _hostSpeech = 'Cevabın kilitlendi... Bakalım doğru mu?';
    });
    SoundService().playLockIn();

    Future.delayed(const Duration(milliseconds: 1300), () {
      if (!mounted) return;
      final isCorrect = _selectedIndex == _currentQuestion.correctAnswer;

      setState(() {
        _isRevealed = true;
      });

      if (isCorrect) {
        SoundService().playCorrect();
        _correctCount++;

        if (_level == 15) {
          // BÜYÜK ZAFER
          GameService().saveGameResult(
            amountWon: 10000000,
            levelReached: 15,
            correctCount: _correctCount,
          );
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => VictoryScreen(hostType: widget.hostType),
            ),
          );
        } else {
          setState(() {
            _hostSpeech = HostData.getRandomLine(widget.hostType, HostData.onCorrectLines);
          });
          Future.delayed(const Duration(milliseconds: 1800), () {
            if (!mounted) return;
            _loadNewQuestion(_level + 1);
          });
        }
      } else {
        // YANLIŞ CEVAP
        if (_isDoubleActive && !_doubleUsedFirstTry) {
          SoundService().playWrong();
          setState(() {
            _doubleUsedFirstTry = true;
            _eliminatedIndices.add(_selectedIndex!);
            _selectedIndex = null;
            _isLocked = false;
            _isRevealed = false;
            _hostSpeech = 'Çift cevap jokeri sayesinde elenmedin! Kalan şıklardan birini seç.';
          });
          return;
        }

        SoundService().playWrong();
        setState(() {
          _hostSpeech = HostData.getRandomLine(widget.hostType, HostData.onWrongLines);
        });

        Future.delayed(const Duration(milliseconds: 2000), () {
          if (!mounted) return;
          final guaranteed = PrizeLadder.getGuaranteedAmount(_level);
          GameService().saveGameResult(
            amountWon: guaranteed,
            levelReached: _level,
            correctCount: _correctCount,
          );
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => GameOverScreen(
                amountWon: guaranteed,
                levelReached: _level,
                explanation: _currentQuestion.explanation,
                hostType: widget.hostType,
              ),
            ),
          );
        });
      }
    });
  }

  // Jokerler
  void _useFiftyFifty() {
    if (!_lifelineFifty || _isLocked) return;
    SoundService().playClick();
    final wrongIndices = [0, 1, 2, 3]..remove(_currentQuestion.correctAnswer);
    wrongIndices.shuffle();
    setState(() {
      _lifelineFifty = false;
      _eliminatedIndices = wrongIndices.take(2).toList();
      _hostSpeech = 'Yarı yarıya jokeri kullanıldı! 2 yanlış seçenek elendi.';
    });
  }

  void _usePhoneLifeline() {
    if (!_lifelinePhone || _isLocked) return;
    SoundService().playClick();
    setState(() {
      _lifelinePhone = false;
    });

    final letters = ['A', 'B', 'C', 'D'];
    final correctLetter = letters[_currentQuestion.correctAnswer];

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF0F172A),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Row(
            children: [
              Icon(Icons.phone_in_talk, color: Color(0xFFF59E0B)),
              SizedBox(width: 8),
              Text('Telefon Jokeri', style: TextStyle(color: Colors.white, fontSize: 16)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildPhoneOption('Prof. Bilgin (Akademisyen)', 'Tarihsel ve bilimsel kanıtlara göre cevap kesinlikle $correctLetter şıkkı!'),
              const Divider(color: Colors.white12),
              _buildPhoneOption('Kanka Burak (Mahalle Arkadaşı)', 'Kanka valla $correctLetter gibi duruyor ama patlarsan karışmam ha!'),
              const Divider(color: Colors.white12),
              _buildPhoneOption('Yapay Zeka (AI)', 'Veri tabanı analizine göre %87 olasılıkla doğru yanıt: $correctLetter şıkkı.'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Oyuna Dön', style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  Widget _buildPhoneOption(String title, String quote) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text('"$quote"', style: const TextStyle(color: Colors.white70, fontSize: 11)),
        ],
      ),
    );
  }

  void _useAudienceLifeline() {
    if (!_lifelineAudience || _isLocked) return;
    SoundService().playClick();
    setState(() {
      _lifelineAudience = false;
    });

    final letters = ['A', 'B', 'C', 'D'];
    final correctIdx = _currentQuestion.correctAnswer;
    final correctPct = Random().nextInt(25) + 55; // %55-80
    final rem = 100 - correctPct;
    final r1 = Random().nextInt(rem - 4);
    final r2 = Random().nextInt(rem - r1 - 2);
    final r3 = rem - r1 - r2;
    final others = [r1, r2, r3];
    int ptr = 0;

    final votes = List.generate(4, (i) {
      return i == correctIdx ? correctPct : others[ptr++];
    });

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF0F172A),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Row(
            children: [
              Icon(Icons.groups, color: Color(0xFF38BDF8)),
              SizedBox(width: 8),
              Text('Seyirci Oylama Sonucu', style: TextStyle(color: Colors.white, fontSize: 16)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(4, (i) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Row(
                  children: [
                    Text('${letters[i]}:', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: votes[i] / 100,
                          backgroundColor: Colors.white10,
                          valueColor: AlwaysStoppedAnimation(
                            i == correctIdx ? const Color(0xFFF59E0B) : const Color(0xFF38BDF8),
                          ),
                          minHeight: 14,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text('%${votes[i]}', style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
                  ],
                ),
              );
            }),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Tamam', style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  void _useChangeLifeline() {
    if (!_lifelineChange || _isLocked) return;
    SoundService().playClick();
    setState(() {
      _lifelineChange = false;
      _currentQuestion = GameService().getReplacementQuestion(_level, _currentQuestion.id);
      _selectedIndex = null;
      _eliminatedIndices.clear();
      _hostSpeech = 'Soru değiştirildi! Yeni sorun karşınızda.';
    });
  }

  void _useDoubleLifeline() {
    if (!_lifelineDouble || _isLocked) return;
    SoundService().playClick();
    setState(() {
      _lifelineDouble = false;
      _isDoubleActive = true;
      _hostSpeech = 'Çift cevap jokeri devrede! İlk denemede yanılırsan bir şansın daha var.';
    });
  }

  void _showWalkAwayDialog() {
    final walkAway = PrizeLadder.getWalkAwayAmount(_level);
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF0F172A),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Text('Çekilmek İstiyor musun?', style: TextStyle(color: Colors.white, fontSize: 16)),
          content: Text(
            'Şu ana kadar kazandığın $walkAway ₺ ödülü alıp ayrılarak paranı garantiye alabilirsin.',
            style: const TextStyle(color: Colors.white70, fontSize: 13),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Yarışmaya Devam', style: TextStyle(color: Colors.white54)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                GameService().saveGameResult(
                  amountWon: walkAway,
                  levelReached: _level,
                  correctCount: _correctCount,
                );
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(
                    builder: (context) => GameOverScreen(
                      amountWon: walkAway,
                      levelReached: _level,
                      explanation: 'Yarışmadan kendi isteğinle çekildin.',
                      hostType: widget.hostType,
                    ),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444)),
              child: const Text('Parayı Al ve Çekil', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  void _showLadderModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF090D16),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.75,
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const Text(
                'Ödül Merdiveni',
                style: TextStyle(color: Color(0xFFF59E0B), fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.builder(
                  itemCount: PrizeLadder.steps.length,
                  itemBuilder: (context, index) {
                    final step = PrizeLadder.steps[index];
                    final isCurrent = step.level == _level;
                    final isPassed = step.level < _level;

                    return Container(
                      margin: const EdgeInsets.symmetric(vertical: 3),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: isCurrent
                            ? const Color(0xFFF59E0B).withOpacity(0.2)
                            : isPassed
                                ? Colors.green.withOpacity(0.1)
                                : const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isCurrent
                              ? const Color(0xFFF59E0B)
                              : step.isMilestone
                                  ? const Color(0xFFFBBF24).withOpacity(0.5)
                                  : Colors.transparent,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Text(
                                '${step.level}.',
                                style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(width: 8),
                              if (step.isMilestone)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF59E0B).withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text('BARAJ', style: TextStyle(color: Color(0xFFF59E0B), fontSize: 9, fontWeight: FontWeight.w900)),
                                ),
                            ],
                          ),
                          Text(
                            step.formattedAmount,
                            style: TextStyle(
                              color: isCurrent
                                  ? const Color(0xFFF59E0B)
                                  : isPassed
                                      ? Colors.greenAccent
                                      : Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final host = HostData.hosts[widget.hostType]!;
    final step = PrizeLadder.getStep(_level);
    final letters = ['A', 'B', 'C', 'D'];

    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Üst Çubuk
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton.icon(
                    onPressed: _level > 1 && !_isLocked ? _showWalkAwayDialog : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E293B),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    icon: const Icon(Icons.logout, size: 14, color: Colors.redAccent),
                    label: Text(
                      'Çekil (${PrizeLadder.getWalkAwayAmount(_level)} ₺)',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: _showLadderModal,
                        icon: const Icon(Icons.military_tech, color: Color(0xFFF59E0B)),
                      ),
                      IconButton(
                        onPressed: () {
                          setState(() {
                            SoundService().toggleMute();
                          });
                        },
                        icon: Icon(
                          SoundService().isMuted ? Icons.volume_off : Icons.volume_up,
                          color: const Color(0xFFF59E0B),
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              // Sunucu Balonu
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B).withOpacity(0.8),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: Colors.white12),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: const Color(0xFFF59E0B).withOpacity(0.2),
                      child: Text(host.avatar, style: const TextStyle(fontSize: 20)),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(host.name, style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 11, fontWeight: FontWeight.bold)),
                          Text(
                            '"$_hostSpeech"',
                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Jokerler Çubuğu
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildLifelineButton('%50:50', Icons.pie_chart, _lifelineFifty, _useFiftyFifty),
                  _buildLifelineButton('Telefon', Icons.phone, _lifelinePhone, _usePhoneLifeline),
                  _buildLifelineButton('Seyirci', Icons.groups, _lifelineAudience, _useAudienceLifeline),
                  _buildLifelineButton('Değiştir', Icons.refresh, _lifelineChange, _useChangeLifeline),
                  _buildLifelineButton('Çift Hak', Icons.shield, _lifelineDouble, _useDoubleLifeline),
                ],
              ),

              // Soru Kartı
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.4), width: 1.5),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.4), blurRadius: 20),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white10,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            'Soru $_level / 15',
                            style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                        Text(
                          step.formattedAmount,
                          style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 13, fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _currentQuestion.question,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),

              // Şıklar (A, B, C, D)
              Column(
                children: List.generate(4, (i) {
                  final isEliminated = _eliminatedIndices.contains(i);
                  final isSelected = _selectedIndex == i;
                  final isCorrectAnswer = i == _currentQuestion.correctAnswer;

                  Color bgColor = const Color(0xFF1E293B);
                  Color borderColor = Colors.white12;
                  Color textColor = Colors.white;

                  if (isEliminated) {
                    bgColor = Colors.transparent;
                    borderColor = Colors.white10;
                    textColor = Colors.white24;
                  } else if (_isRevealed) {
                    if (isCorrectAnswer) {
                      bgColor = const Color(0xFF059669);
                      borderColor = const Color(0xFF34D399);
                    } else if (isSelected) {
                      bgColor = const Color(0xFFDC2626);
                      borderColor = const Color(0xFFF87171);
                    }
                  } else if (isSelected) {
                    bgColor = const Color(0xFFF59E0B);
                    borderColor = const Color(0xFFFDE68A);
                    textColor = const Color(0xFF090D16);
                  }

                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4.0),
                    child: InkWell(
                      onTap: () => _onSelectOption(i),
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: bgColor,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: borderColor, width: 1.5),
                        ),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 12,
                              backgroundColor: isSelected ? const Color(0xFF090D16) : const Color(0xFF0F172A),
                              child: Text(
                                letters[i],
                                style: TextStyle(
                                  color: isSelected ? const Color(0xFFF59E0B) : Colors.white70,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                isEliminated ? '' : _currentQuestion.options[i],
                                style: TextStyle(
                                  color: textColor,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),

              // Son Kararım Butonu
              if (_selectedIndex != null && !_isLocked)
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _confirmAnswer,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF59E0B),
                      foregroundColor: const Color(0xFF090D16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 6,
                    ),
                    child: const Text(
                      'SON KARARIM! (KİLİTLE)',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 1),
                    ),
                  ),
                )
              else
                const SizedBox(height: 48),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLifelineButton(String title, IconData icon, bool isAvailable, VoidCallback onTap) {
    return InkWell(
      onTap: isAvailable && !_isLocked ? onTap : null,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isAvailable ? const Color(0xFF1E293B) : Colors.black26,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isAvailable ? const Color(0xFFF59E0B).withOpacity(0.4) : Colors.white10,
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              size: 16,
              color: isAvailable ? const Color(0xFFF59E0B) : Colors.white24,
            ),
            const SizedBox(height: 2),
            Text(
              title,
              style: TextStyle(
                color: isAvailable ? Colors.white : Colors.white24,
                fontSize: 9,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
