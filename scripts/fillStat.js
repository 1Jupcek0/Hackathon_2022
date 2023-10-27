let pocetVseho = [
    ["mater", 'zakl', "stred", "vys", "intr", "domML", "dumDaM", "knih"],
    [0, 0, 0, 0, 0, 0, 0, 0]
]
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

                let nDruh = ["Mateřská škola", "Základní škola", "Střední škola", "Vyšší odborná škola", "Internát", "Domov mládeže", "Dům dětí a mládeže"];

                nDruh = toNormalStrArr(nDruh);

                data.forEach(element => {
                    console.log(element.properties);
                    if (element.properties.typ_knihovny != null) {
                        pocetVseho[1][7]++;
                    }
                    else if (nDruh.includes(toNormalForm(element.properties.zarizeni_druh).toLowerCase())) {
                        switch (toNormalForm(element.properties.zarizeni_druh).toLowerCase()) {

                            case nDruh[0]:
                                pocetVseho[1][0]++;
                                break;

                            case nDruh[1]:
                                pocetVseho[1][1]++;
                                break;

                            case nDruh[2]:
                                pocetVseho[1][2]++;
                                break;

                            case nDruh[3]:
                                pocetVseho[1][3]++;
                                break;

                            case nDruh[4]:
                                pocetVseho[1][4]++;
                                break;

                            case nDruh[5]:
                                pocetVseho[1][5]++;
                                break;

                            case nDruh[6]:
                                pocetVseho[1][6]++;
                                break;

                            default:
                                break;
                        }
                    }
                })
                document.getElementById("materske").textContent = pocetVseho[1][0] + " Mateřských škol";
                document.getElementById("zakladni").textContent = pocetVseho[1][1] + " Základních škol";
                document.getElementById("stredni").textContent = pocetVseho[1][2] + " Středních škol";
                document.getElementById("vysoke").textContent = pocetVseho[1][3] + " Vysokých škol";
                document.getElementById("internaty").textContent = pocetVseho[1][4] + pocetVseho[1][5] + pocetVseho[1][6] + " Internátů";
                document.getElementById("knihovny").textContent = pocetVseho[1][7] + " Knihoven";

            })
    })


function toNormalStrArr(nDruh) {

    let nArr = nDruh;

    for (let i = 0; i < nDruh.length; i++) {
        nArr[i] = toNormalForm(nDruh[i]).toLowerCase();
    }

    return nArr;
}