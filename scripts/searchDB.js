let hledat = document.getElementById("FButton");
let req = document.getElementById("q");

let answs = document.getElementById("answer");
let answsMap = document.getElementById("answerMap");

let zDruh = document.getElementById("zDruh");
let okres = document.getElementById("okres");

let uFiltr = document.getElementById("filtr");

let pocetVysl = document.getElementById("pVys");

let vyslCount = 0;

let arrPoints;


let strankaArr = [];
let stranky = [];
let aktivniStranka = 0;
let pocetZapisu = [0, 0];


let dalsi = document.getElementById("dalsi");
let predchozi = document.getElementById("predchozi");
let tento = document.getElementById("aktualni");
fetch('https://services6.arcgis.com/ogJAiK65nXL1mXAW/arcgis/rest/services/Seznam_škol_a_školských_zařízení/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson')
    .then(function (response) {
        return response.json();
    })
    .then(function (data1) {

        fetch('https://services6.arcgis.com/ogJAiK65nXL1mXAW/arcgis/rest/services/Knihovny/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson')
            .then(function (response1) {
                return response1.json();
            }).then(function (data2) {

                let data1f = data1.features;
                let data2f = data2.features;
                let data = [...new Set([...data1f, ...data2f])];

                fillLists(data);

                hledat.addEventListener('click', event => {
                    ClearArrays();

                    if (answs != null) {
                        while (answs.firstChild) {
                            answs.firstChild.remove()
                        }
                    }
                    else {
                        while (answsMap.firstChild) {
                            answsMap.firstChild.remove()
                        }
                    }

                    vyslCount = 0;
                    let kSlova = req.value.split(" ");

                    let pod = ['nazev', 'zarizeni_druh', 'nazev_okresu', 'nazev_obce', 'nazev_ulice'];

                    data.forEach(element => {
                        let found = false;
                        pod.forEach(el => {
                            if (!found) {

                                if (toNormalForm(element.properties[el]).toLowerCase().includes(toNormalForm(kSlova[0]).toLowerCase())) {

                                    if (checkFiltr(element) && checkElement(element, pod, kSlova)) {
                                        found = true;

                                        vyslCount++;

                                        if (answs != null) {
                                            if (pocetZapisu[0] <= 11) {
                                                let newDom = document.createElement("div");
                                                newDom.style.cursor = "pointer";
                                                newDom.id = "skolaAns";
                                                newDom.value = element.properties["OBJECTID"];
                                                newDom.style.color = "White";


                                                let mapB = document.createElement("button");
                                                mapB.className = "mapB";
                                                mapB.textContent = "mapa ->"

                                                mapB.addEventListener('click', event => {
                                                    event.stopPropagation();
                                                    window.location.href='../html/Mapa.html' + "?nazev=" + element.properties.nazev;
                                                })

                                                newDom.appendChild(mapB);


                                                let nadpis_ = document.createElement("z");
                                                nadpis_.textContent = element.properties["nazev"].split(',')[0];
                                                newDom.append(nadpis_, document.createElement("br"));

                                                let newzarizenidruh = document.createElement("z");
                                                newzarizenidruh.textContent = element.properties["zarizeni_druh"];
                                                newDom.append(newzarizenidruh, document.createElement("br"));

                                                let mesto = document.createElement("z");
                                                mesto.textContent = element.properties["nazev_obce"];
                                                newDom.append(mesto, document.createElement("br"));

                                                let ulice = document.createElement("z");
                                                ulice.textContent = element.properties["nazev_ulice"];
                                                newDom.append(ulice, " ");

                                                let cisloPSC = document.createElement("z");
                                                cisloPSC.textContent = element.properties["cislo_domovni"] + ", " + element.properties["psc"];
                                                newDom.append(cisloPSC);



                                                strankaArr.push(newDom);
                                                if (pocetZapisu[1] == 0) {
                                                    answs.append(newDom);
                                                }

                                                if (pocetZapisu[0] == 11) {
                                                    pocetZapisu[0] = 0;
                                                    pocetZapisu[1] += 1;
                                                    stranky.push(strankaArr);
                                                    strankaArr = [];
                                                }
                                                else {
                                                    pocetZapisu[0]++;
                                                }

                                                if (element.properties["www"] != null) {
                                                    addClickHref(newDom, element.properties["www"]);
                                                    tento.textContent = aktivniStranka + 1;
                                                }
                                                else {
                                                    addClickHref(newDom, "http://google.com/search?q=" + element.properties["nazev"] + ", " +
                                                    element.properties["nazev_obce"] );
                                                }
                                            }
                                        }
                                        else {
                                            arrPoints.push(element.geometry.coordinates);
                                            let newDom = document.createElement("p");
                                            newDom.textContent = element.properties["nazev"].toString();
                                            newDom.value = element.properties["OBJECTID"];
                                            newDom.className = "ansMap";
                                            newDom.style.color = "white";
                                            newDom.style.cursor = "pointer"
                                            answsMap.appendChild(newDom);

                                            addClickFunctionOnAns(newDom, element.geometry.coordinates);
                                        }

                                    }
                                }
                            }
                        })
                        found = false;
                    });
                    stranky.push(strankaArr);

                    if (answsMap != null) {
                        addAnsONMP(arrPoints);
                    }

                    if (pocetVysl != null) {
                        pocetVysl.textContent = "Výsledky (" + vyslCount.toString() + ")";
                    }
                })
            });

    })

function addClickHref(newDom, odkaz) {
    newDom.addEventListener('click', event => {
        window.open(odkaz);
    });
}

function checkFiltr(element) {

    if (req.value == "" && zDruh.value == "" && okres.value == "") {
        return true;
    }

    if (element.properties.typ_knihovny == null &&
        toNormalForm(element.properties.nazev_okresu).toLowerCase().includes(toNormalForm(okres.value).toLowerCase()) &&
        toNormalForm(element.properties.zarizeni_druh).toLowerCase().includes(toNormalForm(zDruh.value).toLowerCase())) {
        return true;
    }
    else if (element.properties.typ_knihovny != null &&
        toNormalForm(element.properties.nazev).toLowerCase().includes(toNormalForm(zDruh.value).toLowerCase()) &&
        toNormalForm(element.properties.nazev_okresu).toLowerCase().includes(toNormalForm(okres.value).toLowerCase())) {
        return true;
    }

    return false;
}
function fillLists(data) {
    let nDruh = [], nOkres = [];

    nDruh.push("");
    nOkres.push("");

    data.forEach(element => {
        if (!nDruh.includes(element.properties.zarizeni_druh) && element.properties.zarizeni_druh != undefined) {
            nDruh.push(element.properties.zarizeni_druh);
        }
        if (!nOkres.includes(element.properties.nazev_okresu)) {
            nOkres.push(element.properties.nazev_okresu);
        }
    })

    nDruh.push('Knihovna');

    nDruh.forEach(element => {
        var opt = document.createElement('option');
        opt.value = element;
        opt.innerHTML = element;
        zDruh.appendChild(opt);
    })
    nOkres.forEach(element => {
        var opt = document.createElement('option');
        opt.value = element;
        opt.innerHTML = element;
        okres.appendChild(opt);
    })
}

function checkElement(el, prop, reqQ) {

    if (req.value == "" && zDruh.value == "" && okres.value == "") {
        return true;
    }

    if (el.properties.typ_knihovny == null) {
        let found = false;

        let pocetSlov = 0;

        reqQ.forEach(slovo => {
            prop.forEach(prr => {
                if (toNormalForm(el.properties[prr]).toLowerCase().includes(toNormalForm(slovo).toLowerCase()) && !found) {
                    pocetSlov++;
                    found = true
                }
            })
            found = false;
        })

        if (pocetSlov == reqQ.length) {
            return true;
        }
        else {
            return false;
        }
    }
    else {

        prop = ['nazev', 'typ_knihovny', 'nazev_okresu', 'nazev_obce', 'nazev_ulice']
        let found = false;

        let pocetSlov = 0;

        reqQ.forEach(slovo => {
            prop.forEach(prr => {
                if (toNormalForm(el.properties[prr]).toLowerCase().includes(toNormalForm(slovo).toLowerCase()) && !found) {
                    pocetSlov++;
                    found = true;
                }
                if (toNormalForm(el.properties[prr]).toLowerCase().includes(toNormalForm(slovo).toLowerCase()) && !found) {

                }
            })
            found = false;
        })

        if (pocetSlov == reqQ.length) {
            return true;
        }
        else {
            return false;
        }
    }
}

function toNormalForm(str) {
    if (str == '' || str == undefined) {
        return '';
    }
    else {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
function Previous() {
    if (aktivniStranka - 1 < 0) { return; }

    aktivniStranka--;
    strankaArr = stranky[aktivniStranka];
    DeleteAndPrintAnswer();
}
function Next() {
    if (aktivniStranka + 1 > stranky.length - 1) { return; }

    aktivniStranka++;
    strankaArr = stranky[aktivniStranka];
    DeleteAndPrintAnswer();
}
function ClearArrays() {
    StrankaArr = [];
    stranky = [];
    aktivniStranka = 0;
    pocetZapisu = [0, 0];
    arrPoints = [];
}
function DeleteAndPrintAnswer() {
    while (answs.firstChild) {
        answs.firstChild.remove()
    }
    strankaArr.forEach(element => {
        answs.appendChild(element);
    })
    tento.textContent = aktivniStranka + 1;
}

