
// --------------------------------     CALCUL DES DEPERDITION     -----------------------------------------------------------------------------------

function calculateWallLoss() {
    // Get values from the form
    const surfaceRDC = parseFloat(document.getElementById("Surface_RDC").value) || 0;
    const surface1stFloor = parseFloat(document.getElementById("Surface_1er_etage").value) || 0;
    const surface2ndFloor = parseFloat(document.getElementById("Surface_2e_etage").value) || 0;
    const HSPRDC = parseFloat(document.getElementById("HSP_RDC").value) || 0;
    const HSP1stFloor = parseFloat(document.getElementById("HSP_1er_etage").value) || 0;
    const HSP2ndFloor = parseFloat(document.getElementById("HSP_2e_etage").value) || 0;
    const buildingType = document.getElementById("Structure_de_la_construction").value;
    const vitragePercentage = parseFloat(document.getElementById("Surface_de_vitrage").value) || 0;
    const mitoyennete = document.getElementById("Mitoyennete").value;
    const constructionYear = document.getElementById("Annee_de_construction").value;
    // U-value based on the year of construction
    let U_value;
    switch(constructionYear) {
        case "Avant 1974": U_value = 2.5; break;
        case "De 1974 à 1980": U_value = 1.0; break;
        case "De 1981 à 1988": U_value = 0.8; break;
        case "De 1989 à 1999": U_value = 0.5; break;
        case "De 2000 à 2004": U_value = 0.47; break;
        case "De 2005 à 2012": U_value = 0.36; break;
        case "De 2013 à 2017": U_value = 0.27; break;
        default: U_value = 2.5;
        
    }

    // Calculate the length of a face (L) based on building type
    let L_RDC, L1, L2;
    let P_RDC, P1, P2;
    switch(buildingType) {
        case "Carré":
            L_RDC = Math.sqrt(surfaceRDC);
            L1 = Math.sqrt(surface1stFloor);
            L2 = Math.sqrt(surface2ndFloor);
            P_RDC = L_RDC * 4;
            P1 = L1 * 4;
            P2 = L2 * 4;
            break;
        case "Rectangulaire":
            L_RDC = Math.sqrt(surfaceRDC) * 0.707;
            L1 = Math.sqrt(surface1stFloor) * 0.707;
            L2 = Math.sqrt(surface2ndFloor) * 0.707;
            P_RDC = L_RDC * 6;
            P1 = L1 * 6;
            P2 = L2 * 6;
            break;
        case "Maison en L":
            L_RDC = Math.sqrt(surfaceRDC / 3);
            L1 = Math.sqrt(surface1stFloor / 3);
            L2 = Math.sqrt(surface2ndFloor / 3);
            P_RDC = L_RDC * 8;
            P1 = L1 * 8;
            P2 = L2 * 8;
            break;
        case "Maison en U":
            L_RDC = Math.sqrt(surfaceRDC / 6);
            L1 = Math.sqrt(surface1stFloor / 6);
            L2 = Math.sqrt(surface2ndFloor / 6);
            P_RDC = L_RDC * 12;
            P1 = L1 * 12;
            P2 = L2 * 12;
            break;
        default:
            L_RDC = L1 = L2 = 0;
            P_RDC = P1 = P2 = 0;
    }
    console.log("Forme de la maison:", buildingType);
    // Adjust for mitoyennete
    switch(mitoyennete) {
        case "1 côté":
            P_RDC -= L_RDC;
            P1 -= L1;
            P2 -= L2;
            break;
        case "2 côtés":
            P_RDC -= 2 * L_RDC;
            P1 -= 2 * L1;
            P2 -= 2 * L2;
            break;
        case "Non":
        // Ne fait rien, donc les valeurs de P_RDC, P1 et P2 restent inchangées
        break;
     default:
    }

    // Calculate surface area of walls for each floor
    const SMV_RDC = P_RDC * HSPRDC;
    const SMV1 = P1 * HSP1stFloor;
    const SMV2 = P2 * HSP2ndFloor;

    // Adjust for vitrage
    const adjustedSMV_RDC = SMV_RDC - (SMV_RDC * vitragePercentage / 100);
    const adjustedSMV1 = SMV1 - (SMV1 * vitragePercentage / 100);
    const adjustedSMV2 = SMV2 - (SMV2 * vitragePercentage / 100);

    // Calculate heat loss
    const heatLoss_RDC = adjustedSMV_RDC * U_value;
    const heatLoss1 = adjustedSMV1 * U_value;
    const heatLoss2 = adjustedSMV2 * U_value;

    // Total heat loss
    const totalHeatLoss = heatLoss_RDC + heatLoss1 + heatLoss2;
    console.log("Perte total mur", totalHeatLoss);

    return {
        totalHeatLoss: totalHeatLoss,
        SMV_RDC: SMV_RDC,
        SMV1: SMV1,
        SMV2: SMV2,
        adjustedSMV_RDC: adjustedSMV_RDC,
        adjustedSMV1: adjustedSMV1,
        adjustedSMV2: adjustedSMV2,
    };
}


//----------------------------------------------------------------------------------------------------------------


function calculateWindowLoss() {
    const wallLossData = calculateWallLoss();  // Récupération des données de la perte murale
    const vitrageType = document.getElementById("Vitrage").value;

    // Utilisation des valeurs retournées par calculateWallLoss
    const SMV_RDC = wallLossData.SMV_RDC;
    const SMV1 = wallLossData.SMV1;
    const SMV2 = wallLossData.SMV2;
    const adjustedSMV_RDC = wallLossData.adjustedSMV_RDC;
    const adjustedSMV1 = wallLossData.adjustedSMV1;
    const adjustedSMV2 = wallLossData.adjustedSMV2;

    // Calcul de la surface des fenêtres pour chaque étage
    const surfaceVitre_RDC = SMV_RDC - adjustedSMV_RDC;
    const surfaceVitre1 = SMV1 - adjustedSMV1;
    const surfaceVitre2 = SMV2 - adjustedSMV2;

    // Somme des surfaces des fenêtres pour tous les étages actifs
    let total_surfaceVitre = 0;
    if (SMV_RDC > 0) {
        total_surfaceVitre += surfaceVitre_RDC;
    }
    if (SMV1 > 0) {
        total_surfaceVitre += surfaceVitre1;
    }
    if (SMV2 > 0) {
        total_surfaceVitre += surfaceVitre2;
    }

    // Obtention de la valeur U en fonction du type de vitrage
    let U_value_window;
    switch(vitrageType) {
        case "SV Métal": U_value_window = 5.0; break;
        case "SV Bois/PVC": U_value_window = 4.5; break;
        case "DV Métal": U_value_window = 3.5; break;
        case "DV Bois/PVC": U_value_window = 3.2; break;
        case "DV Argon": U_value_window = 2.5; break;
        case "DV VIR": U_value_window = 2.0; break;
        case "DV RT2012": U_value_window = 1.2; break;
        default: U_value_window = 5.0;
    }

    // Calcul de la déperdition thermique des fenêtres
    const windowHeatLoss_RDC = surfaceVitre_RDC * U_value_window;
    const windowHeatLoss1 = surfaceVitre1 * U_value_window;
    const windowHeatLoss2 = surfaceVitre2 * U_value_window;

    // Déperdition thermique totale des fenêtres
    const totalWindowHeatLoss = windowHeatLoss_RDC + windowHeatLoss1 + windowHeatLoss2;
        console.log("Perte total fenetre", totalWindowHeatLoss);
        console.log("total_surfaceVitre:", total_surfaceVitre);
    return totalWindowHeatLoss;

}
//----------------------------------------------------------------------------------------------------------------


        function calculateRoofLoss() {
            // Obtenez la surface du RDC à partir du formulaire
            const surfaceRDC = parseFloat(document.getElementById("Surface_RDC").value) || 0;
            
            // Obtenez l'année de construction à partir du formulaire
            const constructionYear = document.getElementById("Annee_de_construction").value;

            // Valeur de U en fonction de l'année de construction
            let U_value;
            switch(constructionYear) {
                case "Avant 1974": U_value = 4.00; break;
                case "De 1974 à 1980": U_value = 1.00; break;
                case "De 1981 à 1988": U_value = 0.40; break;
                case "De 1989 à 1999": U_value = 0.25; break;
                case "De 2000 à 2004": U_value = 0.25; break; // !!!!!! VERIFIER LES VALEURS, ELLES SONT ETRANGE !!!!!!!!!!!!!
                case "De 2005 à 2012": U_value = 0.20; break;
                case "De 2013 à 2017": U_value = 0.18; break;
                case "Rénové": U_value = 0.30; break;
                default: U_value = 4.00;
            }

            // Calculer la déperdition thermique de la toiture
            const roofHeatLoss = surfaceRDC * U_value;
            console.log("Perte de chaleur par le toit : ", roofHeatLoss);
            return roofHeatLoss;
 }
 
//------------------------------------------------------------------------------------------------------------------------

    function calculateFloorLoss() {
        // Get RDC surface from the form
        const surfaceRDC = parseFloat(document.getElementById("Surface_RDC").value) || 0;

        // Get construction year from the form
        const constructionYear = document.getElementById("Annee_de_construction").value;

        // Get floor type from the form
        const floorType = document.getElementById("Structure_du_sol").value;

        // U-value based on construction year
        let U_value;
        switch(constructionYear) {
            case "Avant 1974": U_value = 2.00; break;
            case "De 1974 à 1980": U_value = 0.90; break;
            case "De 1981 à 1988": U_value = 0.70; break;
            case "De 1989 à 1999": U_value = 0.60; break;
            case "De 2000 à 2004": U_value = 0.43; break;
            case "De 2005 à 2012": U_value = 0.40; break;
            case "De 2013 à 2017": U_value = 0.36; break;
            case "Rénové": U_value = 1.20; break;
            default: U_value = 2.00;
        }

        // Tau value based on floor type
        let Tau_value;
        switch(floorType) {
            case "Une cave enterrée": Tau_value = 0.6; break;
            case "Une cave semi-enterrée": Tau_value = 0.7; break;
            case "Un vide sanitaire": Tau_value = 0.8; break;
            case "Terre plein": Tau_value = 0.3; break;
            default: Tau_value = 0.6;
        }

        // Calculate heat loss through the floor
        const floorHeatLoss = surfaceRDC * U_value * Tau_value;
        console.log("Floor heat loss: ", floorHeatLoss);
        return floorHeatLoss;
    }

     
//------------------------------------------------------------------------------------------------------------------------


function calculateAirNeufLoss() {
    // Get values from the form
    const surfaceRDC = parseFloat(document.getElementById("Surface_RDC").value) || 0;
    const surface1stFloor = parseFloat(document.getElementById("Surface_1er_etage").value) || 0;
    const surface2ndFloor = parseFloat(document.getElementById("Surface_2e_etage").value) || 0;
    const HSPRDC = parseFloat(document.getElementById("HSP_RDC").value) || 0;
    const HSP1stFloor = parseFloat(document.getElementById("HSP_1er_etage").value) || 0;
    const HSP2ndFloor = parseFloat(document.getElementById("HSP_2e_etage").value) || 0;
    const ventilationType = document.getElementById("Ventilation").value;

    // Calculate the volume for each floor
    const volumeRDC = surfaceRDC * HSPRDC;
    const volume1stFloor = surface1stFloor * HSP1stFloor;
    const volume2ndFloor = surface2ndFloor * HSP2ndFloor;

    // Calculate the total volume
    const totalVolume = volumeRDC + volume1stFloor + volume2ndFloor;
    console.log("Total Volume:", totalVolume);  // Console output for verification

    // Coefficient for air renewal based on ventilation type
    let coef;
    switch(ventilationType) {
        case "Ventilation naturelle": coef = 1.00; break;
        case "VMC simple flux": coef = 0.70; break;
        case "VMC hygro": coef = 0.50; break;
        case "Double flux": coef = 0.30; break;
        default: coef = 1.00;
    }

    // Calculate heat loss due to air renewal
    const airNeufLoss = (totalVolume * coef)*0.34;

    return airNeufLoss;
}


     
//------------------------------------------------------------------------------------------------------------------------

function calculateThermalBridge() {
    // Récupération de l'année de construction à partir du formulaire
    const annee_de_construction = document.getElementById("Annee_de_construction").value;
    let thermalBridgeCoefficient;
    
    // Sélection du coefficient en fonction de l'année de construction
    switch(annee_de_construction) {
        case "Avant 1974":
            thermalBridgeCoefficient = 0.1;
            break;
        case "De 1974 à 1980":
            thermalBridgeCoefficient = 0.15;
            break;
        case "De 1981 à 1988":
            thermalBridgeCoefficient = 0.15;
            break;
        case "De 1989 à 1999":
            thermalBridgeCoefficient = 0.2;
            break;
        case "De 2000 à 2004":
            thermalBridgeCoefficient = 0.2;
            break;
        case "De 2005 à 2012":
            thermalBridgeCoefficient = 0.25;
            break;
        case "De 2013 à 2017":
            thermalBridgeCoefficient = 0.15;
            break;
        default:
            thermalBridgeCoefficient = 0.15; // Valeur par défaut
    }
    
    // Récupération des pertes thermiques calculées précédemment

    const airNeufLoss = calculateAirNeufLoss();
    const SolLoss = calculateFloorLoss();
    const WindowsLoss = calculateWindowLoss();
    const toitloss = calculateRoofLoss();
    
    // Calcul de la perte totale pour le pont thermique
    const LossForBridge = airNeufLoss + SolLoss + WindowsLoss + toitloss
    
    // Calcul de la perte due au pont thermique
    const thermalBridgeLoss = LossForBridge * thermalBridgeCoefficient;
      
    return thermalBridgeLoss;
}

     
//------------------------------------------------------------------------------------------------------------------------


const departementalTemperatureData = {
    1: -10,
    2: -7,
    3: -8,
    4: -8,
    5: -10,
    6: -5,
    7: -6,
    8: -10,
    9: -5,
    10: -10,
    11: -5,
    12: -8,
    13: -5,
    14: -7,
    15: -8,
    16: -5,
    17: -5,
    18: -7,
    19: -8,
    20: -2,
    21: -10,
    22: -4,
    23: -8,
    24: -5,
    25: -12,
    26: -6,
    27: -7,
    28: -7,
    29: -4,
    30: -5,
    31: -5,
    32: -5,
    33: -5,
    34: -5,
    35: -4,
    36: -7,
    37: -7,
    38: -10,
    39: -10,
    40: -5,
    41: -7,
    42: -10,
    43: -8,
    44: -5,
    45: -7,
    46: -6,
    47: -5,
    48: -8,
    49: -7,
    50: -4,
    51: -10,
    52: -12,
    53: -7,
    54: -15,
    55: -12,
    56: -4,
    57: -15,
    58: -10,
    59: -9,
    60: -7,
    61: -7,
    62: -9,
    63: -8,
    64: -5,
    65: -5,
    66: -5,
    67: -15,
    68: -15,
    69: -10,
    70: -10,
    71: -10,
    72: -7,
    73: -10,
    74: -10,
    75: -5,
    76: -7,
    77: -7,
    78: -7,
    79: -7,
    80: -9,
    81: -5,
    82: -5,
    83: -5,
    84: -6,
    85: -5,
    86: -7,
    87: -8,
    88: -15,
    89: -10,
    90: -15,
    91: -7,
    92: -7,
    93: -7,
    94: -7,
    95: -7
  };
  
  function getTemperatureFactor(departmentNumber) {
    if (departementalTemperatureData.hasOwnProperty(departmentNumber)) {
      return departementalTemperatureData[departmentNumber];
    } else {
      return "Non défini";  // Ou toute autre valeur par défaut
    }
  }
  
// Liste des IDs des éléments de formulaire à surveiller
const elementsToWatch = [
    "Surface_RDC", "Surface_1er_etage", "Surface_2e_etage",
    "HSP_RDC", "HSP_1er_etage", "HSP_2e_etage",
    "Type_de_construction", "Surface_de_vitrage", "Mitoyennete",
    "Annee_de_construction", "Structure_du_sol" 
];





// Ajout du code pour gérer l'affichage et la réinitialisation des détails des étages
document.addEventListener("DOMContentLoaded", function() {
    function updateEtageDetails() {
        const typeDeConstruction = document.getElementById("Type_de_construction").value;
    
        // Réinitialisation des valeurs pour les étages non actifs
        if (typeDeConstruction === "Rdc") {
            document.getElementById("Surface_1er_etage").value = "";
            document.getElementById("HSP_1er_etage").value = "";
            document.getElementById("Surface_2e_etage").value = "";
            document.getElementById("HSP_2e_etage").value = "";
        } else if (typeDeConstruction === "1 Étage") {
            document.getElementById("Surface_2e_etage").value = "";
            document.getElementById("HSP_2e_etage").value = "";
        }
    
    
    }
    

    const typeDeConstruction = document.getElementById("Type_de_construction");
    typeDeConstruction.addEventListener("change", updateEtageDetails);
    updateEtageDetails();  // Appel initial pour configurer l'affichage
});


//----------------------------------------------------------------------------------------------------------------------------


function getUserChoices() {
    const typePAC = document.querySelector("#type_pac").value;
    const systemePAC = document.querySelector("#systeme_pac").value;
    const typeFluide = document.querySelector("#type_fluide").value;
    const ballonTampon = document.querySelector("#ballon_tampon").value;
    const typeCapteur = document.querySelector("#type_capteur").value;
    const eauDeNappe = document.querySelector("#eau_de_nappe").value;
    const remplissageCapteur = document.querySelector("#remplissage_capteur").value;
    const accessoireAerothermie = document.querySelector("#accessoire_aerothermie").value;
    const kitFreecooling = document.querySelector("#kit_freecooling").value === "Oui";
    const kitPiscine = document.querySelector("#kit_piscine").value === "Oui";

    return {
        typePAC,
        systemePAC,
        typeFluide,
        ballonTampon,
        typeCapteur,
        eauDeNappe,
        remplissageCapteur,
        accessoireAerothermie,
        kitFreecooling,
        kitPiscine,
        // Vous pouvez ajouter d'autres options ici si nécessaire
    };
}


//-----------------------------------------------------------------------------------------------------------------------------------

function getCompatibleProducts(userChoices, products) {
    return products.filter(product => {
        // Vérification du type de pompe à chaleur
        if (!product.Particularites.includes(userChoices.typePAC)) return false;

        // Vérification du type de fluide
        if (!product.Particularites.includes(userChoices.fluide)) return false;

        // Vérification du type de produit (EGE, SE, etc.)
        if (!product.Particularites.includes(userChoices.produit)) return false;

        // Vérification des déperditions
        const minPuissance = userChoices.eauDeNappe ? product.Eau_de_nappe.Puissance_min : product.Puissance.min;
        const maxPuissance = userChoices.eauDeNappe ? product.Eau_de_nappe.Puissance_max : product.Puissance.max;
        if (userChoices.deperditions < minPuissance || userChoices.deperditions > maxPuissance) return false;

        // Vérification de l'option Freecooling
        if (userChoices.freecooling && !product.Freecooling) return false;

        // Vérification de l'option Kit Piscine
        if (userChoices.kitPiscine && !product.Kit_Piscine) return false;

        // Si toutes les conditions sont remplies
        return true;
    });
}


//------------------------------------------------------------------------------------------------------------------------------------------


window.addEventListener('load', () => {
    const cover = document.getElementById('page-transition-cover');
    cover.style.top = '100%';
});

document.addEventListener("DOMContentLoaded", function() {
    const possedeDeperditions = document.getElementById("possedeDeperditions");
    const questionsSupplementaires = document.getElementById("questionsSupplementaires");
  
    possedeDeperditions.addEventListener("change", function() {
      if (this.value === "Oui") {
        questionsSupplementaires.style.display = "none";
      } else {
        questionsSupplementaires.style.display = "block";
      }
    });
  
    // Configuration des cases surface et HSP
    const typeDeConstruction = document.getElementById("Type_de_construction");
    const rdcDetails = document.getElementById("rdcDetails");
    const etage1Details = document.getElementById("etage1Details");
    const etage2Details = document.getElementById("etage2Details");
  
    function updateEtageDetails() {
      const selection = typeDeConstruction.value;
      rdcDetails.style.display = "none";
      etage1Details.style.display = "none";
      etage2Details.style.display = "none";
  
      if (selection === "Rdc") {
        rdcDetails.style.display = "block";
      } else if (selection === "1 Étage") {
        rdcDetails.style.display = "block";
        etage1Details.style.display = "block";
      } else if (selection === "2 Étages") {
        rdcDetails.style.display = "block";
        etage1Details.style.display = "block";
        etage2Details.style.display = "block";
      }
    }

        typeDeConstruction.addEventListener("change", updateEtageDetails);
     updateEtageDetails();  // Appel initial pour configurer l'affichage


  
    function updateResultatDeperdition() {
    const Departement = document.getElementById("Departement").value; // Cette ligne doit être à l'intérieur de la fonction
    const Temperature_de_chauffage = parseFloat(document.getElementById("Temperature_de_chauffage").value);
    const wallLoss = calculateWallLoss().totalHeatLoss;  // Appel à la fonction de calculs.js pour les murs
    const windowLoss = calculateWindowLoss();  // Appel à la fonction de calculs.js pour les vitres
    const roofLoss = calculateRoofLoss();  // Appel à la fonction de calculs.js pour le toit
    const floorLoss = calculateFloorLoss(); // Appel de la fonction de claculs.js pour le sol 
    const airLoss = calculateAirNeufLoss(); // Appel de la fonction de calculs.js pour l'air
    const pontLoss = calculateThermalBridge(); // Appel de la fonction de calculs.js pour le pont
    const temperatureFactor = getTemperatureFactor(Departement); // Utilisation de la fonction getTemperatureFactor
    const totalLoss = ((wallLoss + windowLoss + roofLoss + floorLoss + airLoss + pontLoss)*(Temperature_de_chauffage - temperatureFactor))/1000;  // Somme des pertes thermiques 
    console.log("wallLoss", wallLoss);
    console.log("windowsLoss", windowLoss);
    console.log("RoifLoss", roofLoss);
    console.log("FloorLoss", floorLoss);
    console.log("Perte air", airLoss);
    console.log("Pont", pontLoss);
    console.log("Departement", temperatureFactor);

    document.getElementById("ResultatDeperdition").value = totalLoss + " W/K";  // Affichage du résultat total
}
    const form = document.getElementById("deperditions-form");
    form.addEventListener("change", updateResultatDeperdition);
  
    updateResultatDeperdition();
  });







// ------------------------      METHODE DE CHAUFFAGE       ----------------------------------------






         function updateSystemOptions() {
            const typePacSelect = document.getElementById("type_pac");
            const systemPacSelect = document.getElementById("systeme_pac");
            const geothermieOptions = document.getElementById("geothermie_options");
            const aerothermieOptions = document.getElementById("aerothermie_options");
            const accessoiresTitle = document.getElementById("accessoires_title");

            systemPacSelect.innerHTML = "";

            let options;
            if (typePacSelect.value === "Geothermie") {
                options = ["Sol/Sol", "Eau/Eau", "Sol/Eau", "Eau glycolée/Sol"];
                geothermieOptions.style.display = "block";
                aerothermieOptions.style.display = "none";
                accessoiresTitle.textContent = "Accessoires Géothermie";
            } else {
            options = ["Air/Air"];
                aerothermieOptions.style.display = "block";
                geothermieOptions.style.display = "none";
                accessoiresTitle.textContent = "Accessoires Aérothermie";
            }

            for (const option of options) {
                const optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                systemPacSelect.appendChild(optionElement);
            }
        }
        updateSystemOptions();

        // Charger le fichier products.json
        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                // Maintenant, 'products' contient les données de votre fichier JSON
    
                const userChoices = getUserChoices();
                const compatibleProducts = getCompatibleProducts(userChoices, products);
    
                if (compatibleProducts.length > 0) {
                    console.log("Produits compatibles : ", compatibleProducts);
                } else {
                    console.log("Aucun produit compatible trouvé.");
                }
            })
            .catch(error => {
                console.error("Une erreur s'est produite lors du chargement du fichier products.json :", error);
            });


            document.getElementById("nextPageArrow").addEventListener("click", function() {
                window.location.href = "methode.html";
              });
              