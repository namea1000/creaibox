const fs = require('fs');

const logPath = '/Users/a1234/.gemini/antigravity-ide/brain/a6e391c1-3460-4765-a760-c651c0009136/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const tc of obj.tool_calls) {
        if (tc.name === 'write_to_file' && tc.args.TargetFile && tc.args.TargetFile.includes('extracted_jsx.txt')) {
          console.log('Step:', obj.step_index, 'Args:', JSON.stringify(tc.args));
        }
      }
    }
  } catch (e) {}
}
