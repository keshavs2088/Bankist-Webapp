"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: "premium",
  movementsDates: [
    "2019-11-15T01:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2026-05-02T23:36:17.929Z",
    "2026-05-05T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: "standard",
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: "premium",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: "basic",
};

const accounts = [account1, account2, account3, account4];

//VARIABLES
const mainApp = document.querySelector(".app");
const transactionsUI = document.querySelector(".transactions");

const loginUsername = document.querySelector(".user-name");
const loginPin = document.querySelector(".user-pin");
const transferTo = document.querySelector("#input-transfer-to");
const transferAmount = document.querySelector("#input-amount");
const loanAmount = document.querySelector("#input-loan-amount");
const confirmCloseUser = document.querySelector("#input-username");
const confirmClosePin = document.querySelector("#input-pin");

const loginButton = document.querySelector(".login");
const transferButton = document.querySelector(".btn-transfer");
const loanButton = document.querySelector(".btn-loan");
const closeAccountButton = document.querySelector(".btn-close_account");

const welcomeMessage = document.querySelector(".label-header");
const currentDate = document.querySelector(".label-current-date");
const balanceUI = document.querySelector("#balance");
const inSummary = document.querySelector(".in-value");
const outSummary = document.querySelector(".out-value");
const intSummary = document.querySelector(".int-value");

//FUNCTIONS
const createUsername = function (accounts) {
  accounts.forEach((account) => {
    account.userName = account.owner
      .split(" ")
      .map((name) => name[0].toLowerCase())
      .join("");
  });
};

const updateUI = function () {
  //update transactions
  updateTransactions();
  //update current balance
  updateBalance();
  //update the balance summary
  updateSummary();
};

const updateBalance = function () {
  currentUser.balance = currentUser.movements.reduce(
    (acc, value) => (acc += value),
    0,
  );
  balanceUI.textContent = `${formatCurrency(currentUser.balance)}`;
};

const formatDate = function (date) {
  const formattedDate = new Intl.DateTimeFormat(currentUser.locale).format(
    date,
  );
  return formattedDate;
};

const formatCurrency = function (amount) {
  return new Intl.NumberFormat(currentUser.locale, {
    style: "currency",
    currency: currentUser.currency,
  }).format(amount);
};

const updateTransactions = function () {
  transactionsUI.innerHTML = "";
  let displayDate;
  const today = new Date();
  const todayFormatted = formatDate(today);

  //create new array with date and transaction
  const transacWithDate = currentUser.movements.map((value, i) => [
    value,
    currentUser.movementsDates.at(i),
  ]);

  //traverse the array to display transactions
  transacWithDate.map((value, i) => {
    let type = value.at(0) > 0 ? "deposit" : "withdrawal";

    //format date into dd/mm/yyyy
    const dateValue = new Date(value.at(1));
    const formattedDate = formatDate(dateValue);
    displayDate = formattedDate;

    const daysPassed = Math.round(
      Math.abs((dateValue - today) / (1000 * 60 * 60 * 24)),
    );
    if (daysPassed === 0) displayDate = "Today";
    if (daysPassed > 0 && daysPassed < 7)
      displayDate = `${daysPassed + 1} days ago`;

    const html = `<div class="transaction-row">
          <div class="transaction-type transaction-type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="transaction-date">${displayDate}</div>
          <div class="transaction-value">${formatCurrency(value.at(0))}</div>
        </div>`;
    transactionsUI.insertAdjacentHTML("afterbegin", html);
  });
};

const updateSummary = function () {
  //calculate IN
  const income = currentUser.movements.reduce(
    (acc, value) => (value > 0 ? acc + value : acc),
    0,
  );
  inSummary.textContent = formatCurrency(income);

  //calculate OUT
  const expense = currentUser.movements.reduce(
    (acc, value) => (value < 0 ? acc + value : acc),
    0,
  );
  outSummary.textContent = formatCurrency(Math.abs(expense));

  //calculate INT
  const interest = currentUser.movements
    .filter((value) => value > 0)
    .reduce((acc, value) => acc + (value * currentUser.interestRate) / 100, 0);
  intSummary.textContent = formatCurrency(interest);
};

//SEQUENTIAL CODE
let currentUser;
const name = createUsername(accounts);

//EVENT LISTENERS
loginButton.addEventListener("submit", function (e) {
  e.preventDefault();
  //check the account that matches the username
  accounts.forEach((account) => {
    if (
      loginUsername.value === account.userName &&
      Number(loginPin.value) === account.pin
    ) {
      currentUser = account;
      mainApp.style.opacity = 100;
      welcomeMessage.textContent = `Good Day, ${account.owner.split(" ").at(0)}!`;
    }
  });

  //remove username and pin
  loginUsername.value = loginPin.value = "";
  document.activeElement.blur();

  //display current date and time
  const now = new Date();
  const formattedNow = new Intl.DateTimeFormat(currentUser.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  currentDate.textContent = `As of ${formattedNow}`;

  //update the transactions, current balance and summary
  updateUI();
});

transferButton.addEventListener("click", function (e) {
  let transferAccount;
  accounts.forEach((account) => {
    if (
      account.userName === transferTo.value &&
      transferTo.value !== currentUser.userName
    )
      transferAccount = account;
  });

  if (transferAmount.value < currentUser.balance && transferAmount.value > 0) {
    transferAccount.movements.push(Number(transferAmount.value));
    const date = new Date();
    transferAccount.movementsDates.push(date);
    currentUser.movements.push(-transferAmount.value);
    currentUser.movementsDates.push(date);
    updateUI();
  }

  transferTo.value = transferAmount.value = "";
  document.activeElement.blur();
});

loanButton.addEventListener("click", function () {});

closeAccountButton.addEventListener("click", function () {
  if (
    confirmCloseUser.value === currentUser.userName &&
    Number(confirmClosePin.value) === currentUser.pin
  ) {
    accounts.splice(accounts.indexOf(currentUser), 1);
    console.log(accounts);
    mainApp.style.opacity = 0;
    welcomeMessage.textContent = `Log in to get started`;
  }
  confirmCloseUser.value = confirmClosePin.value = "";
});
