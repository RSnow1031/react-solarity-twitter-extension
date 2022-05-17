 

window.addEventListener('RecieveContent', function(evt) {

	if (evt.detail=="connect-wallet") {

		try {

			(async () => {
				const resp = await window.solana.connect();
				var event = new CustomEvent('RecieveWallate', {detail: { 'msg': "recieve-wallet", 'publicKey': resp.publicKey.toString() }});
				window.dispatchEvent(event);
				//transferSOL()
			})(); 

		} catch (err) {
			var event = new CustomEvent('RecieveWallate', {detail: { 'msg': "recieve-wallet", 'address': 'ERROR##' }});
			window.dispatchEvent(event);
		}	

	}
	
	if (evt.detail.msg == "made-transaction") {
    Buffer = buffer.Buffer
		transferSOL(evt.detail.amoutn,evt.detail.currency,evt.detail.solanaAddress);
	}

const getProvider = async () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        console.log("Is Phantom installed?  ", provider.isPhantom);
        return provider;
      }
    } else {
      window.open("https://www.phantom.app/", "_blank");
    }
  };


  async function transferSOL(amount,currency,solanaAddress) {
    // Detecing and storing the phantom wallet of the user (creator in this case)
    
    var provider= window.solana;
    console.log("Public key of the emitter: ",provider.publicKey.toString());
    
    // Establishing connection
    var connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl('mainnet-beta'),
    );

    // I have hardcoded my secondary wallet address here. You can take this address either from user input or your DB or wherever
    var recieverWallet = new solanaWeb3.PublicKey(solanaAddress);

    let lamports = parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL;

    var transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: recieverWallet,
        lamports: lamports //Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
      }),
    );

    // Setting the variables for the transaction
    transaction.feePayer = await provider.publicKey;
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    // Transaction constructor initialized successfully
    if(transaction) {
      console.log("Txn created successfully");
    }
    document.querySelector('.cover').style.display = "none";

    // Request creator to sign the transaction (allow the transaction)
    let signed = await provider.signTransaction(transaction);
    // The signature is generated
    let signature = await connection.sendRawTransaction(signed.serialize());
    // Confirm whether the transaction went through or not
    await connection.confirmTransaction(signature);

    //Signature chhap diya idhar
    console.log("Signature: ", signature);
  }

});
