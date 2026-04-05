const data = JSON.parse(localStorage.getItem("attendance")) || {};

let subjects = {};

for (let date in data) {
    const dayData = data[date];

    for (let subject in dayData) {
        if (!subjects[subject]) {
            subjects[subject] = { present: 0, total: 0 };
        }

        if (dayData[subject] === "P") {
            subjects[subject].present++;
        }

        if (dayData[subject] !== "H") {
            subjects[subject].total++;
        }
    }
}

const table = document.querySelector("table");

let totalP = 0;
let totalT = 0;



Object.keys(subjects).forEach(sub => {
    const p = subjects[sub].present;
    const t = subjects[sub].total;

    totalP += p;
    totalT += t;

    const percent = t === 0 ? 0 : Math.round((p / t) * 100);


    let status = "";
    let cls = "";
  

    if (percent < 75) {
        status = "Low";
        cls = "red";
        
    } else if (percent < 85) {
        status = "Good";
        cls = "orange";
       
    } else {
        status = "Excellent";
        cls = "green";
        
    }

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${sub}</td>
        <td>${p}/${t}</td>
        <td class="${cls}">${percent}%</td>
        <td class="${cls}">${status}</td>
    `;

    table.appendChild(row);
});

const overall = totalT === 0 ? 0 : Math.round((totalP / totalT) * 100);

document.querySelector(".overall").innerText = `Overall Attendance: ${overall}%`;



const labels = Object.keys(subjects);
const values = labels.map(sub => {
    const p = subjects[sub].present;
    const t = subjects[sub].total;
    return t === 0 ? 0 : Math.round((p / t) * 100);
});

new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
        labels: labels,
        datasets: [{
            label: "Attendance %",
            data: values,
            barThickness: 25
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});