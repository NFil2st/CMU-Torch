export const calculateMoodScore = (mood) => {
  if (mood === "ดี") return 5;
  if (mood === "เฉยๆ") return 3;
  return 1;
};
