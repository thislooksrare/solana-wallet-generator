const fs = require('fs');
const bs58 = require('bs58');
const solanaWeb3 =  require("@solana/web3.js");
const Solana = new solanaWeb3.Connection("https://ssc-dao.genesysgo.net/");

// IF YOU ARE A NOOB JUST EDIT THIS PART
const wordsStart = ["art", "1312", "look"]; // words to look for at the beginning of the address
const wordsInclude = ["looksrare"]; // words to look for in the complete address
const stopAfter = 100; // setting this to 0 deactivates the limit
const outputDirectory = "./output"; // output directory WITHOUT "/" at the end

// FUNCTION PART

// create output directory if not exists
if (!fs.existsSync(outputDirectory)){ 
	fs.mkdirSync(outputDirectory); 
}

// write key to file
const writeSolKey = async (keyPair) => {
	console.log(keyPair);
	fs.writeFileSync(outputDirectory + "/" + keyPair.publicKey.toString() + '.json', bs58.encode(keyPair.secretKey));
}

const solKeyGen = async () => {
	console.log('Solana Keypair Generator started with following filters:')
	let count = 0;
	if(wordsStart.length > 0) { console.log('--> starting or ending with ', wordsStart); }
	if(wordsInclude.length > 0) { console.log('--> including ', wordsInclude); }
	console.log('Please be patient while the computer does its thing. This can take a while!');
	console.log('Usually a 3-digit word at the beginning will be found within a minute, 4-digit can take longer!')


	while((count < stopAfter) || stopAfter == 0) {

		// generate new keypair
		const keyPair = solanaWeb3.Keypair.generate();

		// lowercase the public key for more results
		const checkKey = keyPair.publicKey.toString().toLowerCase();

		// test for match - if match found, output the keypair to a file
		let isMatch = false;
		for (var i = wordsStart.length - 1; (i >= 0 ) && !isMatch; i--) {
			if(checkKey.startsWith(wordsStart[i])) isMatch = true;
			if(checkKey.endsWith(wordsStart[i])) isMatch = true;
		}
		for (var i = wordsInclude.length - 1; (i >= 0 ) && !isMatch; i--) {
			if(checkKey.includes(wordsInclude[i])) isMatch = true;
		}
		if (isMatch) {
			count++;
			console.log("[" + count + "] New Match - Public Key:", keyPair.publicKey.toString());
			writeSolKey(keyPair);
		}
	}
};
solKeyGen();
