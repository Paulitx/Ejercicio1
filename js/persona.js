let paginaActual = 1;
const registrosPorPagina = 5;

function cargarPersonas() {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    let tbody = document.getElementById("personas-list");
    let totalPaginas = Math.ceil(personas.length / registrosPorPagina);

    tbody.innerHTML = "";
    if(personas.length === 0){
        tbody.innerHTML = `<tr>
        <td colspan="9" class="text-white" style="background-color: #d895c6">No hay datos disponibles.</td>
        </tr>`;
    }


    let personaPagina = personas.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);
    personaPagina.forEach((persona, index) => {
        const indiceReal = (paginaActual - 1) * registrosPorPagina + index;
        let fila = `<tr>
                    <td>${persona.id}</td>
                    <td>${persona.nombre}</td>
                    <td>${persona.email}</td>
                    <td>${persona.direccion}</td>
                    <td>${persona.fechaNacimiento}</td>
                    <td>${persona.oficina.nombre}</td>
                    <td>${persona.telefono}</td>
                    <td>${persona.cargo}</td>
                    <td>${persona.estado}</td>
                    <td>
                        <button onclick="editarPersona(${indiceReal})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="confirmarEliminacion(${indiceReal})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
        tbody.innerHTML += fila;
    });
    mostrarPaginacion(totalPaginas);
}

//muestra los controles de la paginacion
function mostrarPaginacion(totalPaginas) {
    let paginacionDiv = document.getElementById("paginacion");
    paginacionDiv.innerHTML = "";

    // Botón "Anterior"
    if (paginaActual > 1) {
        let btnAnterior = document.createElement("button");
        btnAnterior.textContent = "Anterior";
        btnAnterior.classList.add("btn", "btn-secondary");
        btnAnterior.onclick = function() {
            paginaActual--;
            cargarPersonas();
        };
        paginacionDiv.appendChild(btnAnterior);
    }

    //Muestra los numeros de pagina
    for (let i = 1; i <= totalPaginas; i++) {
        let btnPagina = document.createElement("button");
        btnPagina.textContent = i;
        btnPagina.classList.add("btn", "btn-light", "mx-1");
        if (i === paginaActual) {
            btnPagina.disabled = true;
        }
        btnPagina.onclick = function() {
            paginaActual = i;
            cargarPersonas();
        };
        paginacionDiv.appendChild(btnPagina);
    }

    //Programaicon del boton siguinete
    if (paginaActual < totalPaginas) {
        let btnSiguiente = document.createElement("button");
        btnSiguiente.textContent = "Siguiente";
        btnSiguiente.classList.add("btn", "btn-secondary");
        btnSiguiente.onclick = function() {
            paginaActual++;
            cargarPersonas();
        };
        paginacionDiv.appendChild(btnSiguiente);
    }
}

//Alerta que avisa si realmente se quiere eliminar una persona
function confirmarEliminacion(index) {
    if (localStorage.getItem("role") === "visor") {
        alert("No tienes permisos para eliminar.");
        return;  //Si es visor, no hace nada
    }

    const confirmacion = confirm("¿Desea eliminar esta persona?");
    if (confirmacion) {
        eliminarPersona(index);
        alert("Se ha concretado la eliminacion de al persona.");
    }
}
//elimina una persona
function eliminarPersona(index) {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    personas.splice(index, 1);
    localStorage.setItem("personas", JSON.stringify(personas));
    cargarPersonas();
}
//edita una persona enviandola al form de persona
function editarPersona(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "formPersona.html";
}
//guarda las personas
function guardarPersona(event) {

    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    let personasGuardada = JSON.parse(localStorage.getItem("personas")) || [];
    //datos de persona
    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let direccion = document.getElementById("direccion").value;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let telefono = document.getElementById("telefono").value;
    let cargo = document.getElementById("cargo").value;
    let oficinaSeleccionada = document.getElementById("oficina").value;
    let estado = document.getElementById("estado").value;



    //obtener el objeto oficina completo usando el índice seleccionado
    let oficina = oficinas[oficinaSeleccionada];

    if (!id || !nombre || !email || !direccion || !fechaNacimiento || !oficina || !telefono || !cargo || !estado) {
        alert("Todos los campos son obligatorios");
        return;
    }

    //guardar persona luego de validar
    let persona = { id, nombre, email, direccion, fechaNacimiento, oficina, telefono, cargo, estado };
    let personas = JSON.parse(localStorage.getItem("personas")) || [];

    let index = localStorage.getItem("editIndex");
    if (index !== null) {
        personas[index] = persona;
        alert("Se ha editado la persona correctamente");
    } else {
        personas.push(persona);

        alert("Se ha guardado la persona correctamente");
    }
//guarda a la persona y la envia al indexPersona
    localStorage.setItem("personas", JSON.stringify(personas));
    window.location.href = "indexPersona.html";

}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()
//carga la oficina asociada a la persona
function cargarOficinas() {
    const oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    const selectOficina = document.getElementById("oficina");
    selectOficina.innerHTML = '<option value="" selected disabled>Seleccione una oficina</option>';

    oficinas.forEach((oficina, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = oficina.nombre;
        selectOficina.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let oficinas = JSON.parse(localStorage.getItem("oficinas")) || [];
    let selectOficina = document.getElementById("oficina");

    oficinas.forEach((oficina, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = oficina.nombre;
        selectOficina.appendChild(option);
    });
});
//Permite la busqueda mediante el filtrado de los datos de la persona
document.addEventListener("DOMContentLoaded", function () {
    let atributoBusqueda = document.getElementById("atributoBusqueda");
    let inputBusqueda = document.getElementById("busqueda");
    let sugerenciasDiv = document.getElementById("sugerencias");
    let personas = JSON.parse(localStorage.getItem("personas")) || [];

    inputBusqueda.addEventListener("input", function () {
        let valor = inputBusqueda.value.toLowerCase();
        let atributo = atributoBusqueda.value;
        sugerenciasDiv.innerHTML = "";

        if (!atributo || valor.trim() === "") {
            mostrarPersonas(personas);
            return;
        }

        let resultados = personas.filter(persona => {
            if (atributo === "oficina") {
                return persona.oficina && persona.oficina.nombre.toLowerCase().includes(valor);
            } else if (atributo === "estado") {
                return persona.estado && persona.estado.toLowerCase().includes(valor);
            } else if (atributo === "fechaNacimiento") {
                return persona.fechaNacimiento && persona.fechaNacimiento.includes(valor);
            } else if (atributo === "id") {
                return persona.id && persona.id.toString().includes(valor);
            } else {
                return persona[atributo] && persona[atributo].toLowerCase().includes(valor);
            }
        });

        if (resultados.length === 0) {
            sugerenciasDiv.innerHTML = "<div class='list-group-item'>No se encontraron coincidencias</div>";
        } else {
            let valoresUnicos = new Set(resultados.map(persona => {
                return atributo === "oficina" ? persona.oficina.nombre :
                    atributo === "estado" ? persona.estado :
                        atributo === "fechaNacimiento" ? persona.fechaNacimiento :
                            atributo === "id" ? persona.id :
                                persona[atributo];
            }));

            valoresUnicos.forEach(valorUnico => {
                let elemento = document.createElement("a");
                elemento.href = "#";
                elemento.classList.add("list-group-item", "list-group-item-action");
                elemento.textContent = valorUnico;

                elemento.addEventListener("click", function () {
                    inputBusqueda.value = valorUnico;
                    sugerenciasDiv.innerHTML = "";

                    let filtroFinal = personas.filter(persona => {
                        if (atributo === "oficina") return persona.oficina.nombre === valorUnico;
                        if (atributo === "estado") return persona.estado === valorUnico;
                        if (atributo === "fechaNacimiento") return persona.fechaNacimiento === valorUnico;
                        if (atributo === "id") return persona.id.toString() === valorUnico;
                        return persona[atributo] === valorUnico;
                    });

                    mostrarPersonas(filtroFinal);
                });

                sugerenciasDiv.appendChild(elemento);
            });
        }
        mostrarPersonas(resultados);
    });
    //Muestra las personas filtradas
    function mostrarPersonas(listaPersonas) {
        let tbody = document.getElementById("personas-list");
        tbody.innerHTML = "";

        if (listaPersonas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-white" style="background-color: #d895c6">No se encontraron resultados.</td></tr>`;
            return;
        }

        listaPersonas.forEach((persona, index) => {
            let fila = `<tr>
                    <td>${persona.id}</td>
                    <td>${persona.nombre}</td>
                    <td>${persona.email}</td>
                    <td>${persona.direccion}</td>
                    <td>${persona.fechaNacimiento}</td>
                    <td>${persona.oficina.nombre}</td>
                    <td>${persona.telefono}</td>
                    <td>${persona.cargo}</td>
                    <td>${persona.estado}</td>
                    <td>
                        <button onclick="editarPersona(${index})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="confirmarEliminacion(${index})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
            tbody.innerHTML += fila;
        });
    }
});


// Función para mostrar resultados en la tabla
function mostrarResultados(resultados) {
    let tbody = document.getElementById("personas-list");
    tbody.innerHTML = "";

    resultados.forEach((persona, index) => {
        let fila = `<tr>
                    <td>${persona.id}</td>
                    <td>${persona.nombre}</td>
                    <td>${persona.email}</td>
                    <td>${persona.direccion}</td>
                    <td>${persona.fechaNacimiento}</td>
                    <td>${persona.oficina.nombre}</td>
                    <td>${persona.telefono}</td>
                    <td>${persona.cargo}</td>
                    <td>${persona.estado}</td>
                    <td>
                        <button onclick="editarPersona(${index})" class="btn btn-editar"> 
                            <i class="bi bi-pencil-square"></i> Editar</button>
                        <button onclick="confirmarEliminacion(${index})" class="btn btn-eliminar"> 
                            <i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                </tr>`;
        tbody.innerHTML += fila;
    });
}


document.addEventListener("DOMContentLoaded", function() {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    let iconoEstado = document.getElementById("icono-estado");
    if(personas.length === 0){
        iconoEstado.classList.remove("text-success");
        iconoEstado.classList.add("text-danger");

    }else{
        iconoEstado.classList.remove("text-danger");
        iconoEstado.classList.add("text-success");
    }
});
//Esporta a excel los datos de la tabla
function exportarExcel(){
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    if(personas.length === 0){
        alert("No hay personas disponibles para exportar");
        return;
    }


    const data = personas.map(persona => {
        return   {            "id": persona.id,
            "nombre": persona.nombre,
            "email": persona.email,
            "direccion": persona.direccion,
            "fechaNacimiento": persona.fechaNacimiento,
            "oficina": persona.oficina.nombre,
            "telefono": persona.telefono,
            "cargo": persona.cargo,
            "estado": persona.estado
        }

    });


    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "personas");

    XLSX.writeFile(wb, "personas.xlsx");
}
//Exporta a PDF los datos de la tabla
function exportarPDF(){
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    if(personas.length === 0){
        alert("No hay datos disponibles para exportar");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Lista de personas", 14, 10);

    const headers = [["ID", "Nombre", "Email", "Dirección", "Fecha Nacimiento", "Oficina", "Teléfono", "Cargo", "Estado"]];

    const data = personas.map(persona => [
        persona.id,
        persona.nombre,
        persona.email,
        persona.direccion,
        persona.fechaNacimiento,
        persona.oficina.nombre,
        persona.telefono,
        persona.cargo,
        persona.estado
    ]);
    doc.autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: 'striped',
        styles: {
            fontSize: 10
        },
        columnStyles: {
            0: { cellWidth: 10 }, //id
            1: { cellWidth: 20 }, //nombre
            2: { cellWidth: 40 }, //email
            3: { cellWidth: 20 }, //dirección
            4: { cellWidth: 25 }, //fecha nacimiento
            5: { cellWidth: 20 }, //oficina
            6: { cellWidth: 20 }, //telefono
            7: { cellWidth: 20 }, //cargo
            8: { cellWidth: 15 }  //estado
        },
        margin: { top: 20 }
    });
    doc.save("personas.pdf");
}