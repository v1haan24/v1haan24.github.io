const timetable = JSON.parse(localStorage.getItem("timetable")) || {};
const container = document.querySelector(".container");

const dateInput = document.querySelector(".date-input");

dateInput.addEventListener("change", () => {
    const selectedDate = dateInput.value;

    
    document.querySelectorAll(".subject-row").forEach(el => el.remove());
    document.querySelectorAll(".msg").forEach(el => el.remove());

    if (!selectedDate) return;

    const today = new Date();
    const selected = new Date(selectedDate);

    today.setHours(0,0,0,0);
    selected.setHours(0,0,0,0);

   
    if (selected > today) {
        const msg = document.createElement("p");
        msg.className = "msg";
        msg.innerText = "This date has not occurred yet";

        container.insertBefore(msg, document.querySelector(".btn"));
        return;
    }

    const dayName = selected.toLocaleDateString("en-US", { weekday: "long" });
    const subjects = timetable[dayName];

   
    if (!subjects || subjects.length === 0) {
        const msg = document.createElement("p");
        msg.className = "msg";
        msg.innerText = "No lectures on this day.";

        container.insertBefore(msg, document.querySelector(".btn"));
        return;
    }

    
    subjects.forEach(sub => {
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

        container.insertBefore(row, document.querySelector(".btn"));
    });

    
    const data = JSON.parse(localStorage.getItem("attendance")) || {};
    const dayData = data[selectedDate];

    if (!dayData) {
        const msg = document.createElement("p");
        msg.className = "msg";
        msg.innerText = "No attendance recorded for this day";

        container.insertBefore(msg, document.querySelector(".btn"));
        return;
    }

    document.querySelectorAll(".subject-row").forEach(row => {
        const subject = row.querySelector(".subject-name").innerText;
        const value = dayData[subject];

        if (value) {
            const radio = row.querySelector(`input[value="${value}"]`);
            if (radio) radio.checked = true;
        }
    });
});



const updateBtn = document.querySelector(".btn");

updateBtn.addEventListener("click", () => {
    const date = dateInput.value;

    if (!date) {
        alert("Select a date first");
        return;
    }

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

    alert("Updated!");
});