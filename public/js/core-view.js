class AutoDetalle {
    constructor(autos) {
        this.autos = autos;
        this.tituloPrincipalElem = document.getElementById("titulo");
        this.subtituloBreadcrumbElem = document.getElementById("subtitulo");
        this.imagenPrincipalElem = document.getElementById("main-image");
        this.descripcionElem = document.getElementById("descripcion");
        this.pasajerosElem = document.getElementById("pasajeros");
        this.equipajeElem = document.getElementById("equipaje");
        this.billeteElem = document.getElementById("billete");
        this.dynamicTitleElem = document.getElementById("dynamic-title"); 
        this.autoId = this.obtenerIdDeUrl();
        this.loadingElem = document.getElementById("loading-spinner"); 
        this.errorContainerElem = document.getElementById("error-message"); 

        this.init();
    }

    obtenerIdDeUrl() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get("car")); 
    }

    formatearPrecio(valor) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(valor);
    }

    mostrarCargando(mostrar = true) {
        if (this.loadingElem) {
            this.loadingElem.style.display = mostrar ? "block" : "none";
        }
        const mainContent = document.querySelector(".lg\\:col-span-2");
        if (mainContent) {
            mainContent.style.display = mostrar ? "none" : "block";
        }
    }

    mostrarError(mensaje) {
        this.mostrarCargando(false);
        if (this.errorContainerElem) {
            this.errorContainerElem.textContent = mensaje;
            this.errorContainerElem.style.display = "block";
        } else {
            console.error("Error al cargar el vehículo:", mensaje);
            if (this.tituloPrincipalElem) this.tituloPrincipalElem.textContent = "Error al cargar el vehículo";
            if (this.subtituloBreadcrumbElem) this.subtituloBreadcrumbElem.textContent = "Error";
            if (this.descripcionElem) this.descripcionElem.textContent = mensaje;
        }
    }

    async obtenerDatosAuto(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const auto = this.autos[id];
                if (auto) {
                    resolve(auto);
                } else {
                    reject(`No se encontró el auto con ID: ${id}`);
                }
            }, 500); 
        });
    }

    actualizarInterfaz(auto) {
        if (!auto) {
            this.mostrarError("Auto no encontrado.");
            return;
        }

        if (this.dynamicTitleElem) {
            this.dynamicTitleElem.textContent = `${auto.nombre} | Detalles del Auto`;
        }
        if (this.tituloPrincipalElem) this.tituloPrincipalElem.textContent = auto.nombre;
        if (this.subtituloBreadcrumbElem) this.subtituloBreadcrumbElem.textContent = auto.subtitulo ?? auto.nombre;
        if (this.imagenPrincipalElem) {
            this.imagenPrincipalElem.src = auto.imagen;
            this.imagenPrincipalElem.alt = auto.nombre;
        }
        if (this.descripcionElem) this.descripcionElem.textContent = auto.descripcion;
        if (this.pasajerosElem) this.pasajerosElem.textContent = auto.pasajeros ?? "No especificado";
        if (this.equipajeElem) this.equipajeElem.textContent = auto.equipaje ? `${auto.equipaje} maletas` : "No especificado";
        if (this.billeteElem) this.billeteElem.textContent = this.formatearPrecio(auto.billete);
    }

    async cargarDetalleAuto() {
        this.mostrarCargando();
        try {
            const autoData = await this.obtenerDatosAuto(this.autoId);
            this.actualizarInterfaz(autoData);
            this.mostrarCargando(false);
        } catch (error) {
            this.mostrarError(error);
        }
    }

    verificarElementosDom() {
        return (
            this.tituloPrincipalElem &&
            this.subtituloBreadcrumbElem &&
            this.imagenPrincipalElem &&
            this.descripcionElem &&
            this.pasajerosElem &&
            this.equipajeElem &&
            this.billeteElem &&
            this.dynamicTitleElem 
        );
    }

    init() {
        if (this.verificarElementosDom()) {
            this.cargarDetalleAuto();
        } else {
            console.warn("Faltan elementos importantes en el DOM para mostrar el vehículo.");
            this.mostrarError("La página no se cargó correctamente. Faltan elementos.");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const autosData = {
        1: {
            nombre: "NISSAN VERS",
            subtitulo: "NISSAN VERS",
            imagen: "./img/azune-3.png",
            descripcion: "Auto compacto y eficiente con tecnología avanzada y comodidad superior.",
            pasajeros: "5 pasajeros",
            equipaje: 2,
            billete: 500
        },
        2: {
            nombre: "Van",
            subtitulo: "Confort para grupos",
            imagen: "./img/van.png",
            descripcion: "Espaciosa van ideal para familias o grupos grandes, con asientos cómodos y amplio espacio de carga.",
            pasajeros: "7 pasajeros",
            equipaje: 5,
            billete: 750
        },
        3: {
            nombre: "Transportación de Lujo",
            subtitulo: "Experiencia Premium",
            imagen: "./img/car3.png",
            descripcion: "Vehículo de alta gama ideal para traslados premium con asientos de cuero, aire acondicionado individual y atención personalizada.",
            pasajeros: "3 pasajeros",
            equipaje: 2,
            billete: 900
        },
        4: {
            nombre: "Grupos pequeños",
            subtitulo: "Ideal para familias",
            imagen: "./img/image2-.png",
            descripcion: "Perfecto para familias o grupos reducidos que desean viajar con estilo y confort, con espacio para equipaje.",
            pasajeros: "6 pasajeros",
            equipaje: 4,
            billete: 600
        },
        5: {
            nombre: "Limosina de lujo",
            subtitulo: "Eventos Especiales",
            imagen: "./img/image.png",
            descripcion: "Limosina elegante para eventos especiales, con asientos de cuero, barra interior y ambiente sofisticado.",
            pasajeros: "8 pasajeros",
            equipaje: 6,
            billete: 1500
        },
    };

    new AutoDetalle(autosData);
});