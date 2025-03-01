async function loadMachines() {
    try {
        const response = await fetch("/json/machines.json");
        const machines = await response.json();

        let table = document.getElementById("machinesTable").getElementsByTagName("tbody")[0];
        table.innerHTML = ""; // Limpia la tabla antes de cargar

        machines.forEach(machine => {
            let newRow = table.insertRow();

            // Definir colores de dificultad
            let difficultyColor = "";
            if (machine.difficulty.toLowerCase() === "easy") difficultyColor = "green";
            if (machine.difficulty.toLowerCase() === "medium") difficultyColor = "orange";
            if (machine.difficulty.toLowerCase() === "hard") difficultyColor = "red";

            newRow.innerHTML = `
                <td>${machine.name}</td>
                <td><span class="difficulty" style="color:${difficultyColor}">${machine.difficulty}</span></td>
                <td>${machine.os}</td>
                <td><a href="${machine.link}" target="_blank" class="doc-link">
                    <i class='bx bx-file'></i>
                </a></td>
            `;
        });
    } catch (error) {
        console.error("Error loading machines:", error);
    }
}

// Cargar las máquinas cuando se abra la página
window.onload = loadMachines;

