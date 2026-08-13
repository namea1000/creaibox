const formData = new FormData();
formData.append("targetUrl", "http://lpgatour.localhost:3000/ticket");
formData.append("title", "티켓 예매");
formData.append("autoCreate", "true");
formData.append("refType", "none");

fetch("http://localhost:3000/api/studio/subpage-builder", {
  method: "POST",
  body: formData
}).then(async (res) => {
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
}).catch(err => {
  console.error("Fetch Error:", err);
});
