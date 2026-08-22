require('dotenv').config({ path: '.env.local' });

async function listVercelProjects() {
  const token = process.env.VERCEL_AUTH_TOKEN;
  const res = await fetch('https://api.vercel.com/v9/projects', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  console.log("Vercel Projects status:", res.status);
  if (json.projects) {
    console.log("Projects found:", json.projects.map(p => ({ id: p.id, name: p.name })));
    
    // Find creaibox project
    const creaiboxProject = json.projects.find(p => p.name.toLowerCase().includes('creaibox'));
    if (creaiboxProject) {
      console.log(`Found CreaiBox project ID: ${creaiboxProject.id} (${creaiboxProject.name})`);
      
      // Attempt to bind sotongchaeum.com and www.sotongchaeum.com
      for (const d of ['sotongchaeum.com', 'www.sotongchaeum.com']) {
        const bindRes = await fetch(`https://api.vercel.com/v9/projects/${creaiboxProject.id}/domains`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: d })
        });
        const bindJson = await bindRes.json();
        console.log(`Binding ${d} result:`, bindRes.status, bindJson);
      }
    }
  } else {
    console.log("Response:", json);
  }
}

listVercelProjects();
