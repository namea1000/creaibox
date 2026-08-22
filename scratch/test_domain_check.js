async function testDomainCheck() {
  const payload = { domain: "creaibox.ai", tld: ".com" };
  const res = await fetch("http://localhost:3000/api/domains/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log("Check result for creaibox.ai:", JSON.stringify(data, null, 2));
}

testDomainCheck();
