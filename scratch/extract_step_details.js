const fs = require('fs');

const logPath = '/Users/a1234/.gemini/antigravity-ide/brain/a6e391c1-3460-4765-a760-c651c0009136/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

lines.forEach((line) => {
  if (!line.trim()) return;
  try {
    const obj = JSON.parse(line);
    const step = obj.step_index;
    
    if (step === 380) {
      fs.writeFileSync('scratch/step_380_args.json', JSON.stringify(obj, null, 2));
      console.log('Wrote step_380_args.json');
    }
    if (step === 497) {
      fs.writeFileSync('scratch/step_497_args.json', JSON.stringify(obj, null, 2));
      console.log('Wrote step_497_args.json');
    }
  } catch (e) {
    // ignore
  }
});
