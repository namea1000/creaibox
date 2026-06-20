const fs = require('fs');

const step380 = JSON.parse(fs.readFileSync('scratch/step_380_args.json', 'utf8'));
const call = step380.tool_calls[0];

console.log('Action:', call.name);
console.log('TargetFile:', call.args.TargetFile);
console.log('Instruction:', call.args.Instruction);
console.log('TargetContent length:', call.args.TargetContent.length);
console.log('ReplacementContent length:', call.args.ReplacementContent.length);

fs.writeFileSync('scratch/step_380_target.txt', call.args.TargetContent);
fs.writeFileSync('scratch/step_380_replacement.txt', call.args.ReplacementContent);
console.log('Saved step_380_target.txt and step_380_replacement.txt');
