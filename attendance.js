const timetable = JSON.parse(localStorage.getItem("timetable")) || {};

const todayDate = new Date();

const date =
    todayDate.getFullYear() +
    "-" +
    String(todayDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(todayDate.getDate()).padStart(2, "0");




const dayName = todayDate.toLocaleDateString("en-US", { weekday: "long" });

document.querySelector(".date").innerText = `${dayName}, ${date}`;

const container = document.getElementById("subjects-container");

const subjectsToday = timetable[dayName];

if (!subjectsToday || subjectsToday.length === 0) {
    container.innerHTML = "<p>No lectures today </p>";
} else {

    subjectsToday.forEach(sub => {
        const row = document.createElement("div");
        row.className = "subject-row";

        row.innerHTML = `
            <div class="subject-name">${sub}</div>
            <div class="options">
                <label class="option present">
                    <input type="radio" name="${sub}" value="P">
                    <span>Present</span>
                </label>

                <label class="option absent">
                    <input type="radio" name="${sub}" value="A">
                    <span>Absent</span>
                </label>

                <label class="option holiday">
                    <input type="radio" name="${sub}" value="H">
                    <span>Holiday</span>
                </label>
            </div>
        `;

        container.appendChild(row);
    });
}

const summary = document.querySelector(".summary");

function updateSummary() {
    let p = 0, a = 0, h = 0;

    document.querySelectorAll(".subject-row").forEach(row => {
        const selected = row.querySelector("input:checked");

        if (selected) {
            if (selected.value === "P") p++;
            if (selected.value === "A") a++;
            if (selected.value === "H") h++;
        }
    });

    summary.innerHTML = `
        <span>Present: ${p}</span>
        <span>Absent: ${a}</span>
        <span>Holiday: ${h}</span>
    `;
}

document.addEventListener("change", (e) => {
    if (e.target.type === "radio") updateSummary();
});

function markAll(value) {
    document.querySelectorAll(".subject-row").forEach(row => {
        const radio = row.querySelector(`input[value="${value}"]`);
        if (radio) radio.checked = true;
    });
    updateSummary();
}

document.querySelector(".all-present").addEventListener("click", () => markAll("P"));
document.querySelector(".all-absent").addEventListener("click", () => markAll("A"));
document.querySelector(".all-holiday").addEventListener("click", () => markAll("H"));

const saveBtn = document.querySelector(".btn");

saveBtn.addEventListener("click", () => {
    let data = JSON.parse(localStorage.getItem("attendance")) || {};

    let dayData = {};

    document.querySelectorAll(".subject-row").forEach(row => {
        const subject = row.querySelector(".subject-name").innerText;
        const selected = row.querySelector("input:checked");

        if (selected) {
            dayData[subject] = selected.value;
        }
    });

    data[date] = dayData;

    localStorage.setItem("attendance", JSON.stringify(data));

    alert("Saved!");
});

const savedData = JSON.parse(localStorage.getItem("attendance")) || {};
const todayData = savedData[date];

if (todayData) {
    document.querySelectorAll(".subject-row").forEach(row => {
        const subject = row.querySelector(".subject-name").innerText;

        const value = todayData[subject];

        if (value) {
            const radio = row.querySelector(`input[value="${value}"]`);
            if (radio) radio.checked = true;
        }
    });

    updateSummary();
}