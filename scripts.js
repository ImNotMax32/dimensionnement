
// --------- Fonction pour animer l'apparition du texte de bienvenue ----------------------------

function animateWelcomeText() {
  const welcomeText = document.getElementById('welcome-text');
  welcomeText.style.transition = 'opacity 1s ease-in-out';
  welcomeText.style.opacity = '1';
}



// --------- Fonction pour animer l'apparition du bouton "Commencer" ------------------


function animateStartButton() {
  const startButton = document.getElementById('startButton');
  startButton.style.transition = 'opacity 1s ease-in-out';
  startButton.style.opacity = '1';
}




// --------- Fonction pour gérer le clic sur le bouton "Commencer" --------------

function handleStartButtonClick() {
  document.getElementById('group').classList.add('fade-out');
  document.getElementById('startButton').classList.add('fade-out');
  document.getElementById('welcome-text').classList.add('fade-out');

  setTimeout(() => {
    document.querySelector('.logo').classList.add('move-logo');
  }, 1000);

  setTimeout(() => {
    const underline = document.getElementById('underline');
    underline.style.opacity = '1';
    underline.style.width = '60%';
    underline.style.left = '20%';
  }, 2000);


// ---------- Rediriger vers la nouvelle page après un délai de 4 secondes. Mettre sur autre page !!  ----------------

setTimeout(() => {
  window.location.href = 'deperditions.html';
}, 4000);
}

// -------- Écouteur d'événements pour le chargement de la page -----------------


window.addEventListener('load', function() {
  animateWelcomeText();
  
  setTimeout(() => {
    animateStartButton();
  }, 1000);
});


// -------- Écouteur d'événements pour le bouton "Commencer" ---------------------


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('startButton').addEventListener('click', handleStartButtonClick);
}); 

