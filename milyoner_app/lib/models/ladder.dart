class LadderStep {
  final int level;
  final int amount;
  final String formattedAmount;
  final bool isMilestone;

  const LadderStep({
    required this.level,
    required this.amount,
    required this.formattedAmount,
    required this.isMilestone,
  });
}

class PrizeLadder {
  static const List<LadderStep> steps = [
    LadderStep(level: 15, amount: 10000000, formattedAmount: '10.000.000 ₺', isMilestone: true),
    LadderStep(level: 14, amount: 5000000, formattedAmount: '5.000.000 ₺', isMilestone: false),
    LadderStep(level: 13, amount: 2500000, formattedAmount: '2.500.000 ₺', isMilestone: false),
    LadderStep(level: 12, amount: 1000000, formattedAmount: '1.000.000 ₺', isMilestone: false),
    LadderStep(level: 11, amount: 500000, formattedAmount: '500.000 ₺', isMilestone: false),
    LadderStep(level: 10, amount: 250000, formattedAmount: '250.000 ₺', isMilestone: true), // 2. Baraj
    LadderStep(level: 9, amount: 150000, formattedAmount: '150.000 ₺', isMilestone: false),
    LadderStep(level: 8, amount: 100000, formattedAmount: '100.000 ₺', isMilestone: false),
    LadderStep(level: 7, amount: 60000, formattedAmount: '60.000 ₺', isMilestone: false),
    LadderStep(level: 6, amount: 40000, formattedAmount: '40.000 ₺', isMilestone: false),
    LadderStep(level: 5, amount: 20000, formattedAmount: '20.000 ₺', isMilestone: true), // 1. Baraj
    LadderStep(level: 4, amount: 10000, formattedAmount: '10.000 ₺', isMilestone: false),
    LadderStep(level: 3, amount: 5000, formattedAmount: '5.000 ₺', isMilestone: false),
    LadderStep(level: 2, amount: 2000, formattedAmount: '2.000 ₺', isMilestone: false),
    LadderStep(level: 1, amount: 1000, formattedAmount: '1.000 ₺', isMilestone: false),
  ];

  static int getGuaranteedAmount(int currentLevel) {
    if (currentLevel > 10) return 250000;
    if (currentLevel > 5) return 20000;
    return 0;
  }

  static int getWalkAwayAmount(int currentLevel) {
    if (currentLevel <= 1) return 0;
    final prev = steps.firstWhere(
      (s) => s.level == currentLevel - 1,
      orElse: () => steps.last,
    );
    return prev.amount;
  }

  static LadderStep getStep(int level) {
    return steps.firstWhere(
      (s) => s.level == level,
      orElse: () => steps.last,
    );
  }
}
