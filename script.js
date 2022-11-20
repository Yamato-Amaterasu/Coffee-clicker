/* eslint-disable no-alert */

/***The line below allows us to access the data from the window object.
 * This comes from the data.js file***/
const data = window.data;

/***Before we can begin manipulating the DOM we need to gain access to two DOM Nodes***/
// 1. Declare a variable bigCoffee that holds reference to the element with id 'big_coffee'.
// your code here
const bigCoffee = document.querySelector('#big_coffee');
// 2. Declare a variable producerContainer that holds reference to the element with id 'producer_container'.
// your code here
const producerContainer = document.querySelector('#producer_container');
/***Don't worry about the specifics of the condition in this if statement for now.
 * Just follow the instructions in it to ensure the application has base functionality.
 * We'll discuss in depth later what process is, but it's not necessary just yet.***/
if (typeof process === 'undefined') {
  /********************
   *   Event Listeners
   ********************/

  /* 1. Add a 'click' event listener to the bigCoffee element(giant coffee emoji) you referenced above.
   * It should call the clickCoffee function below and be passed the global data object.*/
  // your code here
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  /* 2. Add a 'click' event listener to the producerContainer(Coffee Producers panel) you referenced above.
   * It should call the buyButtonClick function below and be passed the browser event and global data object.*/
  // your code here
  producerContainer.addEventListener('click', (event) => buyButtonClick(event, data));
  // You don't need to edit this line of code. It calls the tick function passing in the data object every 1000ms or 1s.
  setInterval(() => tick(data), 1000);
}

// Now you're ready to start running the tests. Good luck!

/**************
 *   SLICE 1
 **************/
// let coffeeCounter = document.getElementById('coffee_counter');
// let numberOfCoffee = 0


function updateCoffeeView(coffeeQty) {

  let coffeeCounter = document.getElementById('coffee_counter');
  coffeeCounter.innerText = coffeeQty
}

function clickCoffee(data) {
  data.coffee += 1
  updateCoffeeView(data.coffee)
  renderProducers(data)
}
/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // for (let i = 0; i < data.producers.length; i++) {
  //   if (data.coffee >= data.producers[i].price / 2) {
  //     data.producers[i].unlocked = true;
  //   }
  // };

  for (let i = 0; i < producers.length; i++) {
    if (coffeeCount >= producers[i].price / 2) {
      producers[i].unlocked = true;
    }
  };


}

function getUnlockedProducers(data) {

  // function arrayData(producerArray) {
  //   for (let i = 0; i < data.producers.length; i++)
  //     if (data.producers[i].unlocked === true)
  //       return

  // }


  return data.producers.filter(producer => producer.unlocked)

}

function makeDisplayNameFromId(id) {

  // your code here
  let idSpaces = id.replaceAll("_", " ");//replaces underscore w/ space
  let idArr = Array.from(idSpaces);//convert to array
  idArr.splice(0, 1, idArr[0].toUpperCase());//change first letter to upper case

  //loop to find the first letter after a space and capitalize it
  for (let i = 1; i < idArr.length; i++) {
    if (idArr[i - 1] === " ") {
      idArr.splice(i, 1, idArr[i].toUpperCase());
    }
  }
  let displayName = idArr.join('');//turn back into a string without a separator
  return displayName;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild); //read that the node will reindex after each iteration, which is why we don't need to iterate through the child nodes
  }
}

function renderProducers(data) {
  // your code here

  unlockProducers(data.producers, data.coffee);
  // unlocks the producers that can be unlocked, changed the value to true from false in the data
  const domProducer = document.querySelector('#producer_container');
  // declairing the producer container so it can be used within the function
  deleteAllChildNodes(domProducer);
  // this deletes all producers within the container so there are no duplicates
  let unlockedProds = getUnlockedProducers(data);
  // makes it more readable and clean ^ this function makes the unlocked producers an array

  for (let i = 0; i < unlockedProds.length; i++) {
    let prodDiv = makeProducerDiv(unlockedProds[i]);
    domProducer.appendChild(prodDiv);
  }
  // the loop creates the div that shows up in the container and will put them on the menu 





}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let i = 0; i < data.producers.length; i++)
    if (data.producers[i].id === producerId)
      return data.producers[i];
}

function canAffordProducer(data, producerId) {
  // your code here
  let prodId = getProducerById(data, producerId);
  if (prodId.price <= data.coffee) {
    return true;
  } else {
    return false;
  }


}

function updateCPSView(cps) {
  // your code here
  let coffeeCPS = document.getElementById('cps');
  coffeeCPS.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  let newPrice = oldPrice * 1.25
  return Math.floor(newPrice)
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  if (canAffordProducer(data, producerId)) {
    // this ^ checks if we can afford the producer
    let prodToBuy = getProducerById(data, producerId);
    // this is a variable we made to make it more clean and the function grabs the id of the producer we are trying to buy
    prodToBuy.qty += 1;
    // this adds 1 to the total quantity of the producer 
    data.coffee -= prodToBuy.price;
    // this subtracts the coffee away from our total in order to buy this producer
    prodToBuy.price = updatePrice(prodToBuy.price);
    // this raises the price by 25% 
    data.totalCPS += prodToBuy.cps;
    // this edits the total cps we get from the producers 
    return true;
  } else {
    return false;
  }

}

function buyButtonClick(event, data) {
  // your code here
  if (event.target.tagName === "BUTTON") {
    const producerId = event.target.id.slice(4);
    const result = attemptToBuyProducer(data, producerId);
    if (!result) {
      window.alert("Not enough coffee!");
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);

}

/**********************************
 *  Congratulations! You did it!
 **********************************/

// You don't need to edit any of the code below
// If we aren't in a browser and are instead in node
// we'll need to export the code written here so we can import and
// run the tests in Mocha. More on this later.
// Don't worry if it's not clear exactly what's going on here.
if (typeof process !== 'undefined') {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
