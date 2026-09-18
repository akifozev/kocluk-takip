import 'package:flutter/material.dart';
import '../models/host.dart';
import '../services/sound_service.dart';
import 'game_screen.dart';

class GameOverScreen extends StatelessWidget {
  final int amountWon;
  final int levelReached;
  final String explanation;
  final HostType hostType;

  const GameOverScreen({
    super.key,
    required this.amountWon,
    required this.levelReached,
    required this.explanation,
    required this.hostType,
  });

  @override
  Widget build(BuildContext context) {
    final host = HostData.hosts[hostType]!;
    final isWinner = amountWon > 0;

    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const SizedBox(height: 20),
              Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: isWinner
                        ? const Color(0xFFF59E0B).withValues(alpha: 0.2)
                        : Colors.redAccent.withValues(alpha: 0.2),
                    child: Icon(
                      isWinner ? Icons.emoji_events : Icons.sentiment_dissatisfied,
                      color: isWinner ? const Color(0xFFF59E0B) : Colors.redAccent,
                      size: 44,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    isWinner ? 'Tebrikler, Kazandın!' : 'Oyun Bitti!',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '$levelReached. seviyeye kadar ulaştın.',
                    style: const TextStyle(color: Colors.white60, fontSize: 13),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFFF59E0B).withValues(alpha: 0.4)),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'KAZANILAN ÖDÜL',
                          style: TextStyle(
                            color: Colors.white60,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '$amountWon ₺',
                          style: const TextStyle(
                            color: Color(0xFFF59E0B),
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Row(
                      children: [
                        Text(host.avatar, style: const TextStyle(fontSize: 24)),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            isWinner
                                ? '${host.name}: "Harika yarıştın, $amountWon ₺ ödülün tadını çıkar!"'
                                : '${host.name}: "Sağlık olsun! Şansını bir daha denemelisin."',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (explanation.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0284C7).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF0284C7).withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.info_outline, color: Color(0xFF38BDF8), size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              explanation,
                              style: const TextStyle(color: Color(0xFFBAE6FD), fontSize: 11, height: 1.3),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        SoundService().playClick();
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (context) => GameScreen(hostType: hostType),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF59E0B),
                        foregroundColor: const Color(0xFF090D16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text(
                        'YENİDEN YARIŞ',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () {
                      SoundService().playClick();
                      Navigator.of(context).pop();
                    },
                    child: const Text(
                      'Ana Menüye Dön',
                      style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
