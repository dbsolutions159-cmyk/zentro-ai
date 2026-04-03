const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const resultBox = document.getElementById("result");

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("resume", file);

  resultBox.innerHTML = "⏳ Uploading Resume...";

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      resultBox.innerHTML = `
        <div style="padding:15px;background:#1e293b;border-radius:10px;">
          <h3 style="color:#22c55e;">✅ Upload Successful</h3>
          <p><b>📄 File:</b> ${file.name}</p>
          <p><b>🎯 ATS Score:</b> ${data.atsScore}</p>
          <a href="${data.url}" target="_blank" style="color:#3b82f6;">
            🔗 View Resume
          </a>
        </div>
      `;
    } else {
      resultBox.innerHTML = "❌ Upload failed";
    }
  } catch (error) {
    console.error(error);
    resultBox.innerHTML = "⚠️ Server error";
  }
});
