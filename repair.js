const fs = require('fs');
const bs58 = require('bs58');
const path = require('path');
const solanaWeb3 =  require("@solana/web3.js");
const Solana = new solanaWeb3.Connection("https://ssc-dao.genesysgo.net/");


const inputDirectory = "./output_2"; // input directory WITHOUT "/" at the end
const outputDirectory = "./output"; // output directory WITHOUT "/" at the end


const solRepairAddressOutput = async () => {
	
	try {
        // Get the files as an array
        const files = await fs.promises.readdir( inputDirectory );

        // Loop them all with the new for...of
        for( const file of files ) {
            // Get the full paths
            const fromPath = path.join( inputDirectory, file );
            const toPath = path.join( outputDirectory, file );

            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat( fromPath );

            if( stat.isFile() ) {
				const data = fs.readFileSync(fromPath, 'utf8');
				//console.log(data);

				const cleanData = "[" + data + "]";
				const jsonData = JSON.parse(cleanData);
				let byteArr = Uint8Array.from(Buffer.from(jsonData));
				//console.log(byteArr);
				fs.writeFileSync(toPath, bs58.encode(byteArr));
				if(byteArr.length != 64) console.log( "" + file + " evil converted." + byteArr.length );				
            }
        } 
    }
    catch( e ) {
        
        console.error( "error!", e );
    }
};
solRepairAddressOutput();