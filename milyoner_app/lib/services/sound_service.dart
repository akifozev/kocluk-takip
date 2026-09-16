import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SoundService {
  static final SoundService _instance = SoundService._internal();
  factory SoundService() => _instance;
  SoundService._internal();

  bool _isMuted = false;
  bool get isMuted => _isMuted;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _isMuted = prefs.getBool('is_muted') ?? false;
  }

  Future<void> toggleMute() async {
    _isMuted = !_isMuted;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_muted', _isMuted);
    if (!_isMuted) {
      playClick();
    }
  }

  void playClick() {
    if (_isMuted) return;
    HapticFeedback.lightImpact();
  }

  void playLockIn() {
    if (_isMuted) return;
    HapticFeedback.mediumImpact();
  }

  void playCorrect() {
    if (_isMuted) return;
    HapticFeedback.heavyImpact();
  }

  void playWrong() {
    if (_isMuted) return;
    HapticFeedback.vibrate();
  }
}
