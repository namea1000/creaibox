const fs = require('fs');

const logPath = '/Users/a1234/.gemini/antigravity-ide/brain/a6e391c1-3460-4765-a760-c651c0009136/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
console.log(`Processing ${lines.length} lines`);

lines.forEach((line) => {
  if (!line.trim()) return;
  try {
    const obj = JSON.parse(line);
    const step = obj.step_index;
    
    if (obj.tool_calls) {
      obj.tool_calls.forEach((call, cIdx) => {
        if (call.name === 'replace_file_content' && call.args.TargetFile.includes('UniversalBlogEditor.tsx')) {
          console.log(`\n--- Step ${step} Tool Call: replace_file_content ---`);
          console.log(`Instruction: ${call.args.Instruction}`);
          console.log(`TargetContent:\n${call.args.TargetContent.slice(0, 300)}...\n`);
          console.log(`ReplacementContent:\n${call.args.ReplacementContent.slice(0, 500)}...\n`);
        }
        if (call.name === 'multi_replace_file_content' && call.args.TargetFile.includes('UniversalBlogEditor.tsx')) {
          console.log(`\n--- Step ${step} Tool Call: multi_replace_file_content ---`);
          console.log(`Instruction: ${call.args.Instruction}`);
          call.args.ReplacementChunks.forEach((chunk, chunkIdx) => {
            console.log(`  Chunk ${chunkIdx}:`);
            console.log(`    TargetContent:\n${chunk.TargetContent.slice(0, 200)}...\n`);
            console.log(`    ReplacementContent:\n${chunk.ReplacementContent.slice(0, 300)}...\n`);
          });
        }
      });
    }
  } catch (e) {
    // ignore
  }
});
