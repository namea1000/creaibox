const fs = require('fs');
const path = require('path');

const logPath = '/Users/a1234/.gemini/antigravity-ide/brain/a6e391c1-3460-4765-a760-c651c0009136/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist at:', logPath);
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
console.log(`Total lines in log: ${lines.length}`);

lines.forEach((line, index) => {
  if (!line.trim()) return;
  try {
    const step = JSON.parse(line);
    
    // Check if the step involves reading UniversalBlogEditor.tsx
    let matches = false;
    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name === 'view_file' && call.args && call.args.AbsolutePath && call.args.AbsolutePath.includes('UniversalBlogEditor.tsx')) {
          matches = true;
          console.log(`Step ${step.step_index} (Index ${index}): Tool Call 'view_file' for UniversalBlogEditor.tsx`);
        }
      }
    }
    
    if (step.type === 'VIEW_FILE' && step.content && step.content.includes('UniversalBlogEditor.tsx')) {
      console.log(`Step ${step.step_index} (Index ${index}): Step Type 'VIEW_FILE' for UniversalBlogEditor.tsx`);
    }

    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name === 'replace_file_content' && call.args && call.args.TargetFile && call.args.TargetFile.includes('UniversalBlogEditor.tsx')) {
          console.log(`Step ${step.step_index} (Index ${index}): Tool Call 'replace_file_content' for UniversalBlogEditor.tsx`);
        }
        if (call.name === 'multi_replace_file_content' && call.args && call.args.TargetFile && call.args.TargetFile.includes('UniversalBlogEditor.tsx')) {
          console.log(`Step ${step.step_index} (Index ${index}): Tool Call 'multi_replace_file_content' for UniversalBlogEditor.tsx`);
        }
      }
    }
  } catch (e) {
    // ignore malformed JSON lines
  }
});
