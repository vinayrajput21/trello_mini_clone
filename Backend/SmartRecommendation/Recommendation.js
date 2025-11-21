
const KEYWORDS = {
  urgent: ['urgent', 'asap', 'immediately', 'now'],
  short: ['soon', 'this week', 'quick'],
  medium: ['next week', 'planned', 'prepare'],
  long: ['backlog', 'later', 'future'],

  progress: ['started', 'working', 'progress'],
  review: ['review', 'qa', 'test'],
  done: ['completed', 'finished', 'done'],
  waiting: ['blocked', 'waiting', 'pending']
};

function hasKeyword(text, words) {
  if (!text) return false;
  text = text.toLowerCase();
  return words.some(word => text.includes(word));
}

export function suggestDueDate(card) {
  const text = `${card.title} ${card.description || ''}`.toLowerCase();

  if (hasKeyword(text, KEYWORDS.urgent))
    return { suggestion: "ASAP (today)", days: 0 };

  if (hasKeyword(text, KEYWORDS.short))
    return { suggestion: "Within 3 days", days: 3 };

  if (hasKeyword(text, KEYWORDS.medium))
    return { suggestion: "Within 1 week", days: 7 };

  if (hasKeyword(text, KEYWORDS.long))
    return { suggestion: "Backlog / No due date", days: null };

  return { suggestion: "No clear deadline detected", days: null };
}

export function suggestListMovement(card) {
  const text = `${card.title} ${card.description || ''}`.toLowerCase();

  if (hasKeyword(text, KEYWORDS.done)) return "Move to Done";
  if (hasKeyword(text, KEYWORDS.progress)) return "Move to In Progress";
  if (hasKeyword(text, KEYWORDS.review)) return "Move to Review";
  if (hasKeyword(text, KEYWORDS.waiting)) return "Move to Waiting";

  return "No movement suggested";
}


export function findRelatedCards(board, card) {
  const words = new Set(
    (card.title + " " + (card.description || ""))
      .toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 3)
  );

  const results = [];

  board.lists.forEach(list => {
    list.cards.forEach(c => {
      if (c._id === card._id) return;

      const w2 = (c.title + " " + (c.description || ""))
        .toLowerCase()
        .split(/\W+/);

      const score = w2.filter(w => words.has(w)).length;

      if (score > 0) {
        results.push({ card: c, score });
      }
    });
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); 
}

export default {
  suggestDueDate,
  suggestListMovement,
  findRelatedCards
};
