import confetti from 'canvas-confetti';

export const triggerSuccessConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch {
    // Graceful fallback if canvas is not available
  }
};
