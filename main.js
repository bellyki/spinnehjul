const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const cheerSound = new Audio("cheer.mp3");
const dino = document.getElementById("dino");
const nameInput = document.getElementById("name-input");
const addBtn = document.getElementById("add-btn");


const names = [];


let winnerIndex = null;


const getColors = () =>
  names.map((_, index) => {
    if (names.length % 2 === 1 && index === names.length - 1) return "#d4407f";
    return index % 2 === 0 ? "#a8005f" : "#6b0f3f";
  });


let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [...names],
    datasets: [
      {
        backgroundColor: getColors(),
        data: names.map(() => 1),
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 22, weight: "bold" },
      },
    },
  },
});


const updateWheel = () => {
  myChart.data.labels = [...names];
  myChart.data.datasets[0].data = names.map(() => 1);
  myChart.data.datasets[0].backgroundColor = getColors();
  myChart.update();
};


const addName = () => {
  const newName = nameInput.value.trim();
  if (newName === "") return;
  names.push(newName);
  nameInput.value = "";
  nameInput.focus();
  updateWheel();
};
addBtn.addEventListener("click", addName);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addName();
});


const removeWinner = () => {
  if (winnerIndex === null) return;
  names.splice(winnerIndex, 1);
  winnerIndex = null;
  updateWheel();
};


const celebrate = () => {
  const tellColors = ["#a8005f", "#6b0f3f", "#f2f7b5", "#ffffff"];
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: tellColors, scalar: 2 });
  confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors: tellColors, scalar: 2 });
  confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors: tellColors, scalar: 2 });
  cheerSound.currentTime = 0;
  cheerSound.play();
};


const valueGenerator = (angleValue) => {
  const sliceSize = 360 / names.length;
  const index = Math.floor(((90 - angleValue + 360) % 360) / sliceSize);
  const winner = names[index];
  finalValue.innerHTML = `<p>VINNEREN ER ${winner}!!!!!</p>`;
  winnerIndex = index;
  spinBtn.disabled = false;
  celebrate();


  if (winner.toLowerCase() === "linda") {
    dino.src = "dino-linda.png";
  } else {
    dino.src = "dino.png";
  }


  dino.classList.add("dancing");
  setTimeout(() => dino.classList.remove("dancing"), 6000);
};

let count = 0;
let resultValue = 101;


spinBtn.addEventListener("click", () => {

  removeWinner();


  if (names.length === 0) {
    finalValue.innerHTML = `<p>Legg til navn først!</p>`;
    return;
  }

  spinBtn.disabled = true;
  cheerSound.pause();
  dino.classList.remove("dancing");
  finalValue.innerHTML = `<p>LYKKE TIL!!</p>`;
  let randomDegree = Math.floor(Math.random() * 356);
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});