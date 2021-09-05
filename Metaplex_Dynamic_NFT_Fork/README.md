Built on top of Metaplex. Please go through the README_metaplex first. 

## How to get started: 

- Replace the REACT_APP_STORE_OWNER_ADDRESS_ADDRESS=YOUR_PUBLIC_WALLET_ADDRESS in js/packages/web/.env to connect to your own phantom wallet.
- Navigate to js directory. Run yarn and yarn build and check for errors. (Make sure the dependencies are satisfied. There might be some dependency issues while testing on another system)
- Run yarn start. Your webpage will now get hosted on you local server port 3000. Make sure that both your wallet and the metaplex store are connected to the devnet.
- Init the store. Now, if you are able to view the blank store you should be all set.

Please go through the below architecture pages and video demo before proceeding ahead.  

![alt text](https://github.com/rohitchillar/ChainReality/blob/main/Metaplex_Dynamic_NFT_Fork/Assets/Architecture/Elegant_Solution.png)

![alt text](https://github.com/rohitchillar/ChainReality/blob/main/Metaplex_Dynamic_NFT_Fork/Assets/Architecture/Intricate_Solution.png)

![Demo Video](https://www.youtube.com/watch?v=5m7CaAgNkmo)

## Alpha

- As shown in the video, you can follow the normal process of creating an NFT and choose the scripting option from the UI. 
- You will find uploadable HTML files in the Assets/html_scripts.

Note: While creating the NFT you will get around 4 transaction approve notifications from the wallet. We did this for debugging purposes. These can be reduced in the future. 

## Beta

- As shown in the video, you can follow the normal process of creating an NFT and choose the image option.
- Right now the conditions are hard coded in the rust program and they get triggered if the value of condition variable is 1 or 2. In the future, the user will have an option to input the conditions while creating NFT.
- Similarly, on the js side the current conditions will be an input from the frontend which will be validated by the rust program. Right now these inputs are also harcoded.
- When you will evolve the NFT according to the current conditions the picture should change to venasaur. It might not render correctly on the metaplex page but you can see that the NFT has evolved by clicking on the Arweave button. 


Note: When we try to clone the github repo and run it we get this error. *Cannot find module '@solana/spl-token-registry' or its corresponding type declarations.* But the code runs successfully on the our local pc. 
