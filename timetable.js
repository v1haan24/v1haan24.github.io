const btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

    let timetable = {};

    days.forEach(day => {
        const value = document.getElementById(day).value;

        if (value.trim() !== "") {
            timetable[day] = value.split(",").map(s => s.trim());
        }
    });

    localStorage.setItem("timetable", JSON.stringify(timetable));

    alert("Timetable Saved!");
});