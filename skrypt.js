var aktyTab = new Array();
var aktyLista = new Array(); 
var dniTab = new Array();

var MAX_GODZ = 50;
var iloscMin  = 0;

function AktywnoscRodzaj(nazwa, iloscMinCalk, dlAkty)
{
	this.nazwa = nazwa;
	this.iloscMinCalk = iloscMinCalk;
	this.dlAkty = dlAkty;
}

function Aktywnosc(nazwa, dlAkty)
{
	this.nazwa = nazwa;
	this.dlAkty = dlAkty;				
}

function Dzien(nazwa)
{
	this.nazwa = nazwa;
	this.lokListaAkty = new Array();
	this.dlCalk = 0;

	this.dodajAktyD = function(akty){

		this.lokListaAkty.push(akty);
		this.dlCalk += akty.dlAkty;
	}
}

function dodaj()
{				
	var newName = document.getElementById("nazwaTxtArea").value;
	var iloscMinCalk = parseInt(60*document.getElementById("iloscGodzTxtArea").value);
	var dlAkty = parseInt(document.getElementById("dlAktyTxtArea").value);

	if(newName != "" && iloscMinCalk != "" && dlAkty != 0)
	{
		var czyIstnieje = sprawdzCzyIstnieje(newName);
		if(czyIstnieje == false)
		{
			var nowaAktywnosc = new AktywnoscRodzaj(newName, iloscMinCalk, dlAkty);
			aktyTab.push(nowaAktywnosc);

			var newMember = document.createElement("p");
			newMember.appendChild(document.createTextNode(newName));

			var newLine = document.createElement("li");
			newLine.appendChild(newMember);
			document.getElementById("listaAkty").appendChild(newLine);	
		}					
	}
	else
	{
		alert("Wszystkie pola muszą być wypełnione");
	}
}

function dodajAkty(akty, kolumna)
{
	var pos = akty.rozpo;
	var dl = (akty.dlAkty * 0.767 - 1);
 	
  	var x = akty.nazwa[0].toLowerCase().charCodeAt(0);
	var y = akty.nazwa[akty.nazwa.length-1].toLowerCase().charCodeAt(0);;
	var z = akty.nazwa[Math.floor(akty.nazwa.length/2)].toLowerCase().charCodeAt(0);;

	var stringX = losujKolor(x);
	var stringY = losujKolor(y);
	var stringZ = losujKolor(z);

	var newLine = document.createElement("div");
	newLine.style.height = dl + "px";
	newLine.style.background = "#" + stringY + stringX + stringZ;
	newLine.style.position = "relative";
	newLine.style.borderBottom = "#000000 1px solid";

	newLine.appendChild(document.createTextNode(akty.nazwa));
	document.getElementById(kolumna).appendChild(newLine);	
}

function losujKolor(skladowa)
{
	skladowa -= 87;
	skladowa = skladowa/35*255;	
	skladowa = Math.round(skladowa);

	var stringSkladowa = skladowa.toString(16);
	
	if(skladowa < 16){
		stringSkladowa = "0" + skladowa.toString(16);
	}	

	return stringSkladowa;
}

function sprawdzCzyIstnieje(newName)
{
	for(var i = 0; i < aktyTab.length; i++)
	{
		if(aktyTab[i].nazwa == newName)	
			return true;
	}
	return false;
}

function wyczyscWszystko()
{
	czyscHarm();
	czyscZm();
	dniTab = [];
}

function generujTabele()
{
	console.log("generujTabele()");
	czyscHarm();
	generujListe();
	sortujAktyTab();
	sortujAktyLista();		
	przydzielAkty();
	generujHarm();
	sortujAktyLista();
	czyscZm();
}

	function czyscHarm()
	{
		var la = document.getElementById("kolPON");
		while (la.hasChildNodes()) {
	    	la.removeChild(la.firstChild);
		}

		var la = document.getElementById("kolWT");
		while (la.hasChildNodes()) {
	    	la.removeChild(la.firstChild);
		}

		var la = document.getElementById("kolSR");
		while (la.hasChildNodes()) {
	    	la.removeChild(la.firstChild);
		}

		var la = document.getElementById("kolCZW");
		while (la.hasChildNodes()) {
	    	la.removeChild(la.firstChild);
		}

		var la = document.getElementById("kolPT");
		while (la.hasChildNodes()) {
	    	la.removeChild(la.firstChild);
		}
	}	

	function generujListe()
	{
		var dl = aktyTab.length;		
		for(var i = 0; i < dl; i++)
		{
			var aktyRodzaj = aktyTab.shift();
			while(aktyRodzaj.iloscMinCalk - aktyRodzaj.dlAkty >= 0)
			{
				aktyRodzaj.iloscMinCalk -= aktyRodzaj.dlAkty;
				var nowaAkty = new Aktywnosc(aktyRodzaj.nazwa, aktyRodzaj.dlAkty);
				aktyLista.push(nowaAkty);
			}
			if(aktyRodzaj.iloscMinCalk > 0){
				var nowaAkty = new Aktywnosc(aktyRodzaj.nazwa, aktyRodzaj.iloscMinCalk);
				aktyLista.push(nowaAkty);
			}
		}			
	}	

	function sortujAktyTab()
	{
		console.log("sortujAktyTab()");
		for(var i = 0; i < aktyTab.length; i++)
		{
			var maks = 0;
			var index = i;
			for(var j = i; j < aktyTab.length; j++)
			{
				if(aktyTab[j].iloscMinCalk > aktyTab[index].iloscMinCalk)
				{							
					index = j;
					maks = aktyTab[index];
				}						
			}
			if(index > i)
			{
				zamienMiejscami(i, index);
			}
		}
	}

	function sortujAktyLista()
	{
		console.log("sortujAktyLista()");
		for(var i = 0; i < aktyLista.length; i++)
		{
			var maks = 0;
			var index = i;
			for(var j = i; j < aktyLista.length; j++)
			{
				if(aktyLista[j].dlAkty > aktyLista[index].dlAkty)
				{							
					index = j;
					maks = aktyLista[index];
				}						
			}
			if(index > i)
			{
				zamienMiejscami(i, index);
			}
		}

	}

	function przydzielAkty()
	{
		console.log("przydzielAkty()");

		initDniTab();
		for(var i = 0; i < aktyLista.length; i++)
		{
			iloscMin = iloscMin + parseInt(aktyLista[i].dlAkty);
			console.log("iloscMin = " + iloscMin);
			if(iloscMin <= MAX_GODZ*60){
				var indexMin = 0;
				for(var j = 1; j < 5; j++)
				{
					console.log(j + " " + dniTab[j].dlCalk + " < " + dniTab[indexMin].dlCalk);
					if(dniTab[j].dlCalk < dniTab[indexMin].dlCalk)					
						indexMin = j;								
				}
				console.log("indexMin = " + indexMin);
				dniTab[indexMin].dodajAktyD(aktyLista[i]);
				console.log("DL = " + dniTab[indexMin].dlCalk);
			}			
			else{				
				alert("Przekroczono rozmiar harmonogramu.");
				break;
			}
			
		}
	}
		function initDniTab()
		{			
			dniTab.push(new Dzien("PON"));
			dniTab.push(new Dzien("WT"));
			dniTab.push(new Dzien("SR"));
			dniTab.push(new Dzien("CZWT"));
			dniTab.push(new Dzien("PT"));
		}

	function generujHarm()
	{
		for(var i = 0; i < 5; i++)
		{
			for(var j = 0; j < dniTab[i].lokListaAkty.length; j++ )
			{
				switch(i)
				{
					case 0:
						dodajAkty(dniTab[i].lokListaAkty[j], "kolPON");
					break;
					case 1:
						dodajAkty(dniTab[i].lokListaAkty[j], "kolWT");
					break;
					case 2:
						dodajAkty(dniTab[i].lokListaAkty[j], "kolSR");
					break;
					case 3:
						dodajAkty(dniTab[i].lokListaAkty[j], "kolCZW");
					break;
					case 4:
						dodajAkty(dniTab[i].lokListaAkty[j], "kolPT");
					break;
				}				
			}
		}
	}

	function czyscZm()
	{
		aktyTab = [];
		aktyLista = [];
		//dniTab = [];
		var la = document.getElementById("listaAkty");
		while (la.hasChildNodes()) {
	    	la.removeChild(la.firstChild);
		}
	}

function wyswietlTablice(tab)
{
	for(var i = 0; i < tab.length; i++)
	{
		console.log(tab[i].nazwa);
	}
}

function zamienMiejscami(i, j)
{
	var x = aktyTab[i];
	aktyTab[i] = aktyTab[j];
	aktyTab[j] = x;
}
