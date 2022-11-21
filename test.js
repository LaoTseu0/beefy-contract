// import { addressBook } from "blockchain-addressbook";
const addressBook = require("blockchain-addressbook");

const tokenAdd = Object.entries(addressBook.addressBook.bsc.tokenAddressMap)

// tokenAdd.filter(e => console.log(e[1].name))

console.log(tokenAdd.filter(e => e[1].name.toLocaleLowerCase().includes("cake")));