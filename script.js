const API = "http://localhost:5000/api";

// ---------------- LOGIN ----------------
function login() {
  const user = username.value;
  const pass = password.value;

  if (user === "admin" && pass === "admin123") {
    location.href = "admin.html";
  } else if (user === "patient" && pass === "patient123") {
    location.href = "patient.html";
  } else {
    alert("Invalid login");
  }
}

// ---------------- ADMIN UI ----------------
function showSection(id) {
  document.querySelectorAll("#adminSections .section")
    .forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// ---------------- DOCTORS ----------------
async function addDoctor() {
  const name = docName.value.trim();
  const specialization = docSpec.value.trim();
  const experience = docExp.value;

  if (!name) return alert("Enter doctor name");

  await fetch(`${API}/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, specialization, experience })
  });

  alert("Doctor added");
  docName.value = docSpec.value = docExp.value = "";
  populateDoctors();
}

async function populateDoctors() {
  const res = await fetch(`${API}/doctors`);
  const doctors = await res.json();

  const select = document.getElementById("doctorSelect");
  if (!select) return;

  select.innerHTML = "";
  doctors.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.name;
    opt.textContent = d.name;
    select.appendChild(opt);
  });
}

// ---------------- PATIENTS ----------------
async function addPatient() {
  const name = patName.value.trim();
  const age = patAge.value;
  const disease = patDisease.value.trim();

  if (!name) return alert("Enter patient name");

  await fetch(`${API}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, disease })
  });

  alert("Patient added");
  patName.value = patAge.value = patDisease.value = "";
}

// ---------------- MEDICINES ----------------
async function addMedicine() {
  const name = medName.value.trim();
  const status = medStatus.value;

  if (!name) return alert("Enter medicine name");

  await fetch(`${API}/medicines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, status })
  });

  alert("Medicine added");
  medName.value = "";
}

// ---------------- APPOINTMENTS ----------------
async function bookAppointment() {
  const name = patientNameApp.value;
  const date = appointmentDate.value;
  const time = appointmentTime.value;
  const doctor = doctorSelect.value;

  if (!name || !date || !time || !doctor)
    return alert("Fill all fields");

  const res = await fetch(`${API}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, date, time, doctor })
  });

  const data = await res.json();
  alert("Appointment booked! Token: " + data.token);
  showAppointments();
}

async function showAppointments() {
  const res = await fetch(`${API}/appointments`);
  const apps = await res.json();

  const box = document.getElementById("appointments");
  if (!box) return;

  box.innerText = "";
  apps.forEach(a => {
    box.innerText +=
      `Name: ${a.name}, Dr: ${a.doctor}, ${a.date} ${a.time}, Token: ${a.token}\n`;
  });
}

// ---------------- ABSENT PATIENTS ----------------
async function loadAppointmentsForAbsent() {
  const res = await fetch(`${API}/appointments`);
  const apps = await res.json();

  const div = document.getElementById("appointmentList");
  if (!div) return;

  div.innerHTML = "";
  apps.forEach(a => {
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.value = a._id;

    const lbl = document.createElement("label");
    lbl.textContent =
      `${a.name} | Dr.${a.doctor} | ${a.date} ${a.time} | Token ${a.token}`;

    div.appendChild(chk);
    div.appendChild(lbl);
    div.appendChild(document.createElement("br"));
  });
}

async function saveAbsent() {
  const checks = document.querySelectorAll("#appointmentList input:checked");
  for (let c of checks) {
    await fetch(`${API}/absent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: c.value })
    });
  }
  showAbsentList();
}

async function showAbsentList() {
  const res = await fetch(`${API}/absent`);
  const abs = await res.json();

  const box = document.getElementById("absentList");
  if (!box) return;

  box.innerText = "";
  abs.forEach(a => {
    box.innerText +=
      `Name: ${a.name}, Dr:${a.doctor}, ${a.date} ${a.time}, Token:${a.token}\n`;
  });
}

// ---------------- VIEW ALL RECORDS ----------------
async function showRecords() {
  showSection("viewDetails");

  const [d, p, m, a, ab] = await Promise.all([
    fetch(`${API}/doctors`).then(r => r.json()),
    fetch(`${API}/patients`).then(r => r.json()),
    fetch(`${API}/medicines`).then(r => r.json()),
    fetch(`${API}/appointments`).then(r => r.json()),
    fetch(`${API}/absent`).then(r => r.json())
  ]);

  doctorRecords.innerText = d.map((x,i)=>
    `${i+1}. ${x.name} | ${x.specialization||"-"} | ${x.experience||"-"} yrs`
  ).join("\n");

  patientRecords.innerText = p.map((x,i)=>
    `${i+1}. ${x.name} | Age:${x.age||"-"} | ${x.disease||"-"}`
  ).join("\n");

  medicineRecords.innerText = m.map((x,i)=>
    `${i+1}. ${x.name} - ${x.status}`
  ).join("\n");

  appointmentRecords.innerText = a.map((x,i)=>
    `${i+1}. ${x.name} | Dr:${x.doctor} | ${x.date} ${x.time} | Token:${x.token}`
  ).join("\n");

  absentRecords.innerText = ab.map((x,i)=>
    `${i+1}. ${x.name} | Dr:${x.doctor} | ${x.date} ${x.time} | Token:${x.token}`
  ).join("\n");

  currentSlide = 0;
  updateSlider();
}

// ---------------- SLIDER ----------------
let currentSlide = 0;
function updateSlider() {
  recordsSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled =
    currentSlide === document.querySelectorAll(".slide").length - 1;
}
function nextSlide() {
  if (currentSlide < document.querySelectorAll(".slide").length - 1) {
    currentSlide++;
    updateSlider();
  }
}
function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlider();
  }
}

// ---------------- INIT ----------------
window.onload = () => {
  populateDoctors();
  showAppointments();
  loadAppointmentsForAbsent();
};

// ── PATCHED updateSlider (tab bar + counter support) ──
const _origUpdate = updateSlider;
updateSlider = function() {
  const slider = document.getElementById('recordsSlider');
  const slides = document.querySelectorAll('.slide');
  const prev   = document.getElementById('prevBtn');
  const next   = document.getElementById('nextBtn');
  const counter= document.getElementById('slideCounter');
  const tabs   = document.querySelectorAll('.slide-tab');

  if (slider)  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
  if (prev)    prev.disabled  = currentSlide === 0;
  if (next)    next.disabled  = currentSlide === slides.length - 1;
  if (counter) counter.textContent = `${currentSlide + 1} / ${slides.length}`;
  tabs.forEach((t,i) => t.classList.toggle('active', i === currentSlide));
};
