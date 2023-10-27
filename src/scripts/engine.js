const state = {
   score: {
      playerScore: 0,
      computerScore: 0,
      scoreBox: document.getElementById('score_points'),
   },
   cardSprites: {
      avatar: document.getElementById('card-image'),
      name: document.getElementById('card-name'),
      type: document.getElementById('card-type'),
   },
   fieldCards: {
      player: document.getElementById('player-field-card'),
      computer: document.getElementById('computer-field-card'),
   },
   playerSides: {
      player1: 'player-cards',
      player1BOX: document.querySelector('#player-cards'),
      computer: 'computer-cards',
      computerBOX: document.querySelector('#computer-cards'),
   },
   actions: {
      button: document.getElementById('next-duel'),
   }
};

const playerSides = {
   player1: 'player-cards',
   computer: 'computer-cards',
};

const pathImages = './src/assets/icons/';

const cardData = [
   {
      id: 0,
      name: 'Windy',
      type: 'Windy',
      img: `${pathImages}windy.jpg`,
      WinOf: [1, 3, 4],
      LoseOf: [2, 5, 6, 7, 8, 9],
   },
   {
      id: 1,
      name: 'Shadow',
      type: 'Shadow',
      img: `${pathImages}shadow.jpg`,
      WinOf: [2],
      LoseOf: [0, 3, 4, 5, 6, 7, 8, 9],
   },
   {
      id: 2,
      name: 'Thunder',
      type: 'Thunder',
      img: `${pathImages}thunder.jpg`,
      WinOf: [0, 3, 4, 5, 6, 7, 9],
      LoseOf: [1, 8],
   },
   {
      id: 3,
      name: 'Watery',
      type: 'Watery',
      img: `${pathImages}watery.jpg`,
      WinOf: [4],
      LoseOf: [0, 1, 2, 5, 6, 7, 8, 9],
   },
   {
      id: 4,
      name: 'Firey',
      type: 'Firey',
      img: `${pathImages}firey.jpg`,
      WinOf: [1, 5, 6],
      LoseOf: [0, 2, 3, 7, 8, 9],
   },
   {
      id: 5,
      name: 'Power',
      type: 'Power',
      img: `${pathImages}power.jpg`,
      WinOf: [0, 1, 3, 4, 6],
      LoseOf: [2, 7, 8, 9],
   },
   {
      id: 6,
      name: 'Fight',
      type: 'Fight',
      img: `${pathImages}fight.jpg`,
      WinOf: [0, 1, 3, 4],
      LoseOf: [2, 5, 7, 8, 9],
   },
   {
      id: 7,
      name: 'Time',
      type: 'Time',
      img: `${pathImages}time.jpg`,
      WinOf: [0, 1, 3, 4, 5, 6, 8, 9],
      LoseOf: [2],
   },
   {
      id: 8,
      name: 'Silent',
      type: 'Silent',
      img: `${pathImages}silent.jpg`,
      WinOf: [0, 2, 3, 4, 5, 6, 7, 9],
      LoseOf: [1],
   },
   {
      id: 9,
      name: 'Dash',
      type: 'Dash',
      img: `${pathImages}dash.jpg`,
      WinOf: [0, 1, 3, 4, 5, 6],
      LoseOf: [2, 7, 8],
   },
];

async function getRandomCardId() {
   const randomIndex = Math.floor(Math.random() * cardData.length);
   return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
   const cardImage = document.createElement('img');
   cardImage.setAttribute('height', '100px');
   cardImage.setAttribute('src', './src/assets/icons/card-back.jpg');
   cardImage.setAttribute('data-id', idCard);
   cardImage.classList.add('card');

   if (fieldSide === playerSides.player1) {
      cardImage.addEventListener('mouseover', () => {
         drawSelectCard(idCard);
      });

      cardImage.addEventListener('click', () => {
         setCardsField(cardImage.getAttribute('data-id'));
      });
   }

   return cardImage;
}

async function setCardsField(cardId) {

   await removeAllCardsImages();

   let computerCardId = await getRandomCardId();

   await showHiddenCardFieldsImages(true);

   await hiddenCardDetails();

   await drawCardsInField(cardId, computerCardId);
   
   let duelResults = await checkDuelResults(cardId, computerCardId);

   await updateScore();
   await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
   state.fieldCards.player.src = cardData[cardId].img;
   state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
   if(value === true) {
      state.fieldCards.player.style.display = 'block';
      state.fieldCards.computer.style.display = 'block';
   } else if(value === false) {
      state.fieldCards.player.style.display = 'none';
      state.fieldCards.computer.style.display = 'none'; 
   }
}

async function hiddenCardDetails() {
   state.cardSprites.avatar.src = '';
   state.cardSprites.name.innerText = '';
   state.cardSprites.type.innerText = '';
}

async function drawButton(text) {
   state.actions.button.innerText = text.toUpperCase();
   state.actions.button.style.display = 'block';
}

async function updateScore() {
   state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
   let duelResults = 'draw';
   let playerCard = cardData[playerCardId];

   if (playerCard.WinOf.includes(computerCardId)) {
      duelResults = 'win';
      state.score.playerScore++;
   } else if (playerCard.LoseOf.includes(computerCardId)) {
      duelResults = 'lose';
      state.score.computerScore++;
   }

   await playerAudio(duelResults);

   return duelResults;
}

async function removeAllCardsImages() {

   let { computerBOX, player1BOX } = state.playerSides;

   // Computer Cards
   let imgElements = computerBOX.querySelectorAll('img');

   imgElements.forEach((img) => img.remove());

   // Player Cards
   imgElements = player1BOX.querySelectorAll('img');

   imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
   state.cardSprites.avatar.src = cardData[index].img;
   state.cardSprites.name.innerText = cardData[index].name;
   state.cardSprites.type.innerText = `Attribute: ${cardData[index].type}`;
}

async function drawCards(cardsNumbers, fieldSide) {
   for (let i=0; i < cardsNumbers; i++) {
      const randomIdCard = await getRandomCardId();
      const cardImage = await createCardImage(randomIdCard, fieldSide);

      document.getElementById(fieldSide).appendChild(cardImage);
   }
}

async function resetDuel() {
   state.cardSprites.avatar.src = '';
   state.actions.button.style.display = 'none';

   state.fieldCards.player.style.display = 'none';
   state.fieldCards.computer.style.display = 'none';

   init();
}

async function playerAudio(status) {
   const audio = new Audio(`./src/assets/audios/${status}.wav`);
   
   try {
      audio.play();
   } catch {}
}

function init() {
   showHiddenCardFieldsImages(false);

   drawCards(5, playerSides.player1);
   drawCards(5, playerSides.computer);

   
   const bgm = document.getElementById('bgm');
   bgm.play();
}

init();