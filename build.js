
var MORGASPATH="./src/Morgas/";

require(MORGASPATH+"./src/Morgas.js");
require(MORGASPATH+"./src/Morgas.DependencyResolver.js");
require(MORGASPATH+"./src/Morgas.Dependencies.js");
require("./src/TalePlay.Dependencies.js");

console.info("complete");
console.log(TalePlay.dependencies.resolve(Object.keys(TalePlay.dependencies.config)));

console.info("RPGPlayer");
console.log(TalePlay.dependencies.resolve("RPGPlayer/TalePlay.RPGPlayer.js"));