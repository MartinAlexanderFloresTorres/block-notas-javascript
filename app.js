//=============== variables ===============
const agregar = document.querySelector("#agregar");
const overlay = document.querySelector("#overlay");
const overlay_2 = document.querySelector("#overlay-2");
const formulario = document.querySelector("#formulario");
const lista = document.querySelector("#lista");
const encabezado = document.querySelector("#form-title");
const tituloInput = document.querySelector("#titulo");
const descripcionInput = document.querySelector("#descripcion");
const btn_agregar = document.querySelector("#btn_agregar");
const btn_eliminar = document.querySelector(".overlay__eliminar");
const body = document.querySelector("body");

const presentacion = {
    titulo: "Comienza agregando notas",
    descripcion:
        "Click en agregar nueva nota y comience agregandolos. En la parte inferior tiene opciones de editar y eliminar sus notas. espero lo disfrute.",
    id: generarId(),
    fecha: generarFecha(new Date()),
};
let notas = [];
let idEdicion;
let edicion = false;

cargarEventos();
//=============== funciones ===============
function cargarEventos() {
    notas = JSON.parse(localStorage.getItem("notas-v1")) || [presentacion];
    imprimirHtml();

    // validar el formulario
    formulario.addEventListener("submit", validarFormulario);
    //=============== eventos ===============
    // abrir el overlay del formulario
    agregar.addEventListener("click", () => {
        overlay.classList.add("active");
        overlay.classList.remove("cerrar");
        body.style.overflow = "hidden";
        formulario.reset();
        btn_agregar.textContent = "Agregar nota";
        encabezado.textContent = "Agregar nueva nota";
    });
    // cerrar el overlay del formulario
    overlay.addEventListener("click", (e) => {
        if (e.target.classList.contains("close")) {
            body.style.overflow = "auto";
            cerrarOverlay(overlay);
        }
        if (e.target.classList.contains("overlay")) {
            body.style.overflow = "auto";
            cerrarOverlay(overlay);
        }
    });
    // cerrar el overlay de confirmacion
    overlay_2.addEventListener("click", (e) => {
        if (e.target.classList.contains("overlay__cancelar")) {
            cerrarOverlay(overlay_2);
        }
        if (e.target.classList.contains("overlay__eliminar")) {
            cerrarOverlay(overlay_2);
            const id = parseInt(e.target.getAttribute("data-id"));
            const notasActualizadas = notas.filter((nota) => nota.id !== id);
            notas = notasActualizadas;
            imprimirHtml();
        }
        if (e.target.classList.contains("overlay-2")) {
            cerrarOverlay(overlay_2);
        }
    });

    // eventos de eliminar y ediar
    lista.addEventListener("click", (e) => {
        // editar
        if (e.target.classList.contains("editar")) {
            body.style.overflow = "hidden";
            const id = parseInt(e.target.getAttribute("data-id"));
            editarNota(id);
        }
        // eliminar
        if (e.target.classList.contains("eliminar")) {
            body.style.overflow = "hidden";
            const id = parseInt(e.target.getAttribute("data-id"));
            btn_eliminar.setAttribute("data-id", id);
            overlay_2.classList.add("active");
            overlay_2.classList.remove("cerrar");
        }
    });
}
// cerrar overlay
function cerrarOverlay(elemento) {
    body.style.overflow = "auto";
    elemento.classList.add("cerrar");
    setTimeout(() => {
        elemento.classList.remove("active");
    }, 200);
}
// generar id
function generarId() {
    return Date.now();
}
// generar y formatear fecha new Date()
function generarFecha(fecha) {
    const fechaNueva = new Date(fecha);
    const opciones = {
        year: "numeric",
        month: "long",
        day: "2-digit",
    };
    return fechaNueva.toLocaleDateString("es-ES", opciones);
}
// validar el formulario
function validarFormulario(e) {
    e.preventDefault();
    const titulo = document.querySelector("#titulo").value;
    const descripcion = document.querySelector("#descripcion").value;

    //=============== validar el formulario ===============
    if ([titulo, descripcion].includes("")) {
        formulario.classList.add("error");
        setTimeout(() => {
            formulario.classList.remove("error");
        }, 2000);
    } else {
        const nota = { titulo, descripcion, fecha: generarFecha(new Date()) };
        if (edicion) {
            //=============== actualizar nota ===============
            const notaActualizada = notas.map((item) => {
                if (item.id === idEdicion) {
                    nota.id = idEdicion;
                    return nota;
                }
                return item;
            });
            notas = [...notaActualizada];
            edicion = false;
        } else {
            //=============== agregar una nueva nota ===============
            nota.id = generarId();
            notas = [...notas, nota];
        }
        imprimirHtml();
        cerrarOverlay(overlay);
    }
}
// mostrar html
function imprimirHtml() {
    limpiarHtml();
    notas.forEach((nota) => {
        const { id, titulo, descripcion, fecha } = nota;
        const div = document.createElement("DIV");
        div.classList.add("nota");
        div.innerHTML = `
            <div class="nota__informacion">
                <h2 class="nota__titulo">${titulo}</h2>
                <div class="nota__descripcion">
                    ${descripcion}
                </div>
            </div>
            <div class="nota__info">
                <p class="note__fecha">${fecha}</p>
                <div class="nota__opciones">
                    <i class='bx bx-dots-horizontal-rounded icono'></i>
                    <div class="nota__animacion">
                        <div class="nota__botones">
                            <button class="nota__boton editar" data-id="${id}"><i class='bx bx-pencil'></i>Editar</button>
                            <button class="nota__boton eliminar" data-id="${id}"><i class='bx bx-trash-alt'></i>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        lista.appendChild(div);
    });
    localStorage.setItem("notas-v1", JSON.stringify(notas));
}
// limpiar html
function limpiarHtml() {
    document.querySelectorAll(".nota").forEach((elemento) => elemento.remove());
}
// editar nota
function editarNota(id) {
    const notaEditar = notas.filter((nota) => nota.id == id && nota);

    const { titulo, descripcion } = notaEditar[0];
    encabezado.textContent = "Edita tu nota";
    tituloInput.value = titulo;
    descripcionInput.value = descripcion;
    btn_agregar.textContent = "Guardar Nota";

    overlay.classList.add("active");
    overlay.classList.remove("cerrar");
    idEdicion = id;
    edicion = true;
}
