document.addEventListener("DOMContentLoaded", () => {

    const exportBtn = document.querySelector(".export-btn");
    const importBtn = document.querySelector(".import-btn");

    const exportBox = document.getElementById("exportBox");
    const importBox = document.getElementById("importBox");

    const restoreBtn = document.querySelector(".restore-btn");

restoreBtn.addEventListener("click", () => {
    const backup = localStorage.getItem("attendance_backup");

    if (!backup) {
        alert("No backup found");
        return;
    }

    localStorage.setItem("attendance", backup);

    alert("Previous data restored!");
});

    exportBtn.addEventListener("click", () => {
        const data = localStorage.getItem("attendance") || "{}";

        exportBox.value = data;

        navigator.clipboard.writeText(data);

        alert("Copied to clipboard!");
    });

  
    importBtn.addEventListener("click", () => {
    try {
        const parsed = JSON.parse(importBox.value);

        
        if (typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("Invalid format");
        }

        for (let date in parsed) {
            const day = parsed[date];

            if (typeof day !== "object") throw new Error("Invalid day data");

            for (let sub in day) {
                const val = day[sub];

                if (!["P", "A", "H"].includes(val)) {
                    throw new Error("Invalid attendance value");
                }
            }
        }

        
        const oldData = localStorage.getItem("attendance");
        localStorage.setItem("attendance_backup", oldData);

        localStorage.setItem("attendance", JSON.stringify(parsed));

        alert("Data loaded successfully! Backup saved.");

    } catch (err) {
        alert("Invalid JSON format");
    }
});

});