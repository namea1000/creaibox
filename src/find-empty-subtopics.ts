import { topicSubTopics } from "./lib/content-planner/topic-categories";
import { ideaHubSeries } from "./lib/content-planner/topic-series";

const subTopicCounts: Record<string, number> = {};
topicSubTopics.forEach((sub) => {
  subTopicCounts[sub.id] = 0;
});

ideaHubSeries.forEach((item) => {
  if (subTopicCounts[item.subTopicId] !== undefined) {
    subTopicCounts[item.subTopicId]++;
  } else {
    // If it's a subtopic not in topicSubTopics
    subTopicCounts[item.subTopicId] = 1;
  }
});

const report = topicSubTopics.map((sub) => {
  const count = subTopicCounts[sub.id] || 0;
  return {
    id: sub.id,
    categoryId: sub.categoryId,
    name: sub.name,
    count: count
  };
});

console.log("=== SUBTOPICS WITH 0 SERIES ===");
const zeroSubtopics = report.filter(r => r.count === 0);
zeroSubtopics.forEach(r => {
  console.log(`- [${r.categoryId}] ${r.name} (${r.id}): ${r.count}`);
});

console.log("\n=== SUBTOPICS WITH <= 5 SERIES ===");
const fewSubtopics = report.filter(r => r.count > 0 && r.count <= 5);
fewSubtopics.forEach(r => {
  console.log(`- [${r.categoryId}] ${r.name} (${r.id}): ${r.count}`);
});
