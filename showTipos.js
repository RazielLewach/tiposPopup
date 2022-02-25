document.getElementsByTagName("head")[0].insertAdjacentHTML(
    "beforeend",
    "<link rel=\"stylesheet\" href=\"https://raw.githubusercontent.com/RazielLewach/tiposPopup/main/showTipos.css\" />");

var canClick = false; // Gestionador de doble click.
var isControl = false; // ¿Tienes control pulsado?
var xPopupTipos = 0; // La coordenada x del modal de tipos.
var yPopupTipos = 0; // La coordenada y del modal de tipos.
var widthPopupTipos = 450; // El width del modal de tipos.
var heightPopupTipos = 200; // El height del modal de tipos.
var dirAng = 0; // Dirección cíclica.
var stepTimeout = null; // El timeout de step.
var iPokemonElegido = 1; // Qué Pokémon ha elegido el enemigo, su id.
var urlPokemonElegido = 0; // Qué Pokémon ha elegido el enemigo, su url.
var iStageUsuario = 0; // El stage del usuario.
var iStageEnemigo = 0; // El stage del enemigo.
var isOpen = false; // ¿Está abierto?
var canReposition = true; // ¿Puede reposicionar?
var cntChainload = 0; // Eslabón de la cadena de load inicial.
var genEnemigo = 0; // La generación seleccionada.
var scale = 0; // Escalado del todo.
var showCargando = false; // ¿Muestra cargando?

// Evento del doble click.
window.addEventListener("click", event =>
{
	// Doble click: abre el popup.
	if (canClick && isControl && (!isOpen || (event.clientX < xPopupTipos || event.clientY < yPopupTipos || event.clientX > xPopupTipos+widthPopupTipos || event.clientY > yPopupTipos+heightPopupTipos)))
  	{
		var _firstUpdated = false;
		genEnemigo = "1";
		$(".popupTipos").css("opacity", 0);
		showCargando = true;
		
		if (!isOpen)
		{
			// Asigna qué Pokémon has clicado.
			urlPokemonElegido = "https://www.pkparaiso.com/imagenes/xy/sprites/animados/bulbasaur.gif";
			iPokemonElegido = 1;
			isOpen = true;
			_firstUpdated = true;
		}
		
		var _ele = document.elementFromPoint(event.clientX,event.clientY);
		if (_ele != null && _ele.nodeName == "IMG")
		{
			urlPokemonElegido = _ele.src;
			var _ret = getIndexUrlTipos(null,_ele.src);
			genEnemigo = _ret[0];
			iPokemonElegido = _ret[1];
			iStageEnemigo = _ret[2];
		}
		
		// Genera el popup.
        if (document.getElementById("popupTipos") == null)
		{
			document.getElementById("fa_toolbar").insertAdjacentHTML("afterbegin",'
				<img class="cargando" src="https://i.imgur.com/vDmkSTk.png"/>
				<div id="popupTipos" class="popupTipos" style="opacity: 0;">
					<table class="fondoTipos">
						<tr>
							<td class="showDanyosUsuario" colspan="2">
								<p id="debilidadesEnemigo" class="showStageEnemigo"></p>
							</td>
						</tr>
						<tr>
							<td class="cellElemento">
								// Los dos dropdowns de tipos del enemigo.
								<table>
									<tr>
										<td>
											<select name="dropdownGeneracionEnemigo" id="dropdownGeneracionEnemigo" class="dropdown tipoNull">
											</select>
										</td>
										<td>
											<select name="dropdownPokemonEnemigo" id="dropdownPokemonEnemigo" class="dropdown tipoNull">
											</select>
										</td>
									</tr>
									<tr>
										<td>
											<select name="dropdownTipoEnemigoPrimario" id="dropdownTipoEnemigoPrimario" class="dropdown tipoNull">
											</select>
										</td>
										<td>
											<select name="dropdownTipoEnemigoSecundario" id="dropdownTipoEnemigoSecundario" class="dropdown tipoNull">
											</select>
										</td>
									</tr>
									<tr>
										<td colspan="2">
											// El daño que causa el enemigo.
											<p id="showDanyosEnemigo" class="showDanyosEnemigo">Provoca +0 daño</p>
										</td>
									</tr>
									<tr>
										<td colspan="2">
											// El stage del enemigo.
											<p id="showStageEnemigo" class="showStageEnemigo"></p>
										</td>
									</tr>
								</table>
							</td>
							<td>
								<div class="cellElemento cellPokemon" id="imgPokemonEnemigo">
									<img src="https://i.imgur.com/WJCoKI0.png" class="flechaEnemigo"/>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="cellElemento cellPokemon" id="imgPokemonUsuario">
									<img src="https://i.imgur.com/HWSx7Ar.png" class="flechaUsuario"/>
									<p title="Missingno gif by: Shallow Lagoon" style="text-align: left;">?</p>
								</div>
							</td>
							<td class="cellElemento">
								// Los dos dropdowns de tipos del usuario.
								<table>
									<tr>
										<td>
											<select name="dropdownGeneracionUsuario" id="dropdownGeneracionUsuario" class="dropdown tipoNull">
											</select>
										</td>
										<td>
											<select name="dropdownPokemonUsuario" id="dropdownPokemonUsuario" class="dropdown tipoNull">
											</select>
										</td>
									</tr>
									<tr>
										<td>
											<select name="dropdownTipoUsuarioPrimario" id="dropdownTipoUsuarioPrimario" class="dropdown tipoNull">
											</select>
										</td>
										<td>
											<select name="dropdownTipoUsuarioSecundario" id="dropdownTipoUsuarioSecundario" class="dropdown tipoNull">
											</select>
										</td>
									</tr>
									<tr>
										<td colspan="2">
											// El daño que causa el usuario.
											<p id="showDanyosUsuario" class="showDanyosUsuario">Provoca +0 daño</p>
										</td>
									</tr>
									<tr>
										<td colspan="2">
											// El stage del usuario.
											<p id="showStageUsuario" class="showStageUsuario"></p>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>
			');
			
			// Informa los dropdowns.
			$("#dropdownGeneracionUsuario").load("https://pruebastomatosas.foroactivo.com/h3-dropdowngeneracion",setChainLoad);
		}
		
		// Abre el popup.
		if (canReposition)
		{
			xPopupTipos = event.clientX-widthPopupTipos*0.25;
			yPopupTipos = event.clientY-heightPopupTipos/2;
			$(".popupTipos").css({left: xPopupTipos});
			$(".popupTipos").css({top: yPopupTipos});
			$(".cargando").css({left: event.clientX-50});
			$(".cargando").css({top: event.clientY-50});
			clearTimeout(stepTimeout);
			stepTimeout = setTimeout(stepTipos,16);
		}
		
		// Selecciona el Pokémon elegido para el rival.
		if (_firstUpdated)
		{
			document.getElementById("dropdownGeneracionEnemigo").value = genEnemigo;
			if (cntChainload == 8) setDropdownPokemonSegunGeneracion("dropdownPokemonEnemigo",genEnemigo,afterStartingUpdate);
		}
	
		setListeners();
	}
	else canClick = true;
	setTimeout(resetClick,300);
	
	// Click fuera del popup pa cerrarlo.
	if (event.clientX != 0 && event.clientY != 0)
		if (event.clientX < xPopupTipos || event.clientY < yPopupTipos || event.clientX > xPopupTipos+widthPopupTipos || event.clientY > yPopupTipos+heightPopupTipos)
		{
			isOpen = false;
		}
});

// Inicia la cadena inicial de loads de dropdowns. Para gestionar que el poke clicado se cargue bien al acabarlas.
function setChainLoad()
{
	cntChainload++;
	if (cntChainload == 1)		 $("#dropdownPokemonUsuario").load("https://pruebastomatosas.foroactivo.com/h1-dropdownpokemon1",setChainLoad);
	else if (cntChainload == 2)  $("#dropdownTipoUsuarioPrimario").load("https://pruebastomatosas.foroactivo.com/h2-dropdowntipos",setChainLoad);
	else if (cntChainload == 3)  $("#dropdownTipoUsuarioSecundario").load("https://pruebastomatosas.foroactivo.com/h2-dropdowntipos",setChainLoad);
	else if (cntChainload == 4)  $("#dropdownGeneracionEnemigo").load("https://pruebastomatosas.foroactivo.com/h3-dropdowngeneracion",setChainLoad);
	else if (cntChainload == 5)  $("#dropdownPokemonEnemigo").load("https://pruebastomatosas.foroactivo.com/h1-dropdownpokemon1",setChainLoad);
	else if (cntChainload == 6)  $("#dropdownTipoEnemigoPrimario").load("https://pruebastomatosas.foroactivo.com/h2-dropdowntipos",setChainLoad);
	else if (cntChainload == 7)  $("#dropdownTipoEnemigoSecundario").load("https://pruebastomatosas.foroactivo.com/h2-dropdowntipos",setChainLoad);
	else if (cntChainload == 8)  setDropdownPokemonSegunGeneracion("dropdownPokemonEnemigo",genEnemigo,afterStartingUpdate);
}

// Listeners para escuchar a los dropdowns.
function setListeners()
{
	// Dropdown de la generación del usuario.
	document.getElementById("dropdownGeneracionUsuario").addEventListener('change', (event) =>
	{
		setDropdownPokemonSegunGeneracion("dropdownPokemonUsuario",event.target.value,updateAllInfo);
		iStageUsuario = 0 + 2*(event.target.value == 5);
	});
	// Dropdown del Pokémon usuario.
	document.getElementById("dropdownPokemonUsuario").addEventListener('change', (event) =>
	{
		var _ret = getIndexUrlTipos(event.target.value,null);
		if (_ret != null)
		{
			$("#imgPokemonUsuario").css("background-image","url("+String(_ret[1])+")");
			iStageUsuario = _ret[2];
		}
		else
		{
			$("#imgPokemonUsuario").css("background-image","url(https://i.imgur.com/GTDLNAF.gif)");
			iStageUsuario = -1;
		}
		
		updateAllInfo();
		
	});
	// Dropdown del tipo primario del Pokémon usuario.
	document.getElementById("dropdownTipoUsuarioPrimario").addEventListener('change', (event) =>
	{
		changeTipoUsuario();
	});
	// Dropdown del tipo secundario del Pokémon usuario.
	document.getElementById("dropdownTipoUsuarioSecundario").addEventListener('change', (event) =>
	{
		changeTipoUsuario();
	});
	// Dropdown de la generación del enemigo.
	document.getElementById("dropdownGeneracionEnemigo").addEventListener('change', (event) =>
	{
		setDropdownPokemonSegunGeneracion("dropdownPokemonEnemigo",event.target.value,updateAllInfo);
		iStageEnemigo = 0 + 2*(event.target.value == 5);
	});
	// Dropdown del Pokémon enemigo.
	document.getElementById("dropdownPokemonEnemigo").addEventListener('change', (event) =>
	{
		var _ret = getIndexUrlTipos(event.target.value,null);
		if (_ret != null)
		{
			$("#imgPokemonEnemigo").css("background-image","url("+String(_ret[1])+")");
			iStageEnemigo = _ret[2];
		}
		else
		{
			$("#imgPokemonEnemigo").css("background-image","url(https://i.imgur.com/GTDLNAF.gif)");
			iStageEnemigo = -1;
		}
		
		updateAllInfo();
	});
	// Dropdown del tipo primario del Pokémon enemigo.
	document.getElementById("dropdownTipoEnemigoPrimario").addEventListener('change', (event) =>
	{
		changeTipoEnemigo();
	});
	// Dropdown del tipo secundario del Pokémon enemigo.
	document.getElementById("dropdownTipoEnemigoSecundario").addEventListener('change', (event) =>
	{
		changeTipoEnemigo();
	});
	
	// Al abrir dropdowns evita que se buguee.
	document.getElementById("dropdownGeneracionUsuario").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
	document.getElementById("dropdownPokemonUsuario").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
	document.getElementById("dropdownTipoUsuarioPrimario").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
	document.getElementById("dropdownTipoUsuarioSecundario").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
	document.getElementById("dropdownGeneracionEnemigo").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
	document.getElementById("dropdownPokemonEnemigo").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
	document.getElementById("dropdownTipoEnemigoPrimario").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
	document.getElementById("dropdownTipoEnemigoSecundario").addEventListener('mousedown', (event) =>
	{
		canReposition = false;
		setTimeout(canRepositionAgain,400);
	});
}

// Dado un dropdown de pokemon y una generación, informa los valores.
function setDropdownPokemonSegunGeneracion(_drop,_gen,_func)
{
	$("#"+String(_drop)).empty();
	var _str = "";
	if (_gen == "1") _str = "h1-dropdownpokemon1";
	else if (_gen == "2") _str = "h4-dropdownpokemon2";
	else if (_gen == "3") _str = "h5-dropdownpokemon3";
	else if (_gen == "4") _str = "h6-dropdownpokemon4";
	else if (_gen == "5") _str = "h7-dropdownpokemon5";
	else if (_gen == "6") _str = "h8-dropdownpokemon6";
	else if (_gen == "7") _str = "h9-dropdownpokemon7";
	else if (_gen == "8") _str = "h10-dropdownpokemon8";
	$("#"+String(_drop)).load("https://pruebastomatosas.foroactivo.com/" + String(_str), _func);
}

// Tras la carga inicial de valores del dropdown enemigo, aplica los datos.
function afterStartingUpdate()
{
	document.getElementById("dropdownGeneracionEnemigo").value = genEnemigo;
	document.getElementById("dropdownPokemonEnemigo").value = iPokemonElegido;
	$("#imgPokemonEnemigo").css("background-image","url("+String(urlPokemonElegido)+")");
	updateAllInfo();
}

// Setea a true el reposition.
function canRepositionAgain()
{
	canReposition = true;
}

// Listeners para escuchar a las pulsaciones de teclas.
window.addEventListener("keydown", event =>
{
	if(event.key === "Escape")
	{
		isOpen = false;
	}
	else if (event.key === "Control")
	{
		isControl = true;
	}
});

// Listeners para escuchar a los levantamientos de teclas.
window.addEventListener("keyup", event =>
{
	if (event.key === "Control")
	{
		isControl = false;
	}
});

// Cambia un tip0o usuario.
function changeTipoUsuario()
{	
	document.getElementById("dropdownPokemonUsuario").value = 0;
	$("#imgPokemonUsuario").css("background-image","url(https://i.imgur.com/GTDLNAF.gif)");
	iStageUsuario = -1;
	updateAllInfo();
}

// Cambia un tipo enemigo.
function changeTipoEnemigo()
{
	document.getElementById("dropdownPokemonEnemigo").value = 0;
	$("#imgPokemonEnemigo").css("background-image","url(https://i.imgur.com/GTDLNAF.gif)");
	iStageEnemigo = -1;
	updateAllInfo();
}

// Actualiza toda la info de enemigo y usuario segun los datos.
function updateAllInfo()
{
	setUsuarioStats();
	setEnemigoStats();
	setDanyo("showDanyosUsuario","dropdownPokemonUsuario","dropdownPokemonEnemigo");
	setDanyo("showDanyosEnemigo","dropdownPokemonEnemigo","dropdownPokemonUsuario");
}

// Setea el valor de stage, PV y demás del enemigo.
function setUsuarioStats()
{
	if (iStageUsuario == -1)
	{
		document.getElementById("showStageUsuario").innerHTML = "";
	}
	else
	{
		var _stage = iStageUsuario;
		if (_stage == 0) _stage = "Base";
		document.getElementById("showStageUsuario").innerHTML = "Stage " + String(_stage) + ", " + String(40 + 10*iStageUsuario) + "PV";
	
		var _ret = getIndexUrlTipos(document.getElementById("dropdownPokemonUsuario").value,null);
		if (_ret != null) $("#imgPokemonUsuario").css("background-image","url("+String(_ret[1])+")");
	}
	
	var _tipos = getTipos("dropdownPokemonUsuario");
	document.getElementById("dropdownTipoUsuarioPrimario").value = _tipos[0];
	document.getElementById("dropdownTipoUsuarioSecundario").value = _tipos[1];
	
	// Limpia y aplica el estilo de los dropdowns.
	$("#dropdownGeneracionUsuario").removeClass();
	$("#dropdownGeneracionUsuario").addClass("dropdown");
	$("#dropdownPokemonUsuario").removeClass();
	$("#dropdownPokemonUsuario").addClass("dropdown");
	$("#dropdownTipoUsuarioPrimario").removeClass();
	$("#dropdownTipoUsuarioPrimario").addClass("dropdown");
	$("#dropdownTipoUsuarioSecundario").removeClass();
	$("#dropdownTipoUsuarioSecundario").addClass("dropdown");
	
	$("#dropdownGeneracionUsuario").addClass(getTipoGeneracion("dropdownGeneracionUsuario"));
	$("#dropdownPokemonUsuario").addClass(String(iStageUsuario == -1 ? "Null" : _tipos[0]));
	$("#dropdownTipoUsuarioPrimario").addClass(String(_tipos[0]));
	$("#dropdownTipoUsuarioSecundario").addClass(String(_tipos[1]));
}

// Setea el valor de stage, PV y demás del usuario.
function setEnemigoStats()
{	
	if (iStageEnemigo == -1)
	{
		document.getElementById("showStageEnemigo").innerHTML = "";
	}
	else
	{
		var _stage = iStageEnemigo;
		if (_stage == 0) _stage = "Base";
		document.getElementById("showStageEnemigo").innerHTML = "Stage " + String(_stage) + ", " + String(40 + 10*iStageEnemigo) + "PV";
	
		var _ret = getIndexUrlTipos(document.getElementById("dropdownPokemonEnemigo").value,null);
		if (_ret != null) $("#imgPokemonEnemigo").css("background-image","url("+String(_ret[1])+")");
	}
	
	var _tipos = getTipos("dropdownPokemonEnemigo");
	document.getElementById("dropdownTipoEnemigoPrimario").value = _tipos[0];
	document.getElementById("dropdownTipoEnemigoSecundario").value = _tipos[1];
	
	// Setea las debilidades del enemigo.
	var _deb = "";
	var _arrTipos = ["Acero", "Agua", "Bicho", "Dragon", "Electrico", "Fantasma", "Fuego", "Hada", "Hielo", "Lucha", "Normal", "Planta", "Psiquico", "Roca", "Siniestro", "Tierra", "Veneno", "Volador"];
	var _firstComma = false;
	// Comprueba para cada tipo si es efectivo contra los dos tipos del enemigo, y lo añade a la lista.
	_arrTipos.forEach(_tipo =>
	{
		if (getVentaja(_tipo,_tipos[0])+getVentaja(_tipo,_tipos[1]) >= 5)
		{
			if (_firstComma) _deb += ", ";
			_deb += _tipo;
			_firstComma = true;
		}
	});
	document.getElementById("debilidadesEnemigo").innerHTML = "Rival débil a: " + String(_deb);
	
	// Limpia y aplica el estilo de los dropdowns.
	$("#dropdownGeneracionEnemigo").removeClass();
	$("#dropdownGeneracionEnemigo").addClass("dropdown");
	$("#dropdownPokemonEnemigo").removeClass();
	$("#dropdownPokemonEnemigo").addClass("dropdown");
	$("#dropdownTipoEnemigoPrimario").removeClass();
	$("#dropdownTipoEnemigoPrimario").addClass("dropdown");
	$("#dropdownTipoEnemigoSecundario").removeClass();
	$("#dropdownTipoEnemigoSecundario").addClass("dropdown");
	
	$("#dropdownGeneracionEnemigo").addClass(getTipoGeneracion("dropdownGeneracionEnemigo"));
	$("#dropdownPokemonEnemigo").addClass(String(iStageEnemigo == -1 ? "Null" : _tipos[0]));
	$("#dropdownTipoEnemigoPrimario").addClass(String(_tipos[0]));
	$("#dropdownTipoEnemigoSecundario").addClass(String(_tipos[1]));
}

// Setea el daño.
function setDanyo(_p,_d1,_d2)
{
	// Obtén los tipos.
	var _t1 = getTipos(_d1);
	var _t2 = getTipos(_d2);
	var _v1 = 0, _v2 = 0;
	
	// Comprueba el bono de ventaja para cada tipo por separado.
	var _v1a = getVentaja(_t1[0],_t2[0]);
	var _v1b = getVentaja(_t1[0],_t2[1]);
	if (_v1a+_v1b >= 5) _v1 = 5;
	
	var _v2a = getVentaja(_t1[1],_t2[0]);
	var _v2b = getVentaja(_t1[1],_t2[1]);
	if (_v2a+_v2b >= 5) _v2 = 5;
	
	var _ventaja = Math.max(_v1,_v2);
	
	// Suma y muestra el resultado.
	document.getElementById(_p).innerHTML = _ventaja == 5 ? "Ventaja de tipo (+5)" : "Daño neutral";
	$("#"+String(_p)).css("color", _ventaja == 5 ? "#00FF00" : "#FFFFFF");
}

// Obtén los tipos del dropdown de Pokémon.
function getTipos(_drop)
{
	// Si hay un Pokémon seleccionado, obtén sus tipos.
	var _id = document.getElementById(_drop).value;
	var _ret = getIndexUrlTipos(_id,null);
	if (_ret != null) return [_ret[3],_ret[4]];
	else
	{
		// Si no hay Pokémon seleccionado, tomamos directamente los tipos a mano.
		if (_drop == "dropdownPokemonUsuario") return [document.getElementById("dropdownTipoUsuarioPrimario").value, document.getElementById("dropdownTipoUsuarioSecundario").value];
		else return [document.getElementById("dropdownTipoEnemigoPrimario").value, document.getElementById("dropdownTipoEnemigoSecundario").value];
	}
}

// obtén el tipo (color) de la generación.
function getTipoGeneracion(_drop)
{
	var _val = document.getElementById(_drop).value;
	if 		(_val == "1") return "Psiquico";
	else if (_val == "2") return "Volador";
	else if (_val == "3") return "Dragon";
	else if (_val == "4") return "Fantasma";
	else if (_val == "5") return "Hielo";
	else if (_val == "6") return "Fuego";
	else if (_val == "7") return "Electrico";
	else if (_val == "8") return "Veneno";
	else return "Null";
}

// Obtén la ventaja de un tipo a otro.
function getVentaja(_t1,_t2)
{
	if (
		(_t1 == "Acero" && (_t2 == "Hada" || _t2 == "Hielo" || _t2 == "Roca")) ||
		(_t1 == "Agua" && (_t2 == "Fuego" || _t2 == "Roca" || _t2 == "Tierra")) ||
		(_t1 == "Bicho" && (_t2 == "Planta" || _t2 == "Psiquico" || _t2 == "Siniestro")) ||
		(_t1 == "Dragon" && (_t2 == "Dragon")) ||
		(_t1 == "Electrico" && (_t2 == "Agua" || _t2 == "Volador")) ||
		(_t1 == "Fantasma" && (_t2 == "Fantasma" || _t2 == "Psiquico")) ||
		(_t1 == "Fuego" && (_t2 == "Acero" || _t2 == "Bicho" || _t2 == "Hielo" || _t2 == "Planta")) ||
		(_t1 == "Hada" && (_t2 == "Dragon" || _t2 == "Lucha" || _t2 == "Siniestro")) ||
		(_t1 == "Hielo" && (_t2 == "Dragon" || _t2 == "Planta" || _t2 == "Tierra" || _t2 == "Volador")) ||
		(_t1 == "Lucha" && (_t2 == "Acero" || _t2 == "Hielo" || _t2 == "Normal" || _t2 == "Roca" || _t2 == "Siniestro")) ||
		(_t1 == "Planta" && (_t2 == "Agua" || _t2 == "Roca" || _t2 == "Tierra")) ||
		(_t1 == "Psiquico" && (_t2 == "Lucha" || _t2 == "Veneno")) ||
		(_t1 == "Roca" && (_t2 == "Bicho" || _t2 == "Fuego" || _t2 == "Hielo" || _t2 == "Volador")) ||
		(_t1 == "Siniestro" && (_t2 == "Fantasma" || _t2 == "Psiquico")) ||
		(_t1 == "Tierra" && (_t2 == "Acero" || _t2 == "Electrico" || _t2 == "Fuego" || _t2 == "Roca" || _t2 == "Veneno")) ||
		(_t1 == "Veneno" && (_t2 == "Hada" || _t2 == "Planta")) ||
		(_t1 == "Volador" && (_t2 == "Bicho" || _t2 == "Lucha" || _t2 == "Planta"))
	)
		return 5;
	else if (
		(_t1 == "Acero" && (_t2 == "Acero" || _t2 == "Agua" || _t2 == "Electrico" || _t2 == "Fuego")) ||
		(_t1 == "Agua" && (_t2 == "Agua" || _t2 == "Dragon" || _t2 == "Planta")) ||
		(_t1 == "Bicho" && (_t2 == "Acero" || _t2 == "Fantasma" || _t2 == "Fuego" || _t2 == "Hada" || _t2 == "Lucha" || _t2 == "Veneno" || _t2 == "Volador")) ||
		(_t1 == "Dragon" && (_t2 == "Acero" || _t2 == "Hada")) ||
		(_t1 == "Electrico" && (_t2 == "Dragon" || _t2 == "Electrico" || _t2 == "Planta" || _t2 == "Tierra")) ||
		(_t1 == "Fantasma" && (_t2 == "Normal" || _t2 == "Siniestro")) ||
		(_t1 == "Fuego" && (_t2 == "Agua" || _t2 == "Dragon" || _t2 == "Fuego" || _t2 == "Roca")) ||
		(_t1 == "Hada" && (_t2 == "Acero" || _t2 == "Fuego" || _t2 == "Veneno")) ||
		(_t1 == "Hielo" && (_t2 == "Acero" || _t2 == "Agua" || _t2 == "Fuego" || _t2 == "Hielo")) ||
		(_t1 == "Lucha" && (_t2 == "Bicho" || _t2 == "Fantasma" || _t2 == "Hada" || _t2 == "Psiquico" || _t2 == "Veneno" || _t2 == "Volador")) ||
		(_t1 == "Normal" && (_t2 == "Acero" || _t2 == "Fantasma" || _t2 == "Roca")) ||
		(_t1 == "Planta" && (_t2 == "Acero" || _t2 == "Bicho" || _t2 == "Dragon" || _t2 == "Fuego" || _t2 == "Planta" || _t2 == "Veneno" || _t2 == "Volador")) ||
		(_t1 == "Psiquico" && (_t2 == "Acero" || _t2 == "Psiquico" || _t2 == "Siniestro")) ||
		(_t1 == "Roca" && (_t2 == "Acero" || _t2 == "Lucha" || _t2 == "Tierra")) ||
		(_t1 == "Siniestro" && (_t2 == "Hada" || _t2 == "Lucha" || _t2 == "Siniestro")) ||
		(_t1 == "Tierra" && (_t2 == "Bicho" || _t2 == "Planta" || _t2 == "Volador")) ||
		(_t1 == "Veneno" && (_t2 == "Acero" || _t2 == "Fantasma" || _t2 == "Roca" || _t2 == "Tierra" || _t2 == "Veneno")) ||
		(_t1 == "Volador" && (_t2 == "Acero" || _t2 == "Electrico" || _t2 == "Roca"))
	)
		return -5;
	return 0;
}
  
// Pone a false el click.
function resetClick()
{
	canClick = false;
}

// Gestiona cada step lógica.
function stepTipos()
{
	stepTimeout = setTimeout(stepTipos,16);
	dirAng += 5;
	if (dirAng >= 360) dirAng -= 360;
	
	// Flechas.
	var _rat = 5*Math.cos(dirAng*Math.PI/180);
	var _size = 20 + _rat;
	$(".flechaEnemigo").css("margin-left", -180+_rat);
	$(".flechaUsuario").css("margin-left", +165-_rat);
	
	// Se despliega. Cargando.
	if (cntChainload == 8 && isOpen) scale = Math.min(scale+0.03,1);
	else scale = Math.max(scale-0.03,0);
	if (!isOpen) showCargando = false;
	
	$(".popupTipos").css("opacity", 1*scale);
	$(".cargando").css("opacity", (1 - 1*scale)*showCargando);
	$(".cargando").css({'transform' : 'rotate('+ dirAng +'deg)'});
	
	if (scale == 0 && !isOpen) $(".popupTipos").css("visibility", "hidden");
	else if (scale == 1 && isOpen) $(".popupTipos").css("visibility", "visible");
}

// BASE DE DATOS CON TODOS LOS POKES Y SU GEN, TIPOS, STAGE, LINKS...
function getIndexUrlTipos(_i,_url)
{
	var _ret = null;
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","1","xy","bulbasaur",0,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","2","xy","ivysaur",1,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","3","xy","venusaur",2,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","3m","xy","venusaur-mega",2,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","4","xy","charmander",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","5","xy","charmeleon",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","6","xy","charizard",2,"Fuego","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","6mx","xy","charizard-megax",2,"Fuego","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","6my","xy","charizard-megay",2,"Fuego","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","7","xy","squirtle",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","8","xy","wartortle",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","9","xy","blastoise",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","9m","xy","blastoise-mega",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","10","xy","caterpie",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","11","xy","metapod",1,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","12","xy","butterfree",2,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","13","xy","weedle",0,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","14","xy","kakuna",1,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","15","xy","beedrill",2,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","15m","rze","beedrill-mega",2,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","16","xy","pidgey",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","17","xy","pidgeotto",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","18","xy","pidgeot",2,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","18m","rze","pidgeot-mega",2,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","19","xy","rattata",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","19a","sl","rattata-alola",0,"Siniestro","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","20","xy","raticate",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","20a","sl","raticate-alola",1,"Siniestro","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","21","xy","spearow",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","22","xy","fearow",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","23","xy","ekans",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","24","xy","arbok",1,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","25","xy","pikachu",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","26","xy","raichu",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","26a","sl","raichu-alola",2,"Electrico","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","27","xy","sandshrew",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","27a","sl","sandshrew-alola",0,"Hielo","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","28","xy","sandslash",1,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","28a","sl","sandslash-alola",1,"Hielo","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","29","xy","nidoran_f",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","30","xy","nidorina",1,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","31","xy","nidoqueen",2,"Veneno","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","32","xy","nidoran_m",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","33","xy","nidorino",1,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","34","xy","nidoking",2,"Veneno","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","35","xy","clefairy",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","36","xy","clefable",2,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","37","xy","vulpix",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","37a","sl","vulpix-alola",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","38","xy","ninetales",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","38a","sl","ninetales-alola",1,"Hielo","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","39","xy","jigglypuff",1,"Normal","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","40","xy","wigglytuff",2,"Normal","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","41","xy","zubat",0,"Veneno","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","42","xy","golbat",1,"Veneno","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","43","xy","oddish",0,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","44","xy","gloom",1,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","45","xy","vileplume",2,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","46","xy","paras",0,"Bicho","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","47","xy","parasect",1,"Bicho","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","48","xy","venonat",0,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","49","xy","venomoth",1,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","50","xy","diglett",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","50a","sl","diglett-alola",0,"Tierra","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","51","xy","dugtrio",1,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","51a","sl","dugtrio-alola",1,"Tierra","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","52","xy","meowth",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","52a","sl","meowth-alola",0,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","52g","ee","meowth-galar",0,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","53","xy","persian",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","53a","sl","persian-alola",1,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","54","xy","psyduck",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","55","xy","golduck",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","56","xy","mankey",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","57","xy","primeape",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","58","xy","growlithe",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","59","xy","arcanine",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","60","xy","poliwag",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","61","xy","poliwhirl",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","62","xy","poliwrath",2,"Agua","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","63","xy","abra",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","64","xy","kadabra",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","65","xy","alakazam",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","65m","xy","alakazam-mega",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","66","xy","machop",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","67","xy","machoke",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","68","xy","machamp",2,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","69","xy","bellsprout",0,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","70","xy","weepinbell",1,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","71","xy","victreebel",2,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","72","xy","tentacool",0,"Agua","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","73","xy","tentacruel",1,"Agua","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","74","xy","geodude",0,"Roca","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","74a","sl","geodude-alola",0,"Roca","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","75","xy","graveler",1,"Roca","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","75a","sl","graveler-alola",1,"Roca","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","76","xy","golem",2,"Roca","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","76a","sl","golem-alola",2,"Roca","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","77","xy","ponyta",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","77g","ee","ponyta-galar",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","78","xy","rapidash",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","78g","ee","rapidash-galar",1,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","79","xy","slowpoke",0,"Agua","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","79g","ee","slowpoke-galar",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","80","xy","slowbro",1,"Agua","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","80g","ee","slowbro-galar",1,"Veneno","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","80m","rze","slowbro-mega",1,"Agua","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","81","xy","magnemite",0,"Electrico","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","82","xy","magneton",1,"Electrico","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","83","xy","farfetchd",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","83g","ee","farfetchd-galar",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","84","xy","doduo",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","85","xy","dodrio",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","86","xy","seel",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","87","xy","dewgong",1,"Agua","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","88","xy","grimer",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","88a","sl","grimer-alola",0,"Veneno","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","89","xy","muk",1,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","89a","sl","muk-alola",1,"Veneno","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","90","xy","shellder",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","91","xy","cloyster",1,"Agua","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","92","xy","gastly",0,"Fantasma","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","93","xy","haunter",1,"Fantasma","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","94","xy","gengar",2,"Fantasma","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","94m","xy","gengar-mega",2,"Fantasma","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","95","xy","onix",0,"Roca","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","96","xy","drowzee",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","97","xy","hypno",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","98","xy","krabby",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","99","xy","kingler",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","100","xy","voltorb",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","101","xy","electrode",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","102","xy","exeggcute",0,"Planta","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","103","xy","exeggutor",1,"Planta","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","103a","sl","exeggutor-alola",1,"Planta","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","104","xy","cubone",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","105","xy","marowak",1,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","105a","sl","marowak-alola",1,"Fuego","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","106","xy","hitmonlee",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","107","xy","hitmonchan",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","108","xy","lickitung",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","109","xy","koffing",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","110","xy","weezing",1,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","110g","ee","weezing-galar",1,"Veneno","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","111","xy","rhyhorn",0,"Tierra","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","112","xy","rhydon",1,"Tierra","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","113","xy","chansey",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","114","xy","tangela",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","115","xy","kangaskhan",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","115m","xy","kangaskhan-mega",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","116","xy","horsea",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","117","xy","seadra",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","118","xy","goldeen",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","119","xy","seaking",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","120","xy","staryu",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","121","xy","starmie",1,"Agua","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","122","xy","mr._mime",1,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","122g","ee","mr._mime-galar",1,"Hielo","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","123","xy","scyther",0,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","124","xy","jynx",1,"Hielo","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","125","xy","electabuzz",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","126","xy","magmar",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","127","xy","pinsir",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","127m","xy","pinsir-mega",0,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","128","xy","tauros",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","129","xy","magikarp",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","130","xy","gyarados",1,"Agua","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","130m","xy","gyarados-mega",1,"Agua","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","131","xy","lapras",0,"Agua","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","132","xy","ditto",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","133","xy","eevee",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","134","xy","vaporeon",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","135","xy","jolteon",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","136","xy","flareon",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","137","xy","porygon",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","138","xy","omanyte",0,"Roca","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","139","xy","omastar",1,"Roca","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","140","xy","kabuto",0,"Roca","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","141","xy","kabutops",1,"Roca","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","142","xy","aerodactyl",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","142m","xy","aerodactyl-mega",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","143","xy","snorlax",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","144","xy","articuno",2,"Hielo","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","144g","ee","articuno-galar",2,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","145","xy","zapdos",2,"Electrico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","145g","ee","zapdos-galar",2,"Lucha","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","146","xy","moltres",2,"Fuego","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","146g","ee","moltres-galar",2,"Siniestro","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","147","xy","dratini",0,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","148","xy","dragonair",1,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","149","xy","dragonite",2,"Dragon","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","150","xy","mewtwo",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","150mx","xy","mewtwo-megax",2,"Psiquico","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","150my","xy","mewtwo-megay",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"1","151","xy","mew",2,"Psiquico","Null");
	
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","152","xy","chikorita",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","153","xy","bayleef",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","154","xy","meganium",2,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","155","xy","cyndaquil",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","156","xy","quilava",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","157","xy","typhlosion",2,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","158","xy","totodile",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","159","xy","croconaw",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","160","xy","feraligatr",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","161","xy","sentret",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","162","xy","furret",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","163","xy","hoothoot",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","164","xy","noctowl",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","165","xy","ledyba",0,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","166","xy","ledian",1,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","167","xy","spinarak",0,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","168","xy","ariados",1,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","169","xy","crobat",2,"Veneno","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","170","xy","chinchou",0,"Agua","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","171","xy","lanturn",1,"Agua","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","172","xy","pichu",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","173","xy","cleffa",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","174","xy","igglybuff",0,"Normal","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","175","xy","togepi",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","176","xy","togetic",1,"Hada","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","177","xy","natu",0,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","178","xy","xatu",1,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","179","xy","mareep",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","180","xy","flaaffy",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","181","xy","ampharos",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","181m","xy","ampharos-mega",2,"Electrico","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","182","xy","bellossom",2,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","183","xy","marill",1,"Agua","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","184","xy","azumarill",2,"Agua","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","185","xy","sudowoodo",1,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","186","xy","politoed",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","187","xy","hoppip",0,"Planta","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","188","xy","skiploom",1,"Planta","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","189","xy","jumpluff",2,"Planta","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","190","xy","aipom",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","191","xy","sunkern",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","192","xy","sunflora",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","193","xy","yanma",0,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","194","xy","wooper",0,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","195","xy","quagsire",1,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","196","xy","espeon",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","197","xy","umbreon",1,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","198","xy","murkrow",0,"Siniestro","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","199","xy","slowking",1,"Agua","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","199g","ee","slowking-galar",1,"Veneno","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","200","xy","misdreavus",0,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","201","xy","unown",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","202","xy","wobbuffet",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","203","xy","girafarig",0,"Normal","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","204","xy","pineco",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","205","xy","forretress",1,"Bicho","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","206","xy","dunsparce",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","207","xy","gligar",0,"Tierra","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","208","xy","steelix",1,"Acero","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","208m","rze","steelix-mega",1,"Acero","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","209","xy","snubbull",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","210","xy","granbull",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","211","xy","qwilfish",0,"Agua","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","212","xy","scizor",1,"Bicho","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","212m","xy","scizor-mega",1,"Bicho","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","213","xy","shuckle",0,"Bicho","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","214","xy","heracross",0,"Bicho","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","214m","xy","heracross-mega",0,"Bicho","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","215","xy","sneasel",0,"Siniestro","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","216","xy","teddiursa",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","217","xy","ursaring",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","218","xy","slugma",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","219","xy","magcargo",1,"Fuego","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","220","xy","swinub",0,"Hielo","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","221","xy","piloswine",1,"Hielo","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","222","xy","corsola",0,"Agua","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","222g","ee","corsola-galar",0,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","223","xy","remoraid",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","224","xy","octillery",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","225","xy","delibird",0,"Hielo","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","226","xy","mantine",1,"Agua","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","227","xy","skarmory",0,"Acero","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","228","xy","houndour",0,"Siniestro","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","229","xy","houndoom",1,"Siniestro","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","229m","xy","houndoom-mega",1,"Siniestro","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","230","xy","kingdra",2,"Agua","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","231","xy","phanpy",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","232","xy","donphan",1,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","233","xy","porygon2",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","234","xy","stantler",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","235","xy","smeargle",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","236","xy","tyrogue",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","237","xy","hitmontop",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","238","xy","smoochum",0,"Hielo","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","239","xy","elekid",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","240","xy","magby",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","241","xy","miltank",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","242","xy","blissey",2,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","243","xy","raikou",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","244","xy","entei",2,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","245","xy","suicune",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","246","xy","larvitar",0,"Roca","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","247","xy","pupitar",1,"Roca","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","248","xy","tyranitar",2,"Roca","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","248m","xy","tyranitar-mega",2,"Roca","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","249","xy","lugia",2,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","250","xy","ho-oh",2,"Fuego","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"2","251","xy","celebi",2,"Psiquico","Planta");
	
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","252","xy","treecko",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","253","xy","grovyle",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","254","xy","sceptile",2,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","254m","rze","sceptile-mega",2,"Planta","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","255","xy","torchic",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","256","xy","combusken",1,"Fuego","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","257","xy","blaziken",2,"Fuego","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","257m","xy","blaziken-mega",2,"Fuego","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","258","xy","mudkip",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","259","xy","marshtomp",1,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","260","xy","swampert",2,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","260m","rze","swampert-mega",2,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","261","xy","poochyena",0,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","262","xy","mightyena",1,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","263","xy","zigzagoon",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","263g","ee","zigzagoon-galar",0,"Siniestro","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","264","xy","linoone",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","264g","ee","linoone-galar",1,"Siniestro","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","265","xy","wurmple",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","266","xy","silcoon",1,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","267","xy","beautifly",2,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","268","xy","cascoon",1,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","269","xy","dustox",2,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","270","xy","lotad",0,"Agua","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","271","xy","lombre",1,"Agua","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","272","xy","ludicolo",2,"Agua","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","273","xy","seedot",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","274","xy","nuzleaf",1,"Planta","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","275","xy","shiftry",2,"Planta","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","276","xy","taillow",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","277","xy","swellow",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","278","xy","wingull",0,"Agua","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","279","xy","pelipper",1,"Agua","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","280","xy","ralts",0,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","281","xy","kirlia",1,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","282","xy","gardevoir",2,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","282m","xy","gardevoir-mega",2,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","283","xy","surskit",0,"Bicho","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","284","xy","masquerain",1,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","285","xy","shroomish",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","286","xy","breloom",1,"Planta","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","287","xy","slakoth",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","288","xy","vigoroth",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","289","xy","slaking",2,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","290","xy","nincada",0,"Bicho","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","291","xy","ninjask",1,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","292","xy","shedinja",1,"Bicho","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","293","xy","whismur",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","294","xy","loudred",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","295","xy","exploud",2,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","296","xy","makuhita",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","297","xy","hariyama",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","298","xy","azurill",0,"Normal","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","299","xy","nosepass",0,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","300","xy","skitty",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","301","xy","delcatty",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","302","xy","sableye",0,"Siniestro","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","302m","rze","sableye-mega",0,"Siniestro","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","303","xy","mawile",0,"Acero","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","303m","xy","mawile-mega",0,"Acero","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","304","xy","aron",0,"Acero","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","305","xy","lairon",1,"Acero","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","306","xy","aggron",2,"Acero","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","306m","xy","aggron-mega",2,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","307","xy","meditite",0,"Lucha","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","308","xy","medicham",1,"Lucha","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","308m","xy","medicham-mega",1,"Lucha","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","309","xy","electrike",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","310","xy","manectric",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","310m","xy","manectric-mega",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","311","xy","plusle",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","312","xy","minun",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","313","xy","volbeat",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","314","xy","illumise",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","315","xy","roselia",1,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","316","xy","gulpin",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","317","xy","swalot",1,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","318","xy","carvanha",0,"Agua","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","319","xy","sharpedo",1,"Agua","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","319m","rze","sharpedo-mega",1,"Agua","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","320","xy","wailmer",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","321","xy","wailord",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","322","xy","numel",0,"Fuego","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","323","xy","camerupt",1,"Fuego","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","323m","rze","camerupt-mega",1,"Fuego","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","324","xy","torkoal",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","325","xy","spoink",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","326","xy","grumpig",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","327","xy","spinda",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","328","xy","trapinch",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","329","xy","vibrava",1,"Tierra","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","330","xy","flygon",2,"Tierra","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","331","xy","cacnea",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","332","xy","cacturne",1,"Planta","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","333","xy","swablu",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","334","xy","altaria",1,"Dragon","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","334m","rze","altaria-mega",1,"Dragon","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","335","xy","zangoose",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","336","xy","seviper",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","337","xy","lunatone",0,"Roca","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","338","xy","solrock",0,"Roca","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","339","xy","barboach",0,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","340","xy","whiscash",1,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","341","xy","corphish",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","342","xy","crawdaunt",1,"Agua","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","343","xy","baltoy",0,"Tierra","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","344","xy","claydol",1,"Tierra","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","345","xy","lileep",0,"Roca","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","346","xy","cradily",1,"Roca","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","347","xy","anorith",0,"Roca","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","348","xy","armaldo",1,"Roca","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","349","xy","feebas",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","350","xy","milotic",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","351","xy","castform",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","351f","xy","castform-sunny",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","351a","xy","castform-rainy",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","351h","xy","castform-snowy",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","352","xy","kecleon",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","353","xy","shuppet",0,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","354","xy","banette",1,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","354m","xy","banette-mega",1,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","355","xy","duskull",0,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","356","xy","dusclops",1,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","357","xy","tropius",0,"Planta","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","358","xy","chimecho",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","359","xy","absol",0,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","359m","xy","absol-mega",0,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","360","xy","wynaut",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","361","xy","snorunt",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","362","xy","glalie",1,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","362m","rze","glalie-mega",1,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","363","xy","spheal",0,"Hielo","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","364","xy","sealeo",1,"Hielo","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","365","xy","walrein",2,"Hielo","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","366","xy","clamperl",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","367","xy","huntail",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","368","xy","gorebyss",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","369","xy","relicanth",0,"Agua","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","370","xy","luvdisc",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","371","xy","bagon",0,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","372","xy","shelgon",1,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","373","xy","salamence",2,"Dragon","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","373m","rze","salamence-mega",2,"Dragon","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","374","xy","beldum",0,"Acero","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","375","xy","metang",1,"Acero","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","376","xy","metagross",2,"Acero","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","376m","rze","metagross-mega",2,"Acero","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","377","xy","regirock",2,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","378","xy","regice",2,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","379","xy","registeel",2,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","380","xy","latias",2,"Dragon","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","380m","xy","latias-mega",2,"Dragon","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","381","xy","latios",2,"Dragon","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","381m","xy","latios-mega",2,"Dragon","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","382","xy","kyogre",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","382m","rze","kyogre-primal",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","383","xy","groudon",2,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","383m","rze","groudon-primal",2,"Tierra","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","384","xy","rayquaza",2,"Dragon","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","384m","rze","rayquaza-mega",2,"Dragon","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","385","xy","jirachi",2,"Acero","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","386","xy","deoxys",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","386a","xy","deoxys-attack",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","386d","xy","deoxys-defense",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"3","386s","xy","deoxys-speed",2,"Psiquico","Null");
	
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","387","xy","turtwig",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","388","xy","grotle",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","389","xy","torterra",2,"Planta","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","390","xy","chimchar",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","391","xy","monferno",1,"Fuego","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","392","xy","infernape",2,"Fuego","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","393","xy","piplup",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","394","xy","prinplup",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","395","xy","empoleon",2,"Agua","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","396","xy","starly",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","397","xy","staravia",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","398","xy","staraptor",2,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","399","xy","bidoof",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","400","xy","bibarel",1,"Normal","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","401","xy","kricketot",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","402","xy","kricketune",1,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","403","xy","shinx",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","404","xy","luxio",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","405","xy","luxray",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","406","xy","budew",0,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","407","xy","roserade",2,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","408","xy","cranidos",0,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","409","xy","rampardos",1,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","410","xy","shieldon",0,"Roca","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","411","xy","bastiodon",1,"Roca","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","412","xy","burmy",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","412s","xy","burmy-sandy",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","412t","xy","burmy-trash",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","413","xy","wormadam",1,"Bicho","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","413s","xy","wormadam-sandy",1,"Bicho","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","413t","xy","wormadam-trash",1,"Bicho","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","414","xy","mothim",1,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","415","xy","combee",0,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","416","xy","vespiquen",1,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","417","xy","pachirisu",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","418","xy","buizel",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","419","xy","floatzel",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","420","xy","cherubi",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","421e","xy","cherrim",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","421s","xy","cherrim-sunshine",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","422o","xy","shellos",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","422e","xy","shellos-east",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","423o","xy","gastrodon",1,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","423e","xy","gastrodon-east",1,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","424","xy","ambipom",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","425","xy","drifloon",0,"Fantasma","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","426","xy","drifblim",1,"Fantasma","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","427","xy","buneary",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","428","xy","lopunny",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","428m","rze","lopunny-mega",1,"Normal","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","429","xy","mismagius",1,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","430","xy","honchkrow",1,"Siniestro","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","431","xy","glameow",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","432","xy","purugly",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","433","xy","chingling",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","434","xy","stunky",0,"Veneno","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","435","xy","skuntank",1,"Veneno","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","436","xy","bronzor",0,"Acero","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","437","xy","bronzong",1,"Acero","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","438","xy","bonsly",0,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","439","xy","mime_jr",0,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","440","xy","happiny",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","441","xy","chatot",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","442","xy","spiritomb",0,"Fantasma","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","443","xy","gible",0,"Dragon","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","444","xy","gabite",1,"Dragon","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","445","xy","garchomp",2,"Dragon","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","445m","xy","garchomp-mega",2,"Dragon","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","446","xy","munchlax",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","447","xy","riolu",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","448","xy","lucario",1,"Lucha","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","448m","xy","lucario-mega",1,"Lucha","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","449","xy","hippopotas",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","450","xy","hippowdon",1,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","451","xy","skorupi",0,"Veneno","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","452","xy","drapion",1,"Veneno","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","453","xy","croagunk",0,"Veneno","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","454","xy","toxicroak",1,"Veneno","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","455","xy","carnivine",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","456","xy","finneon",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","457","xy","lumineon",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","458","xy","mantyke",0,"Agua","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","459","xy","snover",0,"Planta","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","460","xy","abomasnow",1,"Planta","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","460m","xy","abomasnow-mega",1,"Planta","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","461","xy","weavile",1,"Siniestro","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","462","xy","magnezone",2,"Electrico","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","463","xy","lickilicky",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","464","xy","rhyperior",2,"Tierra","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","465","xy","tangrowth",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","466","xy","electivire",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","467","xy","magmortar",2,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","468","xy","togekiss",2,"Hada","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","469","xy","yanmega",1,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","470","xy","leafeon",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","471","xy","glaceon",1,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","472","xy","gliscor",1,"Tierra","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","473","xy","mamoswine",2,"Hielo","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","474","xy","porygon-z",2,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","475","xy","gallade",2,"Psiquico","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","475m","rze","gallade-mega",2,"Psiquico","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","476","xy","probopass",1,"Roca","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","477","xy","dusknoir",2,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","478","xy","froslass",1,"Hielo","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","479n","xy","rotom",0,"Electrico","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","479c","xy","rotom-heat",0,"Electrico","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","479l","xy","rotom-wash",0,"Electrico","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","479f","xy","rotom-frost",0,"Electrico","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","479v","xy","rotom-fan",0,"Electrico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","479x","xy","rotom-mow",0,"Electrico","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","480","xy","uxie",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","481","xy","mesprit",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","482","xy","azelf",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","483","xy","dialga",2,"Acero","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","484","xy","palkia",2,"Agua","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","485","xy","heatran",2,"Fuego","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","486","xy","regigigas",2,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","487","xy","giratina",2,"Fantasma","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","487o","xy","giratina-origin",2,"Fantasma","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","488","xy","cresselia",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","489","xy","phione",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","490","xy","manaphy",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","491","xy","darkrai",2,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","492","xy","shaymin",2,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","492c","xy","shaymin-sky",2,"Planta","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"4","493","xy","arceus",2,"Normal","Null");
	
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","494","xy","victini",2,"Psiquico","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","495","xy","snivy",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","496","xy","servine",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","497","xy","serperior",2,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","498","xy","tepig",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","499","xy","pignite",1,"Fuego","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","500","xy","emboar",2,"Fuego","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","501","xy","oshawott",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","502","xy","dewott",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","503","xy","samurott",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","504","xy","patrat",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","505","xy","watchog",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","506","xy","lillipup",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","507","xy","herdier",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","508","xy","stoutland",2,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","509","xy","purrloin",0,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","510","xy","liepard",1,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","511","xy","pansage",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","512","xy","simisage",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","513","xy","pansear",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","514","xy","simisear",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","515","xy","panpour",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","516","xy","simipour",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","517","xy","munna",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","518","xy","musharna",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","519","xy","pidove",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","520","xy","tranquill",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","521","xy","unfezant",2,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","521f","xy","unfezant-f",2,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","522","xy","blitzle",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","523","xy","zebstrika",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","524","xy","roggenrola",0,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","525","xy","boldore",1,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","526","xy","gigalith",2,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","527","xy","woobat",0,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","528","xy","swoobat",1,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","529","xy","drilbur",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","530","xy","excadrill",1,"Tierra","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","531","xy","audino",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","531m","rze","audino-mega",0,"Normal","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","532","xy","timburr",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","533","xy","gurdurr",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","534","xy","conkeldurr",2,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","535","xy","tympole",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","536","xy","palpitoad",1,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","537","xy","seismitoad",2,"Agua","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","538","xy","throh",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","539","xy","sawk",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","540","xy","sewaddle",0,"Bicho","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","541","xy","swadloon",1,"Bicho","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","542","xy","leavanny",2,"Bicho","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","543","xy","venipede",0,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","544","xy","whirlipede",1,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","545","xy","scolipede",2,"Bicho","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","546","xy","cottonee",0,"Planta","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","547","xy","whimsicott",1,"Planta","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","548","xy","petilil",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","549","xy","lilligant",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","550","xy","basculin",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","550b","xy","basculin-blue",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","551","xy","sandile",0,"Tierra","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","552","xy","krokorok",1,"Tierra","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","553","xy","krookodile",2,"Tierra","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","554","xy","darumaka",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","554g","ee","darumaka-galar",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","555","xy","darmanitan",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","555z","xy","darmanitan-zen",1,"Fuego","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","555g","ee","darmanitan-galar",1,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","555gz","ee","darmanitan-galar-zen",1,"Hielo","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","556","xy","maractus",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","557","xy","dwebble",0,"Bicho","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","558","xy","crustle",1,"Bicho","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","559","xy","scraggy",0,"Siniestro","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","560","xy","scrafty",1,"Siniestro","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","561","xy","sigilyph",0,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","562","xy","yamask",0,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","562g","ee","yamask-galar",0,"Tierra","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","563","xy","cofagrigus",1,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","564","xy","tirtouga",0,"Agua","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","565","xy","carracosta",1,"Agua","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","566","xy","archen",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","567","xy","archeops",1,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","568","xy","trubbish",0,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","569","xy","garbodor",1,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","570","xy","zorua",0,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","571","xy","zoroark",1,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","572","xy","minccino",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","573","xy","cinccino",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","574","xy","gothita",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","575","xy","gothorita",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","576","xy","gothitelle",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","577","xy","solosis",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","578","xy","duosion",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","579","xy","reuniclus",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","580","xy","ducklett",0,"Agua","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","581","xy","swanna",1,"Agua","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","582","xy","vanillite",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","583","xy","vanillish",1,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","584","xy","vanilluxe",2,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","585","xy","deerling",0,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","585a","xy","deerling-summer",0,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","585s","xy","deerling-autumn",0,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","585w","xy","deerling-winter",0,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","586","xy","sawsbuck",1,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","586a","xy","sawsbuck-summer",1,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","586s","xy","sawsbuck-autumn",1,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","586w","xy","sawsbuck-winter",1,"Normal","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","587","xy","emolga",0,"Electrico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","588","xy","karrablast",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","589","xy","escavalier",1,"Bicho","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","590","xy","foongus",0,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","591","xy","amoonguss",1,"Planta","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","592","xy","frillish",0,"Agua","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","592f","xy","frillish-f",0,"Agua","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","593","xy","jellicent",1,"Agua","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","593f","xy","jellicent-f",1,"Agua","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","594","xy","alomomola",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","595","xy","joltik",0,"Bicho","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","596","xy","galvantula",1,"Bicho","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","597","xy","ferroseed",0,"Planta","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","598","xy","ferrothorn",1,"Planta","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","599","xy","klink",0,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","600","xy","klang",1,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","601","xy","klinklang",2,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","602","xy","tynamo",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","603","xy","eelektrik",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","604","xy","eelektross",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","605","xy","elgyem",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","606","xy","beheeyem",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","607","xy","litwick",0,"Fantasma","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","608","xy","lampent",1,"Fantasma","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","609","xy","chandelure",2,"Fantasma","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","610","xy","axew",0,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","611","xy","fraxure",1,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","612","xy","haxorus",2,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","613","xy","cubchoo",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","614","xy","beartic",1,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","615","xy","cryogonal",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","616","xy","shelmet",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","617","xy","accelgor",1,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","618","xy","stunfisk",0,"Tierra","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","618g","ee","stunfisk-galar",0,"Tierra","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","619","xy","mienfoo",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","620","xy","mienshao",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","621","xy","druddigon",0,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","622","xy","golett",0,"Tierra","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","623","xy","golurk",1,"Tierra","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","624","xy","pawniard",0,"Siniestro","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","625","xy","bisharp",1,"Siniestro","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","626","xy","bouffalant",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","627","xy","rufflet",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","628","xy","braviary",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","629","xy","vullaby",0,"Siniestro","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","630","xy","mandibuzz",1,"Siniestro","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","631","xy","heatmor",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","632","xy","durant",0,"Bicho","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","633","xy","deino",0,"Siniestro","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","634","xy","zweilous",1,"Siniestro","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","635","xy","hydreigon",2,"Siniestro","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","636","xy","larvesta",0,"Bicho","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","637","xy","volcarona",1,"Bicho","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","638","xy","cobalion",2,"Acero","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","639","xy","terrakion",2,"Roca","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","640","xy","virizion",2,"Planta","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","641","xy","tornadus",2,"Volador","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","641t","xy","tornadus-therian",2,"Volador","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","642","xy","thundurus",2,"Electrico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","642t","xy","thundurus-therian",2,"Electrico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","643","xy","reshiram",2,"Dragon","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","644","xy","zekrom",2,"Dragon","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","645","xy","landorus",2,"Tierra","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","645t","xy","landorus-therian",2,"Tierra","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","646","xy","kyurem",2,"Dragon","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","646b","xy","kyurem-white",2,"Dragon","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","646n","xy","kyurem-black",2,"Dragon","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","647","xy","keldeo",2,"Agua","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","647r","xy","keldeo-resolute",2,"Agua","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","648l","xy","meloetta",2,"Normal","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","648d","xy","meloetta-pirouette",2,"Normal","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"5","649","xy","genesect",2,"Bicho","Acero");
	
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","650","xy","chespin",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","651","xy","quilladin",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","652","xy","chesnaught",2,"Planta","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","653","xy","fennekin",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","654","xy","braixen",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","655","xy","delphox",2,"Fuego","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","656","xy","froakie",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","657","xy","frogadier",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","658","xy","greninja",2,"Agua","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","659","xy","bunnelby",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","660","xy","diggersby",1,"Normal","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","661","xy","fletchling",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","662","xy","fletchinder",1,"Fuego","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","663","xy","talonflame",2,"Fuego","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","664","xy","scatterbug",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","665","xy","spewpa",1,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","666","xy","vivillon",2,"Bicho","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","667","xy","litleo",0,"Fuego","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","668","xy","pyroar",1,"Fuego","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","668f","xy","pyroar-f",1,"Fuego","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","669r","xy","flabebe",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","669y","xy","flabebe-yellow",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","669o","xy","flabebe-orange",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","669b","xy","flabebe-blue",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","669w","xy","flabebe-white",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","670r","xy","floette",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","670y","xy","floette-yellow",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","670o","xy","floette-orange",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","670b","xy","floette-blue",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","670w","xy","floette-white",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","671r","xy","florges",2,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","671y","xy","florges-yellow",2,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","671o","xy","florges-orange",2,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","671b","xy","florges-blue",2,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","671w","xy","florges-white",2,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","672","xy","skiddo",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","673","xy","gogoat",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","674","xy","pancham",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","675","xy","pangoro",1,"Lucha","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","676","xy","furfrou",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","677","xy","espurr",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","678","xy","meowstic",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","678f","xy","meowstic-f",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","679","xy","honedge",0,"Acero","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","680","xy","doublade",1,"Acero","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","681","xy","aegislash",2,"Acero","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","681b","xy","aegislash-blade",2,"Acero","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","682","xy","spritzee",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","683","xy","aromatisse",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","684","xy","swirlix",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","685","xy","slurpuff",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","686","xy","inkay",0,"Siniestro","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","687","xy","malamar",1,"Siniestro","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","688","xy","binacle",0,"Roca","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","689","xy","barbaracle",1,"Roca","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","690","xy","skrelp",0,"Veneno","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","691","xy","dragalge",1,"Veneno","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","692","xy","clauncher",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","693","xy","clawitzer",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","694","xy","helioptile",0,"Electrico","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","695","xy","heliolisk",1,"Electrico","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","696","xy","tyrunt",0,"Roca","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","697","xy","tyrantrum",1,"Roca","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","698","xy","amaura",0,"Roca","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","699","xy","aurorus",1,"Roca","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","700","xy","sylveon",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","701","xy","hawlucha",0,"Lucha","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","702","xy","dedenne",0,"Electrico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","703","xy","carbink",0,"Roca","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","704","xy","goomy",0,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","705","xy","sliggoo",1,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","706","xy","goodra",2,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","707","xy","klefki",0,"Acero","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","708","xy","phantump",0,"Fantasma","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","709","xy","trevenant",1,"Fantasma","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","710","xy","pumpkaboo",0,"Fantasma","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","711","xy","gourgeist",1,"Fantasma","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","712","xy","bergmite",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","713","xy","avalugg",1,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","714","xy","noibat",0,"Volador","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","715","xy","noivern",1,"Volador","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","716","xy","xerneas",2,"Hada","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","717","xy","yveltal",2,"Siniestro","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","718","xy","zygarde",2,"Dragon","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","719","xy","diancie",2,"Roca","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","719m","rze","diancie-mega",2,"Roca","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","720","xy","hoopa",2,"Psiquico","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","720u","rze","hoopa-unbound",2,"Psiquico","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"6","721","xy","volcanion",2,"Fuego","Agua");
	
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","722","sl","rowlet",0,"Planta","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","723","sl","dartrix",1,"Planta","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","724","sl","decidueye",2,"Planta","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","725","sl","litten",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","726","sl","torracat",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","727","sl","incineroar",2,"Fuego","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","728","sl","popplio",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","729","sl","brionne",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","730","sl","primarina",2,"Agua","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","731","sl","pikipek",0,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","732","sl","trumbeak",1,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","733","sl","toucannon",2,"Normal","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","734","sl","yungoos",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","735","sl","gumshoos",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","736","sl","grubbin",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","737","sl","charjabug",1,"Bicho","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","738","sl","vikavolt",2,"Bicho","Electrico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","739","sl","crabrawler",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","740","sl","crabominable",1,"Lucha","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","741","sl","oricorio",0,"Fuego","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","741e","sl","oricorio-pompom",0,"Electrico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","741p","sl","oricorio-pau",0,"Psiquico","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","741f","sl","oricorio-sensu",0,"Fantasma","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","742","sl","cutiefly",0,"Bicho","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","743","sl","ribombee",1,"Bicho","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","744","sl","rockruff",0,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","745","sl","lycanroc",1,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","745m","sl","lycanroc-midnight",1,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","745c","usul","lycanroc-dusk",1,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","746","sl","wishiwashi",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","746s","sl","wishiwashi-school",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","747","sl","mareanie",0,"Veneno","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","748","sl","toxapex",1,"Veneno","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","749","sl","mudbray",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","750","sl","mudsdale",1,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","751","sl","dewpider",0,"Agua","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","752","sl","araquanid",1,"Agua","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","753","sl","fomantis",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","754","sl","lurantis",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","755","sl","morelull",0,"Planta","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","756","sl","shiinotic",1,"Planta","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","757","sl","salandit",0,"Veneno","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","758","sl","salazzle",1,"Veneno","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","759","sl","stufful",0,"Normal","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","760","sl","bewear",1,"Normal","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","761","sl","bounsweet",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","762","sl","steenee",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","763","sl","tsareena",2,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","764","sl","comfey",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","765","sl","oranguru",0,"Normal","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","766","sl","passimian",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","767","sl","wimpod",0,"Bicho","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","768","sl","golisopod",1,"Bicho","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","769","sl","sandygast",0,"Fantasma","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","770","sl","palossand",1,"Fantasma","Tierra");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","771","sl","pyukumuku",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","772","sl","typenull",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","773","sl","silvally",2,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774m","sl","minior",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774a","sl","minior-red",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774b","sl","minior-orange",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774c","sl","minior-yellow",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774d","sl","minior-green",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774e","sl","minior-blue",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774f","sl","minior-indigo",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","774g","sl","minior-violet",0,"Roca","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","775","sl","komala",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","776","sl","turtonator",0,"Fuego","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","777","sl","togedemaru",0,"Electrico","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","778","sl","mimikyu",0,"Fantasma","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","779","sl","bruxish",0,"Agua","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","780","sl","drampa",0,"Normal","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","781","sl","dhelmise",0,"Fantasma","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","782","sl","jangmo-o",0,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","783","sl","hakamo-o",1,"Dragon","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","784","sl","kommo-o",2,"Dragon","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","785","sl","tapukoko",2,"Electrico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","786","sl","tapulele",2,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","787","sl","tapubulu",2,"Planta","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","788","sl","tapufini",2,"Agua","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","789","sl","cosmog",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","790","sl","cosmoem",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","791","sl","solgaleo",2,"Psiquico","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","792","sl","lunala",2,"Psiquico","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","793","sl","nihilego",2,"Roca","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","794","sl","buzzwole",2,"Bicho","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","795","sl","pheromosa",2,"Bicho","Lucha");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","796","sl","xurkitree",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","797","sl","celesteela",2,"Acero","Volador");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","798","sl","kartana",2,"Planta","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","799","sl","guzzlord",2,"Siniestro","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","800","sl","necrozma",2,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","800c","usul","necrozma-duskmane",2,"Psiquico","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","800a","usul","necrozma-dawnwings",2,"Psiquico","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","800u","usul","necrozma-ultra",2,"Psiquico","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","801","sl","magearna",2,"Acero","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","801p","sl","magearna-pokeball",2,"Acero","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","802","sl","marshadow",2,"Lucha","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","803","sl","poipole",2,"Veneno","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","804","sl","naganadel",2,"Veneno","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","805","usul","stakataka",2,"Roca","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","806","usul","blacephalon",2,"Fuego","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","807","usul","zeraora",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","808","ee","meltan",1,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"7","809","ee","melmetal",2,"Acero","Null");
	
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","810","ee","grookey",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","811","ee","thwackey",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","812","ee","rillaboom",2,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","813","ee","scorbunny",0,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","814","ee","raboot",1,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","815","ee","cinderace",2,"Fuego","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","816","ee","sobble",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","817","ee","drizzile",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","818","ee","inteleon",2,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","819","ee","skwovet",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","820","ee","greedent",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","821","ee","rookidee",0,"Volador","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","822","ee","corvisquire",1,"Volador","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","823","ee","corviknight",2,"Volador","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","824","ee","blipbug",0,"Bicho","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","825","ee","dottler",1,"Bicho","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","826","ee","orbeetle",2,"Bicho","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","827","ee","nickit",0,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","828","ee","thievul",1,"Siniestro","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","829","ee","gossifleur",0,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","830","ee","eldegoss",1,"Planta","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","831","ee","wooloo",0,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","832","ee","dubwool",1,"Normal","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","833","ee","chewtle",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","834","ee","drednaw",1,"Agua","Roca");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","835","ee","yamper",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","836","ee","boltund",1,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","837","ee","rolycoly",0,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","838","ee","carkol",1,"Roca","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","839","ee","coalossal",2,"Roca","Fuego");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","840","ee","applin",0,"Planta","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","841","ee","flapple",1,"Planta","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","842","ee","appletun",1,"Planta","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","843","ee","silicobra",0,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","844","ee","sandaconda",1,"Tierra","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","845","ee","cramorant",0,"Volador","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","846","ee","arrokuda",0,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","847","ee","barraskewda",1,"Agua","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","848","ee","toxel",0,"Electrico","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","849","ee","toxtricity",1,"Electrico","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","849l","ee","toxtricity-lowkey",1,"Electrico","Veneno");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","850","ee","sizzlipede",0,"Fuego","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","851","ee","centiskorch",1,"Fuego","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","852","ee","clobbopus",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","853","ee","grapploct",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","854","ee","sinistea",0,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","855","ee","polteageist",1,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","856","ee","hatenna",0,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","857","ee","hattrem",1,"Psiquico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","858","ee","hatterene",2,"Psiquico","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","859","ee","impidimp",0,"Siniestro","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","860","ee","morgrem",1,"Siniestro","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","861","ee","grimmsnarl",2,"Siniestro","Hada");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","862","ee","obstagoon",2,"Siniestro","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","863","ee","perrserker",1,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","864","ee","cursola",1,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","865","ee","sirfetchd",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","866","ee","mr._rime",2,"Hielo","Psiquico");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","867","ee","runerigus",1,"Tierra","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","868","ee","milcery",0,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","869","ee","alcremie",1,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","870","ee","falinks",0,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","871","ee","pincurchin",0,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","872","ee","snom",0,"Hielo","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","873","ee","frosmoth",1,"Hielo","Bicho");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","874","ee","stonjourner",0,"Roca","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","875","ee","eiscue",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","875d","ee","eiscue-noice",0,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","876","ee","indeedee",0,"Psiquico","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","876f","ee","indeedee-female",0,"Psiquico","Normal");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","877","ee","morpeko",0,"Electrico","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","877h","ee","morpeko-hangry",0,"Electrico","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","878","ee","cufant",0,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","879","ee","copperajah",1,"Acero","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","880","ee","dracozolt",0,"Electrico","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","881","ee","arctozolt",0,"Electrico","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","882","ee","dracovish",0,"Agua","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","883","ee","arctovish",0,"Agua","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","884","ee","duraludon",0,"Acero","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","885","ee","dreepy",0,"Dragon","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","886","ee","drakloak",1,"Dragon","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","887","ee","dragapult",2,"Dragon","Fantasma");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","888","ee","zacian",2,"Hada","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","888e","ee","zacian-crowned",2,"Hada","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","889","ee","zamazenta",2,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","889e","ee","zamazenta-crowned",2,"Lucha","Acero");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","890","ee","eternatus",2,"Veneno","Dragon");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","891","ee","kubfu",1,"Lucha","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","892","ee","urshifu",2,"Lucha","Siniestro");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","892a","ee","urshifu-1",2,"Lucha","Agua");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","893","ee","zarude",2,"Siniestro","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","894","ee","regieleki",2,"Electrico","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","895","ee","regidrago",2,"Dragon","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","896","ee","glastrier",2,"Hielo","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","897","ee","spectrier",2,"Fantasma","Null");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","898","ee","calyrex",2,"Psiquico","Planta");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","898h","ee","calyrex-1",2,"Psiquico","Hielo");
	if (_ret == null) _ret = stepIndexUrlTipos(_i,_url,"8","898f","ee","calyrex-2",2,"Psiquico","Fantasma");
	
	return _ret;
}

// Gestiones auxiliares para la base de datos de pokes.
function stepIndexUrlTipos(_i,_url,_gen,_iCheck,_urlType,_urlCheck,_iStage,_iTipo1,_iTipo2)
{
	// Casos generales.
	var _str = "";
	if (_urlType == "xy") _str = "https://www.pkparaiso.com/imagenes/xy/sprites/animados/";
	else if (_urlType == "rze") _str = "https://www.pkparaiso.com/imagenes/rubi-omega-zafiro-alfa/sprites/animados/";
	else if (_urlType == "sl") _str = "https://www.pkparaiso.com/imagenes/sol-luna/sprites/animados/";
	else if (_urlType == "usul") _str = "https://www.pkparaiso.com/imagenes/ultra_sol_ultra_luna/sprites/animados-sinbordes/";
	else if (_urlType == "ee") _str = "https://www.pkparaiso.com/imagenes/espada_escudo/sprites/animados-bordeados/";
	var _urlFinal = _str + _urlCheck + ".gif";
	
	// Casos auxiliares.
	if (_iCheck == "803") _urlFinal = "https://static.wikia.nocookie.net/espokemon/images/b/b7/Poipole_USUL.gif";
	else if (_iCheck == "804") _urlFinal = "https://static.wikia.nocookie.net/espokemon/images/1/12/Naganadel_USUL.gif";
	
	if (_url != null && _url == _urlFinal) return [_gen,_iCheck,_iStage,_iTipo1,_iTipo2];
	else if (_i != null && _i == _iCheck) return [_gen,_urlFinal,_iStage,_iTipo1,_iTipo2];
	else return null;
}

// db
function db(_txt)
{
	console.log(_txt);
}

// db
function db(_txt,_val)
{
	console.log(_txt,_val);
}

















