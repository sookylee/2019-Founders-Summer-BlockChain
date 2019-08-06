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
    $(document).on('click', '#buyticket', App.handleTransfer);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    

    var TicketingInstance;
      App.contracts.Ticketing.deployed().then(function(instance) {
        //alert(parseInt('B',16)-parseInt('A',16));
        var row;
        var col;
        var ticketprice = $('#ticketprice').val();



       TicketingInstance = instance;
       $(".seats").each(function(){
        if($(this).prop("checked")==true){
           row = parseInt($(this).val()[0],20) - parseInt('A',20) + 1;
          col = parseInt($(this).val()[1],20);
        }
       })
        return instance.selectSeat('bts',row,col,{value:ticketprice});
      }).then(function(result) {
        console.log("result : "+result);
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
