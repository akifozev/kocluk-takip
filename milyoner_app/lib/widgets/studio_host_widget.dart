import 'package:flutter/material.dart';
import '../models/host.dart';

enum HostMood {
  asking,
  pondering,
  correct,
  wrong,
}

class StudioHostWidget extends StatefulWidget {
  final HostType hostType;
  final HostMood mood;
  final String speech;

  const StudioHostWidget({
    super.key,
    required this.hostType,
    required this.mood,
    required this.speech,
  });

  @override
  State<StudioHostWidget> createState() => _StudioHostWidgetState();
}

class _StudioHostWidgetState extends State<StudioHostWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _breathAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);

    _breathAnim = Tween<double>(begin: 0.0, end: 4.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
  }

  @override
  void disposeWidget() {
    _animController.dispose();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final host = HostData.hosts[widget.hostType]!;

    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          width: double.infinity,
          height: 180,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: const LinearGradient(
              colors: [Color(0xFF0F172A), Color(0xFF020617)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            border: Border.all(
              color: const Color(0xFF38BDF8).withValues(alpha: 0.25),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF1E1B4B).withValues(alpha: 0.6),
                blurRadius: 20,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              // 1. Arka Plan Stüdyo Işıkları (Studio Beams)
              Positioned(
                top: 0,
                left: constraints.maxWidth * 0.2,
                child: Container(
                  width: 60,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      colors: [
                        const Color(0xFF38BDF8).withValues(alpha: 0.2),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 0,
                right: constraints.maxWidth * 0.2,
                child: Container(
                  width: 60,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      colors: [
                        const Color(0xFFF59E0B).withValues(alpha: 0.2),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),

              // 2. Masanın Karşısında Oturan Sunucu Karakteri (Host Seated)
              Positioned(
                bottom: 28,
                left: 0,
                right: 0,
                child: AnimatedBuilder(
                  animation: _breathAnim,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(
                        0,
                        widget.mood == HostMood.pondering
                            ? 6.0
                            : -_breathAnim.value,
                      ),
                      child: child,
                    );
                  },
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Sunucu Kafası & İfadesi
                      _buildHostFace(host),
                      // Sunucu Gövdesi & Omuzları
                      _buildHostBody(widget.hostType),
                    ],
                  ),
                ),
              ),

              // 3. Stüdyo Masası (Studio Desk in Front)
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  height: 38,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [
                        Color(0xFF1E293B),
                        Color(0xFF0F172A),
                        Color(0xFF1E293B),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: const BorderRadius.vertical(
                      bottom: Radius.circular(22),
                    ),
                    border: Border(
                      top: BorderSide(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.8),
                        width: 2.5,
                      ),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.25),
                        blurRadius: 12,
                        offset: const Offset(0, -3),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      // Masadaki Dijital Ekran / Tablet
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF020617),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: const Color(0xFF38BDF8).withValues(alpha: 0.4),
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: Color(0xFF10B981),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Text(
                              'LIVE',
                              style: TextStyle(
                                color: Color(0xFF38BDF8),
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Sunucu Kartları / Not Kağıdı
                      Container(
                        width: 28,
                        height: 16,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.85),
                          borderRadius: BorderRadius.circular(3),
                          boxShadow: const [
                            BoxShadow(color: Colors.black26, blurRadius: 4),
                          ],
                        ),
                        child: Center(
                          child: Container(
                            width: 20,
                            height: 2,
                            color: Colors.black45,
                          ),
                        ),
                      ),
                      // Su Bardağı
                      Container(
                        width: 12,
                        height: 18,
                        decoration: BoxDecoration(
                          color: const Color(0xFF38BDF8).withValues(alpha: 0.25),
                          borderRadius: const BorderRadius.vertical(
                            bottom: Radius.circular(4),
                          ),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.4),
                            width: 0.8,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // 4. Konuşma Baloncuğu (Speech Bubble)
              Positioned(
                top: 8,
                left: 12,
                right: 12,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B).withValues(alpha: 0.92),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: widget.mood == HostMood.wrong
                          ? Colors.redAccent
                          : widget.mood == HostMood.correct
                              ? Colors.greenAccent
                              : widget.mood == HostMood.pondering
                                  ? const Color(0xFFF59E0B)
                                  : Colors.white24,
                      width: 1.2,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black45,
                        blurRadius: 8,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Text(
                        _getMoodEmoji(),
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              host.name,
                              style: const TextStyle(
                                color: Color(0xFFF59E0B),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.5,
                              ),
                            ),
                            Text(
                              '"${widget.speech}"',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                height: 1.2,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  String _getMoodEmoji() {
    switch (widget.mood) {
      case HostMood.pondering:
        return '🤔';
      case HostMood.correct:
        return '👏';
      case HostMood.wrong:
        return '🤦‍♂️';
      case HostMood.asking:
        return '🎙️';
    }
  }

  Widget _buildHostFace(HostInfo host) {
    return Container(
      width: 58,
      height: 58,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: const Color(0xFF1E293B),
        border: Border.all(
          color: widget.mood == HostMood.pondering
              ? const Color(0xFFF59E0B)
              : widget.mood == HostMood.correct
                  ? const Color(0xFF10B981)
                  : Colors.white24,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: Text(
          host.avatar,
          style: const TextStyle(fontSize: 34),
        ),
      ),
    );
  }

  Widget _buildHostBody(HostType type) {
    Color bodyColor;
    Widget detail;

    switch (type) {
      case HostType.kenan:
        // Şık siyah/lacivert takım elbise & kravat
        bodyColor = const Color(0xFF0F172A);
        detail = Column(
          children: [
            Container(
              width: 14,
              height: 18,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(4)),
              ),
              child: Center(
                child: Container(
                  width: 4,
                  height: 14,
                  color: const Color(0xFFDC2626), // Kırmızı kravat
                ),
              ),
            ),
          ],
        );
        break;
      case HostType.kanka:
        // Rahat kapüşonlu spor kıyafet
        bodyColor = const Color(0xFF0284C7);
        detail = Container(
          width: 16,
          height: 10,
          margin: const EdgeInsets.only(top: 2),
          decoration: BoxDecoration(
            color: const Color(0xFF38BDF8),
            borderRadius: BorderRadius.circular(4),
          ),
        );
        break;
      case HostType.prof:
        // Akademik kahverengi/gri ceket & papyon
        bodyColor = const Color(0xFF78350F);
        detail = Container(
          width: 12,
          height: 8,
          margin: const EdgeInsets.only(top: 2),
          decoration: BoxDecoration(
            color: const Color(0xFFFBBF24),
            borderRadius: BorderRadius.circular(2),
          ),
        );
        break;
    }

    return Container(
      width: 90,
      height: 38,
      decoration: BoxDecoration(
        color: bodyColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(color: Colors.white12),
      ),
      child: detail,
    );
  }
}
