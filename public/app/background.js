 

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
    if (evt.detail.currency == "USDC") {
      transferUSDC(evt.detail.amoutn,evt.detail.currency,evt.detail.solanaAddress);
    }else if(evt.detail.currency == "VERSE"){
     transferVERSE(evt.detail.amoutn,evt.detail.currency,evt.detail.solanaAddress);
    }
    else{
     transferSOL(evt.detail.amoutn,evt.detail.currency,evt.detail.solanaAddress);
    }
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


    async function transferVERSE(amount,currency,solanaAddress) {

    const SOLANA_MAINNET_VERSE_PUBKEY = "S8v4cS7dnKzV6LYvzFPuuiWQMM4KSz7URuGYWMGXyTG";

    var fromWallet= window.solana;
    
    // Establishing connection
    var connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl('mainnet-beta'),
      );

    // I have hardcoded my secondary wallet address here. You can take this address either from user input or your DB or wherever
    var recieverWallet = new solanaWeb3.PublicKey(solanaAddress);
    //connection, payer, source, destination, owner, amount, multiSigners = [], confirmOptions, programId = constants_1.TOKEN_PROGRAM_ID

      // Construct my token class
      var VERSE_pubkey = new solanaWeb3.PublicKey(SOLANA_MAINNET_VERSE_PUBKEY);
      var VERSE_Token = new splToken.Token(
        connection,
        VERSE_pubkey,
        splToken.TOKEN_PROGRAM_ID,
        fromWallet
        );
      var toTokenAccount = await VERSE_Token.getOrCreateAssociatedAccountInfo(
        recieverWallet
        )
      // Create associated token accounts for my token if they don't exist yet
      var fromTokenAccount = await VERSE_Token.getOrCreateAssociatedAccountInfo(
        fromWallet.publicKey
        )
      
      let lamports = parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL;
      
      // Add token transfer instructions to transaction
      var transaction = new solanaWeb3.Transaction()
      .add(
        splToken.Token.createTransferInstruction(
          splToken.TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          fromWallet.publicKey,
          [],
          lamports
          )
        );

        try{
          const blockHash = await connection.getRecentBlockhash()
        transaction.feePayer = await fromWallet.publicKey;
        transaction.recentBlockhash = await blockHash.blockhash
        const signed = await fromWallet.signTransaction(transaction)
        document.querySelector('.cover').style.display = "none";
        const transactionSignature = await connection.sendRawTransaction(
                    signed.serialize(),
                    { skipPreflight: true }
                  ); 
        console.log(transactionSignature);
        document.querySelector('.cover').style.display = "none";
        }catch(e){
          console.log(e);
          document.querySelector('.cover').style.display = "none";
        }
      }

  async function transferUSDC(amount,currency,solanaAddress) {

    const SOLANA_MAINNET_USDC_PUBKEY = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

    var fromWallet= window.solana;
    
    // Establishing connection
    var connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl('mainnet-beta'),
      );

    // I have hardcoded my secondary wallet address here. You can take this address either from user input or your DB or wherever
    var recieverWallet = new solanaWeb3.PublicKey(solanaAddress);
    //connection, payer, source, destination, owner, amount, multiSigners = [], confirmOptions, programId = constants_1.TOKEN_PROGRAM_ID

      // Construct my token class
      var USDC_pubkey = new solanaWeb3.PublicKey(SOLANA_MAINNET_USDC_PUBKEY);
      var USDC_Token = new splToken.Token(
        connection,
        USDC_pubkey,
        splToken.TOKEN_PROGRAM_ID,
        fromWallet
        );
      var toTokenAccount = await USDC_Token.getOrCreateAssociatedAccountInfo(
        recieverWallet
        )
      // Create associated token accounts for my token if they don't exist yet
      var fromTokenAccount = await USDC_Token.getOrCreateAssociatedAccountInfo(
        fromWallet.publicKey
        )
      

      //let lamports = parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL;
      let lamports = parseFloat(amount) * 1000000;
      // Add token transfer instructions to transaction
      var transaction = new solanaWeb3.Transaction()
      .add(
        splToken.Token.createTransferInstruction(
          splToken.TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          fromWallet.publicKey,
          [],
          lamports
          )
        );

        try{
          const blockHash = await connection.getRecentBlockhash()
        transaction.feePayer = await fromWallet.publicKey;
        transaction.recentBlockhash = await blockHash.blockhash
        const signed = await fromWallet.signTransaction(transaction)
        document.querySelector('.cover').style.display = "none";
        const transactionSignature = await connection.sendRawTransaction(
                    signed.serialize(),
                    { skipPreflight: true }
                  ); 
        console.log(transactionSignature);
        document.querySelector('.cover').style.display = "none";
        }catch(e){
          console.log(e);
          document.querySelector('.cover').style.display = "none";
        }
        

      }



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
    
    try{
     // Request creator to sign the transaction (allow the transaction)
    let signed = await provider.signTransaction(transaction);
    // The signature is generated
    let signature = await connection.sendRawTransaction(signed.serialize());
    // Confirm whether the transaction went through or not
    await connection.confirmTransaction(signature);
    //Signature chhap diya idhar
    console.log("Signature: ", signature);
    document.querySelector('.cover').style.display = "none";
    }catch(e){
      document.querySelector('.cover').style.display = "none";
    }
    
  }
});
