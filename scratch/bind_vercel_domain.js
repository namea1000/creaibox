require('dotenv').config({ path: '.env.local' });

async function checkVercelBinding() {
  const token = process.env.VERCEL_AUTH_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  console.log("Token exists:", !!token);
  console.log("ProjectId:", projectId);
  console.log("TeamId:", teamId);

  if (!token || !projectId) {
    console.log("Vercel token or projectId is not configured in .env.local.");
    return;
  }

  const teamQuery = teamId ? `?teamId=${teamId}` : "";
  const domain = "sotongchaeum.com";

  console.log(`Attempting to bind ${domain} to Vercel project ${projectId}...`);

  const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains${teamQuery}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: domain }),
  });

  const json = await res.json();
  console.log("Vercel Add Domain Response:", res.status, json);
}

checkVercelBinding();
