const fs = require('fs');

const raw = fs.readFileSync('scratch/step_50_chunks_raw.txt', 'utf8');

// The raw string is a string representing a JSON array. Let's evaluate or parse it.
// To handle bad control characters, we can clean them up or use eval.
try {
  const chunks = eval(raw);
  console.log('Number of chunks:', chunks.length);
  chunks.forEach((chunk, index) => {
    fs.writeFileSync(`scratch/step_50_chunk_${index}_target.txt`, chunk.TargetContent);
    fs.writeFileSync(`scratch/step_50_chunk_${index}_replacement.txt`, chunk.ReplacementContent);
    console.log(`Wrote target and replacement for chunk ${index}`);
  });
} catch (e) {
  console.error(e);
}
