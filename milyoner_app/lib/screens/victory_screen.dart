import 'package:flutter/material.dart';
import '../models/host.dart';
import '../services/sound_service.dart';
import 'game_screen.dart';

class VictoryScreen extends StatelessWidget {
  final HostType hostType;

  const VictoryScreen({super.key, required this.hostType});

  @override
  Widget build(BuildContext context) {
    final host = HostData.hosts[hostType]!;

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
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFFF59E0B), Color(0xFFFDE68A)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF59E0B).withValues(alpha: 0.6),
                          blurRadius: 40,
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.military_tech,
                      size: 60,
                      color: Color(0xFF090D16),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'BÜYÜK ŞAMPİYON!',
                    style: TextStyle(
                      color: Color(0xFFFBBF24),
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    '15 sorunun tamamını bilerek tarihe geçtin!',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF92400E), Color(0xFFD97706)],
                      ),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFFFDE68A), width: 2),
                    ),
                    child: const Column(
                      children: [
                        Text(
                          'KAZANILAN BÜYÜK ÖDÜL',
                          style: TextStyle(
                            color: Color(0xFFFEF3C7),
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          '10.000.000 ₺',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 34,
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
                        Text(host.avatar, style: const TextStyle(fontSize: 26)),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            '${host.name}: "İnanılmaz bir zeka örneği! 10 Milyon liranın gururlu sahibisin!"',
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
                        'TEKRAR OYNA',
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
