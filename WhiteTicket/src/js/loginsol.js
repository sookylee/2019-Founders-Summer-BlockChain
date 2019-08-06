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
       console.log("test000");
    } else {
      // set the provider you want from Web3.providers
      
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON('/contracts/GetterSetter.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var GetterSetterArtifact = data;
      
      App.contracts.GetterSetter = TruffleContract(GetterSetterArtifact);
    
       console.log(App.contracts.GetterSetter);
      // Set the provider for our contract.
      App.contracts.GetterSetter.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#test', App.handleTransfer);
  },

  handleTransfer: function(event) {
    event.preventDefault();

  
    
    var GetterSetterInstance;
      App.contracts.GetterSetter.deployed().then(function(instance) {
      
        GetterSetterInstance = instance;
        console.log(GetterSetterInstance);
           return instance.getMessage.call();
      }).then(function(result) {
        alert("result : "+result);
        return App.getBalances();
      }).catch(function(err) {
      
        console.log(err.message);
      });
   
          
  },

  getBalances: function() {
    
    console.log('Getting balances...');
    /*
    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
