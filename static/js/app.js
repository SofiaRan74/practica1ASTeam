function activeMenuOption(href) {
$(".app-menu .nav-link")
    .removeClass("active")
    .removeAttr('aria-current')

$(`[href="${(href ? href : "#/")}"]`)
    .addClass("active")
    .attr("aria-current", "page")
}

const app = angular.module("angularjsApp", ["ngRoute"])
app.config(function ($routeProvider, $locationProvider) {
$locationProvider.hashPrefix("")

$routeProvider
    .when("/", {
        templateUrl: "/app",
        controller: "appCtrl"
    })
    .when("/apoyos", {
        templateUrl: "/apoyos",
        controller: "apoyosCtrl"
    })
    .otherwise({
        redirectTo: "/"
    })
})
app.run(["$rootScope", "$location", "$timeout", function($rootScope, $location, $timeout) {
function actualizarFechaHora() {
    lxFechaHora = DateTime
        .now()
        .setLocale("es")

    $rootScope.angularjsHora = lxFechaHora.toFormat("hh:mm:ss a")
    $timeout(actualizarFechaHora, 1000)
}

$rootScope.slide = ""

actualizarFechaHora()

$rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
    $("html").css("overflow-x", "hidden")

    const path = current.$$route.originalPath

    if (path.indexOf("splash") == -1) {
        const active = $(".app-menu .nav-link.active").parent().index()
        const click  = $(`[href^="#${path}"]`).parent().index()

        if (active != click) {
            $rootScope.slide  = "animate__animated animate__faster animate__slideIn"
            $rootScope.slide += ((active > click) ? "Left" : "Right")
        }

        $timeout(function () {
            $("html").css("overflow-x", "auto")

            $rootScope.slide = ""
        }, 1000)

        activeMenuOption(`#${path}`)
    }
})
}])

// --- funciones auxiliares para llenar selects ---
function cargarMascotas() {
$.get("/mascotas", function (data) {
    const $select = $("#mascota")
    $select.empty()
    $select.append('<option value="">Selecciona una mascota</option>')
    data.forEach(m => {
        $select.append(`<option value="${m.idMascota}">${m.nombre}</option>`)
    })
})
}

function cargarPadrinos() {
$.get("/padrinos", function (data) {
    const $select = $("#padrino")
    $select.empty()
    $select.append('<option value="">Selecciona un padrino</option>')
    data.forEach(p => {
        $select.append(`<option value="${p.idPadrino}">${p.nombrePadrino}</option>`)
    })
})
}

app.controller("appCtrl", function ($scope, $http) {
})

app.controller("apoyosCtrl", function ($scope, $http) {
function buscarApoyos(texto = "") {
        if (texto.trim() === "") {
            $.get("/tbodyApoyo", function (trsHTML) {
                $("#tbodyApoyo").html(trsHTML)
            })
        } else {
            $.get("/apoyos/buscar", { busqueda: texto }, function (data) {
                // data = JSON con los objetos
                let html = ""
                data.forEach(item => {
                    html += `
                        <tr>
                            <td>${item.idMascota}</td>
                            <td>${item.idPadrino}</td>
                            <td>${item.monto}</td>
                            <td>${item.causa}</td>
                            <td>
                                <button class="btn btn-danger btn-sm btn-eliminar" data-id="${item.idApoyo}">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `
                })
                $("#tbodyApoyo").html(html)
            })
        }
    }
// cargar datos iniciales
buscarApoyos()
cargarMascotas()
cargarPadrinos()

$(document).on("click", "#btnBuscar", function () {
    const texto = $("#Contbuscar").val()
    buscarApoyos(texto)
})

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('505a9219e50795c4885e', {
    cluster: 'us2'
});

var channel = pusher.subscribe('for-nature-533');
channel.bind('eventoApoyos', function(data) {
    buscarApoyos()
})

// guardar apoyo
$(document).on("submit", "#frmApoyo", function (event) {
    event.preventDefault()

    $.post("/apoyo", {
        idApoyo:   $("#idApoyo").val(),
        mascota:   $("#mascota").val(),
        padrino:   $("#padrino").val(),
        monto:     $("#monto").val(),
        causa:     $("#causa").val(),
    }, function () {
        buscarApoyos()
        $("#frmApoyo")[0].reset()
    }).fail(function(xhr) {
        alert("Error al guardar: " + xhr.responseText)
    })
})

// eliminar apoyo
$(document).off("click", ".btn-eliminar").on("click", ".btn-eliminar", function () {
    const idApoyo = $(this).data("id")

    if (!confirm("¿Seguro que deseas eliminar este apoyo?")) {
        return
    }

    $.post("/apoyo/eliminar", { idApoyo: idApoyo }, function () {
        buscarApoyos()
    }).fail(function(xhr) {
        alert("Error al eliminar: " + xhr.responseText)
    })
})
})

const DateTime = luxon.DateTime
let lxFechaHora

document.addEventListener("DOMContentLoaded", function (event) {
const configFechaHora = {
    locale: "es",
    weekNumbers: true,
    minuteIncrement: 15,
    altInput: true,
    altFormat: "d/F/Y",
    dateFormat: "Y-m-d",
}

activeMenuOption(location.hash)
})







