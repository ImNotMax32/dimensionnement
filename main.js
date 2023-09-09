const produits = [
    {
      nom: "Optipack EGE",
      type: ["Géothermie"],
      sousTypes: ["EGE"],
      refrigerants: ["R32"],
      puissanceRange: [2.268, 9.655],
      freecooling: true,
      eauDeNappe: true,
      puissanceEauDeNappeRange: [5.275, 15.438],
      kitPiscine: true
    },
    {
      nom: "Optipack 2 EGE",
      type: ["Géothermie"],
      sousTypes: ["EGE"],
      refrigerants: ["R32", "R410A"],
      puissanceRange: [2.610, 10.500],
      freecooling: true,
      eauDeNappe: true,
      puissanceEauDeNappeRange: [3.132, 12.900],
      kitPiscine: true
    },
    {
      nom: "Optipack SE",
      type: ["Géothermie"],
      sousTypes: ["SE"],
      refrigerants: ["R32"],
      puissanceRange: [2.359, 10.350],
      freecooling: true,
      eauDeNappe: false,
      puissanceEauDeNappeRange: null,
      kitPiscine: true
    },
  {
    nom: "Optipack 2 SE",
    type: ["Géothermie"],
    sousTypes: ["SE"],
    refrigerants: ["R32"],
    puissanceRange: [2.700, 10.500],
    freecooling: true,
    eauDeNappe: false,
    puissanceEauDeNappeRange: null,
    kitPiscine: true
  },
  {
    nom: "Smartpack3 EGE",
    type: ["Géothermie"],
    sousTypes: ["EGE"],
    refrigerants: ["R32", "R410A"],
    puissanceRange: [2.610, 17.300],
    freecooling: true,
    eauDeNappe: true,
    puissanceEauDeNappeRange: [3.132, 21.400],
    kitPiscine: true
  },
  {
    nom: "Smartpack2 EGE",
    type: ["Géothermie"],
    sousTypes: ["EGE"],
    refrigerants: ["R32"],
    puissanceRange: [5.640, 20.200],
    freecooling: true,
    eauDeNappe: true,
    puissanceEauDeNappeRange: [7.050, 25.250],
    kitPiscine: true
  },
   {
    nom: "Smartpack3 SE",
    type: ["Géothermie"],
    sousTypes: ["SE"],
    refrigerants: ["R32"],
    puissanceRange: [4.826, 17.450],
    freecooling: true,
    eauDeNappe: false,
    puissanceEauDeNappeRange: null,
    kitPiscine: true
  },
  {
    nom: "Smartpack2 SE",
    type: ["Géothermie"],
    sousTypes: ["SE"],
    refrigerants: ["R32"],
    puissanceRange: [6.040, 17.550],
    freecooling: true,
    eauDeNappe: false,
    puissanceEauDeNappeRange: null,
    kitPiscine: true
  },
  {
    nom: "Smartpack3 SS",
    type: ["Géothermie"],
    sousTypes: ["SS"],
    refrigerants: ["R32"],
    puissanceRange: [2.450, 15.690],
    freecooling: false,
    eauDeNappe: false,
    puissanceEauDeNappeRange: null,
    kitPiscine: false
  },
    {
        nom: "Smartpack2 SS",
        type: ["Géothermie"],
        sousTypes: ["SS"],
        refrigerants: ["R32"],
        puissanceRange: [2.430, 13.300],
        freecooling: false,
        eauDeNappe: false,
        puissanceEauDeNappeRange: null,
        kitPiscine: false
      },
      // ... (autres produits)
      {
        nom: "R/OPACK 3",
        type: ["Aérothermie"],
        sousTypes: ["AE"],
        refrigerants: ["R32", "R410A"],
        puissanceRange: [4.550, 17.900],
        freecooling: true,
        eauDeNappe: false,
        puissanceEauDeNappeRange: null,
        kitPiscine: false
      },
      {
        nom: "R/OPACK 2",
        type: ["Aérothermie"],
        sousTypes: ["AE"],
        refrigerants: ["R32"],
        puissanceRange: [5.100, 15.000],
        freecooling: true,
        eauDeNappe: false,
        puissanceEauDeNappeRange: null,
        kitPiscine: false
      }
    ];
    function filtrerProduits(choixUtilisateur) {
        return produits.filter(produit => {
          // Filtrer par type de pompe à chaleur (Géothermie, Aérothermie, etc.)
          if (choixUtilisateur.type && !produit.type.includes(choixUtilisateur.type)) {
            return false;
          }
      
          // Filtrer par sous-type (EGE, SE, etc.)
          if (choixUtilisateur.sousType && !produit.sousTypes.includes(choixUtilisateur.sousType)) {
            return false;
          }
      
          // Filtrer par réfrigérant (R32, R410A, etc.)
          if (choixUtilisateur.refrigerant && !produit.refrigerants.includes(choixUtilisateur.refrigerant)) {
            return false;
          }
      
          // Filtrer par puissance
          if (choixUtilisateur.puissance) {
            const [minPuissance, maxPuissance] = produit.puissanceRange;
            if (choixUtilisateur.puissance < minPuissance || choixUtilisateur.puissance > maxPuissance) {
              return false;
            }
          }
      
          // ... (autres critères de filtrage)
      
          return true;
        });
    }
    
    document.addEventListener("DOMContentLoaded", function() {
        const typeSelect = document.getElementById("typeSelect");
      
        typeSelect.addEventListener("change", function() {
            // Récupérez les choix de l'utilisateur
            const choixUtilisateur = {
                type: typeSelect.value,
                // Ajoutez d'autres champs ici
            };
        
            // Appelez votre fonction de filtrage
            const produitsFiltres = filtrerProduits(choixUtilisateur);
        
            // Affichez les résultats (pour le moment, dans la console)
            console.log("Produits filtrés :", produitsFiltres);
        });
    });
