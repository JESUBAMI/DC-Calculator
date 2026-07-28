let courses = [];

// Standard 5-point Nigerian university grading scale.
// Adjust these cutoffs if your department uses different ranges.
function scoreToGrade(score) {
  if (score >= 70) return { letter: "A", point: 5 };
  if (score >= 60) return { letter: "B", point: 4 };
  if (score >= 50) return { letter: "C", point: 3 };
  if (score >= 45) return { letter: "D", point: 2 };
  if (score >= 40) return { letter: "E", point: 1 };
  return { letter: "F", point: 0 };
}

function classify(cgpa) {
  if (cgpa >= 4.5)
    return { text: "First Class Honours", cssVar: "--first-class" };
  if (cgpa >= 3.5)
    return { text: "Second Class Honours (Upper) - 2:1", cssVar: "--two-one" };
  if (cgpa >= 2.4)
    return { text: "Second Class Honours (Lower) - 2:2", cssVar: "--two-two" };
  if (cgpa >= 1.5) return { text: "Third Class Honours", cssVar: "--third" };
  if (cgpa >= 1.0) return { text: "Pass", cssVar: "--pass" };
  return { text: "Fail", cssVar: "--fail" };
}

function addCourse() {
  const nameInput = document.getElementById("nameInput");
  const unitInput = document.getElementById("unitInput");
  const scoreInput = document.getElementById("scoreInput");

  const name = nameInput.value.trim();
  const unit = Number(unitInput.value);
  const score = Number(scoreInput.value);

  if (name === "" || !unitInput.value || unit <= 0) {
    alert("Enter a course name and a valid unit number.");
    return;
  }
  if (!scoreInput.value || score < 0 || score > 100) {
    alert("Enter a valid score between 0 and 100.");
    return;
  }

  const grade = scoreToGrade(score);

  courses.push({
    name: name,
    unit: unit,
    score: score,
    letter: grade.letter,
    point: grade.point,
  });

  nameInput.value = "";
  unitInput.value = "";
  scoreInput.value = "";
  nameInput.focus();
  render();
}

function removeCourse(index) {
  courses.splice(index, 1);
  render();
}

function render() {
  const ledger = document.getElementById("ledger");

  if (courses.length === 0) {
    ledger.innerHTML =
      '<div class="empty-state" id="emptyState">No courses added yet.</div>';
  } else {
    let rows = "";
    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      const gradePoints = c.unit * c.point;
      rows += `
        <div class="course-row">
          <div class="course-name">${c.name}</div>
          <div class="course-unit">${c.unit}</div>
          <div class="course-score">${c.score}</div>
          <div class="course-grade">${c.letter}</div>
          <div class="course-points">${gradePoints}</div>
          <button class="remove-btn" onclick="removeCourse(${i})" aria-label="Remove ${c.name}">×</button>
        </div>
      `;
    }
    ledger.innerHTML = rows;
  }

  let totalUnits = 0;
  let totalPoints = 0;
  for (let i = 0; i < courses.length; i++) {
    totalUnits += courses[i].unit;
    totalPoints += courses[i].unit * courses[i].point;
  }

  const cgpa = totalUnits === 0 ? 0 : totalPoints / totalUnits;

  document.getElementById("totalUnits").innerText = totalUnits;
  document.getElementById("totalPoints").innerText = totalPoints;
  document.getElementById("stampNumber").innerText = cgpa.toFixed(2);

  const classificationTag = document.getElementById("classificationTag");
  const stamp = document.getElementById("stamp");

  if (totalUnits === 0) {
    classificationTag.innerText = "—";
    classificationTag.style.color = "var(--ink-soft)";
    stamp.style.borderColor = "var(--gold)";
    stamp.style.background = "var(--gold-soft)";
  } else {
    const result = classify(cgpa);
    classificationTag.innerText = result.text;
    classificationTag.style.color = `var(${result.cssVar})`;
    stamp.style.borderColor = `var(${result.cssVar})`;
    stamp.style.background = "var(--gold-soft)";
  }
}

document
  .getElementById("scoreInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") addCourse();
  });
document.getElementById("unitInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") document.getElementById("scoreInput").focus();
});
document.getElementById("nameInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") document.getElementById("unitInput").focus();
});
