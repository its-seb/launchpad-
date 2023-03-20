# Launchpad
Launchpad is a no-code solution for algorithmic artwork generation, smart contract deployment and distribution of NFTs. 

##### Live Website: https://goofy-neumann-fd67a4.netlify.app/
##### Testnet: Sejong
### Do note that ICON Python execution engine has deprecated and the website is no longer functional

### Problems faced by artists / Inspiration
#### 1. Lack of technical knowledge
- Artists have ready-designed artworks and wish to enter the NFT scene, however, existing marketplaces do not support mass uploading
- Lack technical expertise to customize and deploy their own smart contract
- As such, they miss out on opportunity to monetize and promote their creations
#### 2. Cost & risk associated with outsourcing
- Creators may not have the resources to hire dedicated developers to work on their project
- Not every developers are good actors (counterparty risk), outsourcing work fundamentally relies on trust
#### 3. Time consuming & inefficient process
- Creators may not have time to pickup coding & relevant skills to launch their projects
- While developers do offer services to artists, these are temporary solutions that may not be calibrated to long-term continuity plans

## Proposed Solution
### Video Demo - https://youtu.be/M_h2eWVOAEw
[![IMAGE ALT TEXT](http://img.youtube.com/vi/M_h2eWVOAEw/0.jpg)](http://www.youtube.com/watch?v=M_h2eWVOAEw "Launchpad - Devera Blockathon")

#### 1. Artwork Generation
- Import layers of images
- Configure rarity of each images and merge them
- Generate merged images and metadata 

#### 2. Collection Dispenser
- Deploy custom IRC-31 contract
- Upload images and metadata to IPFS via Pinata Cloud
- Generate minting dApp and configure launch time / minting whitelist

### User Flow
![image](https://user-images.githubusercontent.com/9499796/151764300-592fb0d2-bfac-4e76-965a-875a925bc104.png)

## Solution Architecture
![image](https://user-images.githubusercontent.com/9499796/151760000-ebfbbe44-6e97-463b-8e8e-13addd2d7a8d.png)

## Local Deployment
#### Pre-requisites
1. ICONex Wallet (https://chrome.google.com/webstore/detail/iconex/flpiciilemghbmfalicajoolhkkenfel?hl=en)
2. NodeJS

#### Test Guide
1. Clone and unzip repository to a folder
2. Open CLI and ```cd``` to package directory
3. Run ```npm install``` to install dependencies 
4. Run ```npm start``` to start local server
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notes:
- To generate the images, we have uploaded a set of sample layers that you can work with under ```./samples/ directory```
- Contracts are deployed on Sejong Testnet, please make sure you have sufficient ICX when creating collections

## Limitations
- Artwork generation only supports static images
- Unable to link multiple collections under one parent contract
- Lack integration with Craft Marketplace (only artist-to-user sales available for now)

## Roadmap
- [ ] Migration to Java SCORE
- [ ] Integration with Craft Marketplace for secondary sales
- [ ] Supporting different types of NFTs (e.g., Music, Event Tickets, In-game assets)

## Resources
##### Medium - (https://medium.com/@justin.mok.2020/launchpad-the-go-to-nft-minting-solution-e5b0b686ad02)

##### Slides - (https://docs.google.com/presentation/d/1is7rN8gtYgGrecR8nc653bLBN8FT0caA5buM4SZBkRE/edit#slide=id.p1)

##### Testnet Faucet - (https://faucet.ibriz.ai/)

## Footnote
We started this project in December during our winter break with zero knowledge on development in ReactJS and smart contract as well as deployment to production server. We're proud to have delivered a functional and hopefully a user-friendly product for the hackathon. Apart from this, we also got to learn more about the painpoints from the artists' perspective as they enter the NFT space. Our focus, from start to end, had always been user-first to make the experience as seamless as possible to lower the technical barriers to entry for artists and creators. So in that aspect, we're also proud of our user interface which was the result of countless iterations to improve the user flow. 
Nonetheless, it was an extremely enriching and fruitful experience for us. Thank you for this opportunity! :)

## Team
Hey there! We're a group of students from Singapore Management University!

#### BY
* Email: bytan.2021@scis.smu.edu.sg
* LinkedIn: https://www.linkedin.com/in/tanboonyeow/

#### JR
* Email: jinrui.seah.2021@economics.smu.edu.sg
* Linkedin: https://www.linkedin.com/in/seah-jin-rui/

#### Justin
* Email: justin.mok.2020@business.smu.edu.sg
* Linkedin: https://www.linkedin.com/in/justinmok1998/

#### Sebastian
* Email: cpong.2021@scis.smu.edu.sg
* Linkedin: https://www.linkedin.com/in/sebastian-ong98/

#### Yong Jiun
* Email: yjlew.2020@scis.smu.edu.sg
* LinkedIn: https://www.linkedin.com/in/yongjiun/
