const data = JSON.parse(localStorage.getItem("attendance")) || {};

let subjects = {};

for (let date in data) {
    const day = data[date];

    for (let sub in day) {
        if (!subjects[sub]) {
            subjects[sub] = { present: 0, total: 0 };
        }

        if (day[sub] !== "H") {
            subjects[sub].total++;
        }

        if (day[sub] === "P") {
            subjects[sub].present++;
        }
    }
}

const select = document.getElementById("subjectSelect");

Object.keys(subjects).forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.innerText = sub;
    select.appendChild(option);
});

let chart;

document.querySelector(".btn").addEventListener("click", () => {

    const sub = select.value;
    const future = Number(document.getElementById("futureLectures").value);

    const P = subjects[sub].present;
    const T = subjects[sub].total;

    const target = 75;

    const percent = T === 0 ? 0 : (P / T) * 100;

    let diff;

    if (percent >= target) {
        diff = Math.floor((P / (target/100)) - T);
    } else {
        diff = -Math.ceil(((target/100) * T - P) / (1 - (target/100)));
    }

    let need = 0;

    while (((P + need) / (T + future)) * 100 < target) {
        need++;
        if (need > future) break;
    }

    let futureText;

    if (need > future) {
        futureText = `
            <span class="bad">
            Even if you attend all ${future} lectures,<br>
            you will still not reach 75%
            </span>
        `;
    } else {
        futureText = `
            Out of ${future} upcoming lectures,<br>
            you need to attend <b>${need}</b>
        `;
    }

    document.querySelector(".result").innerHTML = `
        <p><b>${sub}</b></p>
        <p>Current Attendance: ${percent.toFixed(2)}%</p>
        <p>${diff >= 0 
            ? `<span class="good">You are safe by ${diff} lectures</span>` 
            : `<span class="bad">You are short by ${Math.abs(diff)} lectures</span>`}
        </p>
        <p>${futureText}</p>
    `;

    const labels = [];
    const values = [];
    const targetLine = [];

    for (let i = 0; i <= future; i++) {
        labels.push(i);
        values.push(((P + i) / (T + future)) * 100);
        targetLine.push(75);
    }

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("bunkChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "% after attending i lectures",
                    data: values
                },
                {
                    type: "line",
                    label: "Target (75%)",
                    data: targetLine,
                    borderWidth: 2,
                    fill: false
                }
            ]
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

});