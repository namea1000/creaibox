const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../src/app/studio');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

const replacements = [
  // 1. Outer page layout wrapper
  {
    regex: /className="min-h-full\s+w-full\s+bg-\[#06080d\]\s+px-5\s+py-8\s+text-zinc-100\s+lg:px-8"/g,
    replace: 'className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300"'
  },
  {
    regex: /className="min-h-full\s+bg-\[#06080d\]\s+px-5\s+py-8\s+text-zinc-100\s+lg:px-8"/g,
    replace: 'className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300"'
  },
  {
    regex: /className="min-h-full\s+bg-\[#06080d\]\s+px-4\s+py-6\s+text-zinc-100\s+lg:px-8\s+lg:py-8"/g,
    replace: 'className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-4 py-6 text-zinc-800 dark:text-zinc-100 lg:px-8 lg:py-8 transition-colors duration-300"'
  },
  
  // 2. Loadings / center boxes
  {
    regex: /className="flex\s+min-h-\[400px\]\s+w-full\s+items-center\s+justify-center\s+bg-\[#06080d\]"/g,
    replace: 'className="flex min-h-[400px] w-full items-center justify-center bg-zinc-50 dark:bg-[#06080d] text-zinc-800 dark:text-zinc-100 transition-colors duration-300"'
  },

  // 3. Hero layout card (background and border)
  {
    regex: /bg-gradient-to-br\s+from-zinc-900\s+to-\[#([0-9a-fA-F]{6})\]\s+p-7\s+shadow-2xl/g,
    replace: 'bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#$1] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300'
  },
  {
    regex: /border\s+border-zinc-800\s+bg-gradient-to-br\s+from-zinc-900/g,
    replace: 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900'
  },

  // 4. Hero text color
  {
    regex: /className="text-3xl\s+font-black\s+tracking-tight\s+text-white\s+md:text-5xl"/g,
    replace: 'className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl"'
  },
  {
    regex: /className="text-lg\s+font-black\s+text-white"/g,
    replace: 'className="text-lg font-black text-zinc-900 dark:text-white"'
  },
  {
    regex: /className="text-xl\s+font-black\s+text-white"/g,
    replace: 'className="text-xl font-black text-zinc-900 dark:text-white"'
  },

  // 5. Stat card
  {
    regex: /className="rounded-2xl\s+border\s+border-zinc-800\s+bg-zinc-900\/70\s+p-5"/g,
    replace: 'className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm dark:shadow-none transition-colors duration-300"'
  },
  {
    regex: /className="text-2xl\s+font-black\s+text-white"/g,
    replace: 'className="text-2xl font-black text-zinc-900 dark:text-white"'
  },
  
  // 6. Workflow cards / Link boxes
  {
    regex: /className="group\s+rounded-2xl\s+border\s+border-zinc-800\s+bg-zinc-900\/70\s+p-5\s+transition\s+hover:-translate-y-0\.5\s+hover:border-([a-z-]+)-500\/40\s+hover:bg-zinc-900"/g,
    replace: 'className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-$1-500/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300"'
  },
  {
    regex: /className="truncate\s+text-base\s+font-black\s+text-white"/g,
    replace: 'className="truncate text-base font-black text-zinc-900 dark:text-white"'
  },

  // 7. Info boxes
  {
    regex: /className="rounded-2xl\s+border\s+border-zinc-800\s+bg-zinc-900\/60\s+p-6"/g,
    replace: 'className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300"'
  },

  // 8. Custom buttons
  {
    regex: /className="inline-flex\s+h-11\s+items-center\s+gap-2\s+rounded-xl\s+border\s+border-zinc-700\s+bg-zinc-900\s+px-4\s+text-sm\s+font-black\s+text-zinc-200\s+transition\s+hover:border-([a-z-]+)-500\/50\s+hover:text-white"/g,
    replace: 'className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm font-black text-zinc-700 dark:text-zinc-200 transition hover:border-$1-500/50 hover:text-zinc-900 dark:hover:text-white"'
  },
  {
    regex: /className="rounded-full\s+border\s+border-zinc-800\s+bg-zinc-950\s+px-3\s+py-1\.5\s+text-xs\s+font-bold\s+text-zinc-300\s+transition\s+hover:border-([a-z-]+)-500\/40\s+hover:text-\1-400"/g,
    replace: 'className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-650 dark:text-zinc-300 transition hover:border-$1-500/40 hover:text-$1-600 dark:hover:text-$1-400"'
  }
];

let modifiedCount = 0;

walkDir(targetDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (let rep of replacements) {
    content = content.replace(rep.regex, rep.replace);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Modified: ${path.relative(targetDir, filePath)}`);
    modifiedCount++;
  }
});

console.log(`\nSuccessfully modified ${modifiedCount} files.`);
