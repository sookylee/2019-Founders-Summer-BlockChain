App = {
    web3Provider: null,
    contracts: {},
  
    init: async function() {
      return await App.initWeb3();
    },
  
    initWeb3: async function() {
      // Initialize web3 and set the provider to the testRPC.
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
        console.log(App.web3Provider);
        web3 = new Web3(web3.currentProvider);
         
      } else {
        // set the provider you want from Web3.providers
        
        App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
        web3 = new Web3(App.web3Provider);
      }
  
      return App.initContract();
    },
  
    initContract: function() {
      
      $.getJSON('/contracts/Ticketing.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var TicketingArtifact = data;
        
        App.contracts.Ticketing = TruffleContract(TicketingArtifact);
      
         console.log(App.contracts.Ticketing);
        // Set the provider for our contract.
        App.contracts.Ticketing.setProvider(App.web3Provider);
  
        // Use our contract to retieve and mark the adopted pets.
        return App.getBalances();
      });
  
      return App.bindEvents();
    },
  
    bindEvents: function() {
      $(document).on('click', '#resell', App.handleTransfer);
    },
  
    handleTransfer: function(event) {
      event.preventDefault();
  
     // function reSellTicket(string memory artist, uint _row, uint _col, 
     //   address _seller, uint _uploadTime) public payable{ 
  
      var RefundingInstance;
        App.contracts.Ticketing.deployed().then(function(instance) {
     

         RefundingInstance = instance;
         
          return instance.reSellTicket('bts',1,3,'0x07b0d1AB04cCAdf9060E29906DD1B58B803aBF25',{value:1000000000000000000});
        }).then(function(result) {
          console.log("result : "+result);
          return App.getBalances();
        }).catch(function(err) {
        
          console.log(err.message);
        });
     
            
    },
  
    getBalances: function() {
      
      console.log('Getting balances...');

    }
  
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });