class Question {
  final String id;
  final int level;
  final String category;
  final String question;
  final List<String> options;
  final int correctAnswer;
  final String explanation;

  Question({
    required this.id,
    required this.level,
    required this.category,
    required this.question,
    required this.options,
    required this.correctAnswer,
    required this.explanation,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] as String? ?? '',
      level: json['level'] as int? ?? 1,
      category: json['category'] as String? ?? 'Genel Kültür',
      question: json['question'] as String? ?? '',
      options: List<String>.from(json['options'] ?? []),
      correctAnswer: json['correctAnswer'] as int? ?? 0,
      explanation: json['explanation'] as String? ?? '',
    );
  }
}
