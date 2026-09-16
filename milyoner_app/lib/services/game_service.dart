import 'dart:convert';
import 'dart:math';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/question.dart';

class GameService {
  static final GameService _instance = GameService._internal();
  factory GameService() => _instance;
  GameService._internal();

  List<Question> _allQuestions = [];
  bool _isLoaded = false;
  final Set<String> _usedQuestionIdsInSession = {};

  bool get isLoaded => _isLoaded;
  int get totalQuestionCount => _allQuestions.length;

  Future<void> loadQuestions() async {
    if (_isLoaded) return;
    try {
      final jsonString = await rootBundle.loadString('assets/questions.json');
      final List<dynamic> jsonList = json.decode(jsonString);
      _allQuestions = jsonList.map((e) => Question.fromJson(e)).toList();
      _isLoaded = true;
    } catch (e) {
      // Fallback
      _allQuestions = [];
    }
  }

  void resetSession() {
    _usedQuestionIdsInSession.clear();
  }

  // Oyuncunun soru seçmesini engelleyen ve seviyeye uygun rastgele soru getiren çekirdek metod
  Question getRandomQuestionForLevel(int level) {
    final candidates = _allQuestions.where((q) => q.level == level).toList();
    if (candidates.isEmpty) {
      // Güvenlik yedeği
      return Question(
        id: 'fallback_$level',
        level: level,
        category: 'Genel Kültür',
        question: 'Türkiye Cumhuriyeti hangi yılda kurulmuştur?',
        options: ['1923', '1920', '1919', '1924'],
        correctAnswer: 0,
        explanation: '29 Ekim 1923 yılında Cumhuriyet ilan edilmiştir.',
      );
    }

    // Henüz sorulmamış olanları filtrele
    final unused = candidates.where((q) => !_usedQuestionIdsInSession.contains(q.id)).toList();
    final pool = unused.isNotEmpty ? unused : candidates;

    final picked = pool[Random().nextInt(pool.length)];
    _usedQuestionIdsInSession.add(picked.id);
    return picked;
  }

  // Soru Değiştir Jokeri için aynı seviyeden farklı bir soru seç
  Question getReplacementQuestion(int level, String currentId) {
    final candidates = _allQuestions.where((q) => q.level == level && q.id != currentId).toList();
    if (candidates.isEmpty) {
      return getRandomQuestionForLevel(level);
    }
    final picked = candidates[Random().nextInt(candidates.length)];
    _usedQuestionIdsInSession.add(picked.id);
    return picked;
  }

  // İstatistikleri kaydetme
  Future<void> saveGameResult({
    required int amountWon,
    required int levelReached,
    required int correctCount,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final totalGames = (prefs.getInt('total_games') ?? 0) + 1;
    final totalWon = (prefs.getInt('total_won') ?? 0) + amountWon;
    final highestWon = max(prefs.getInt('highest_won') ?? 0, amountWon);
    final highestLevel = max(prefs.getInt('highest_level') ?? 1, levelReached);

    await prefs.setInt('total_games', totalGames);
    await prefs.setInt('total_won', totalWon);
    await prefs.setInt('highest_won', highestWon);
    await prefs.setInt('highest_level', highestLevel);
  }

  Future<Map<String, int>> getStats() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'totalGames': prefs.getInt('total_games') ?? 0,
      'totalWon': prefs.getInt('total_won') ?? 0,
      'highestWon': prefs.getInt('highest_won') ?? 0,
      'highestLevel': prefs.getInt('highest_level') ?? 1,
    };
  }
}
