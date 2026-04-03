import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔑 Supabase Config
const supabase = createClient(
  "https://swnkofbqkcybpynmtzsl.supabase.co",
  "sb_publishable_6xieaiwfjluDTr3dI3_T2Q_OltjO1fg"
);

// ✅ Page load hone ke baad run hoga
document.addEventListener("DOMContentLoaded", () => {
  console.log("App loaded ✅");

  const uploadBtn = document.getElementById("uploadBtn");

  if (!uploadBtn) {
    console.error("❌ uploadBtn not found");
    return;
  }

  uploadBtn.addEventListener("click", uploadResume);
});

// 🚀 Upload Function
async function uploadResume() {
  try {
    const fileInput = document.getElementById("fileInput");
    const resultBox = document.getElementById("result");

    if (!fileInput) {
      console.error("fileInput not found");
      return;
    }

    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file first");
      return;
    }

    resultBox.innerText = "Uploading... ⏳";

    const fileName = Date.now() + "_" + file.name;

    // 📤 Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      resultBox.innerText = "❌ Upload failed";
      return;
    }

    // 🔗 Get public URL
    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;

    // 🤖 Fake ATS Score
    const atsScore = Math.floor(Math.random() * 40) + 60;

    // 💾 Save in database
    const { error: dbError } = await supabase.from("resumes").insert([
      {
        name: file.name,
        file_url: fileUrl,
        ats_score: atsScore,
      },
    ]);

    if (dbError) {
      console.error("DB error:", dbError);
    }

    // ✅ Success Output
    resultBox.innerHTML = `
      ✅ Uploaded Successfully <br><br>
      📊 ATS Score: <b>${atsScore}</b> <br><br>
      🔗 <a href="${fileUrl}" target="_blank">View Resume</a>
    `;

    console.log("Upload complete 🚀");

  } catch (err) {
    console.error("Unexpected error:", err);
    document.getElementById("result").innerText = "❌ Something went wrong";
  }
}
