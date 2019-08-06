pragma solidity ^0.5.0;
import "./agencyAddress.sol";

contract Ticketing {
    address payable owner; //우리 주소
    mapping(string => agencyAddress) accountMap; //address와 위 contract를 연결하는 맵
// 이후 해당 mapping으로 컨트랙트의 함수를 용이하게 사용이 가능하다.

    struct customer {
        uint donationAmount;
        uint donationPoint;
        address payable custAdrr;
    }//사용자(티켓구매자) 구조체
    
    struct seat {
        bool isEmpty;//
        customer[] person;
    }//자리상태 구조체
    
    struct transferList{
        address payable seller;
        uint price;
    }// 아직 구현 미정 만약 구현한다면 거래 매칭을 체인에 올리기 위한 용도로 사용
    
    struct Reward{
        uint rewardFee; // reward 추첨이 가능한금액
        uint rewardNum; // reward 총량
        uint rewardindex; // 현재 reward 지급량
        uint eventpercentage; //event 확률(%)
    }
//공연 관련 변수들
    struct concert {
        address payable agency;
        uint ticketPrice;
        uint limitTicketPrice;
        uint cancelFee; 
        uint donation; //기부총량
        uint soldout; // 판매량
        //uint cancelNum; // 콘서트 별 취소한 총 수량
        uint givingConstant; //for blackMoney
        // uint blackMoney; //from resell ticket. should send this to agency
        uint timeStamp; //contract generate time
        uint timeCancel; //available cancel time
        uint timeLastBook; //Last booking time

        /* seat information*/
        uint row;
        uint col;
        
        Reward reward;
        mapping(address => uint) rewardManage; //reward의 소유자를 나타냄
        
        mapping(uint => mapping(uint => seat)) seats; //자리에 대한 2차원 배열.
    }
    
    
    mapping(string => concert) concerts; //콘서트 매핑
    
    //컨트랙트 배포시 실행되며 우리의 주소가 담긴다
    constructor () public { // main contract 생성자
        owner = msg.sender;
    }
    
    // 좌석을 선택하기 위한 함수. (가수명(콘서트 매핑용), 자리의 행, 열)
//자리를 선택하면 해당 자리를 더 이상 선택할 수 없고, 자리를 선택한 구매 고객의 address와 
// 기부 금액 정보를 저장한다.
    function selectSeat(string memory artist, uint _row, uint _col) public payable returns (bool){
        //require(msg.value >= concerts[artist].ticketPrice, "[ERROR] Please check the price.");
        
        //require(now < concerts[artist].timeLastBook, "[ERROR] The booking time is over.");
        //require(isValidSeat(artist, _row, _col), "[ERROR] The seat have been sold already.");
        
        concerts[artist].seats[_row-1][_col-1].isEmpty = true;
        concerts[artist].seats[_row-1][_col-1].person.push(
                customer(msg.value - concerts[artist].ticketPrice-concerts[artist].ticketPrice/100, 0, msg.sender));
       
        concerts[artist].donation += msg.value - concerts[artist].ticketPrice-concerts[artist].ticketPrice/100;
        concerts[artist].soldout+=1;
        
//만약 지불한 금액 - 티켓가격> 리워드 추첨가능한 금액 리워드 추첨
        if(concerts[artist].reward.rewardFee <=msg.value - concerts[artist].ticketPrice){
            rewardManage(artist, msg.sender, msg.value - concerts[artist].ticketPrice, msg.sender);
        }
        //msg.value.transfer(accountMap[artist]);
        owner.transfer(concerts[artist].ticketPrice/100);
        accountMap[artist].getAddress().transfer(msg.value-concerts[artist].ticketPrice/100);
        
        return true;
    }
    
    // 본인이 본 컨트랙트를 통해 직접 구매한 티켓을 취소할 수 있도록 하는 메소드
    function cancelTicket(string memory artist, uint _row, uint _col) public payable{
        //require(msg.value == concerts[artist].cancelFee, "Please check the cancellation fee.");
        require((_row > 0) && (_row <= concerts[artist].row) && (_col > 0) && (_col <= concerts[artist].col) && 
                (concerts[artist].seats[_row-1][_col-1].isEmpty), 
                "[ERROR] No valid seat information.");
        require(msg.sender == concerts[artist].seats[_row-1][_col-1].person[0].custAdrr, "[ERROR] No authority to cancel.");
        require(now < concerts[artist].timeCancel, "[ERROR] Cancel time is over.");
        /*concerts[artist].seats[_row-1][_col-1].person[0].custAdrr.transfer(concerts[artist].ticketPrice);
        accountMap[artist].refund(concerts[artist].seats[_row-1][_col-1].person[0].custAdrr, concerts[artist].ticketPrice);*/
        
        // refund함수 호출  
        accountMap[artist].refund(msg.sender,concerts[artist].ticketPrice-concerts[artist].cancelFee);
        
//좌석 상태 변경
        concerts[artist].seats[_row-1][_col-1].person.pop();
        concerts[artist].seats[_row-1][_col-1].isEmpty = false;
        concerts[artist].soldout-=1;
    }
    
// web 게시판을 통해 얻은 티켓 판매자의 address를 통해 해당 자리가 진짜 seller의
//자리인지 확인하고, 맞다면, 티켓의 소유권을 넘겨받는 메소드. 
// reward 관리를 위해 이전 소유자의 정보를 seat에서 완전히 pop시키지는 않음.
// 자리의 소유권은 seats[][].person[0] 에게 있음.
    function reSellTicket(string memory artist, uint _row, uint _col, 
                        address _seller) public payable{ //for here, msg.sender is ppl who want to buy
                        
        require((_row > 0) && (_row <= concerts[artist].row) && (_col > 0) && (_col <= concerts[artist].col) 
            && (concerts[artist].seats[_row-1][_col-1].isEmpty), "[ERROR] No valid seat information.");

        require(_seller == concerts[artist].seats[_row-1][_col-1].person[0].custAdrr, "[ERROR] No authority to sell.");
        
        customer memory temp =  concerts[artist].seats[_row-1][_col-1].person[0];
        concerts[artist].seats[_row-1][_col-1].person.pop();
        concerts[artist].seats[_row-1][_col-1].person.push(customer(0, 0, msg.sender));
        concerts[artist].seats[_row-1][_col-1].person.push(temp);
        accountMap[artist].getAddress().transfer(msg.value / concerts[artist].givingConstant);
        temp.custAdrr.transfer(msg.value - msg.value / concerts[artist].givingConstant);
    }

    // 새로운 공연생성
    function newConcert(string memory artist, uint _row, uint _col, uint _ticketPrice, uint _limitTicketPrice, uint _cancelFee, uint _givingConstant, 
                    uint _timeCancel, uint _timeLastBook, address payable _donateAddr) public {
        uint timenow = now;

        //새로운 공연 컨트랙트 생성
        accountMap[artist] = new agencyAddress(msg.sender, owner, _timeCancel, _donateAddr);
        
        concerts[artist] = concert(msg.sender, _ticketPrice, _limitTicketPrice, _cancelFee, 0, 0, _givingConstant, 
                        timenow, timenow + _timeCancel * 1 days, timenow + _timeLastBook * 1 days, _row, _col, Reward(0, 0, 0, 0));
         
       
    }
    
    //it is 
    function newReward(string memory artist, uint _rewardFee, uint _rewardNum, uint _eventpercentage) isValidator(artist) public{
        require(_eventpercentage <=100 && _eventpercentage >0);
        concerts[artist].reward = Reward(_rewardFee, _rewardNum, 0, _eventpercentage);
    } 
    // function collectFees(string memory artist, address payable _donateAddr) isOwner public {
    //     owner.transfer(concerts[artist].bookingFee * concerts[artist].soldout + concerts[artist].cancelFee * concerts[artist].cancelNum);
    //     _donateAddr.transfer(concerts[artist].donation);
    //     concerts[artist].agency.transfer(concerts[artist].ticketPrice * concerts[artist].soldout + concerts[artist].blackMoney);
        
    // }
    
//해당 함수는 공연이 종료 되면 호출가능하며,  컨트랙트를 파괴하고 매핑해제
    function cancelConcert(string memory artist) isValidator(artist) public {
    require(now>=concerts[artist].timeCancel);
        accountMap[artist].receiveMoney(msg.sender, concerts[artist].donation);
        delete accountMap[artist];
    }

//리워드를 관리하는 함수이다
    function rewardManage(string memory artist, address _user, uint _donation, address _userAddress) internal{
        require(concerts[artist].reward.rewardFee <= _donation);
        require(concerts[artist].reward.eventpercentage <= 100);
        require(concerts[artist].reward.rewardNum >= concerts[artist].reward.rewardindex);
     
       //랜덤값은 일단은 주소를 100으로 나눴는데 이는 추후 논의할 예쩡 
        uint userReward= uint(uint160(_userAddress))%100;
        if(userReward <= concerts[artist].reward.eventpercentage){
            concerts[artist].rewardManage[_user]++; 
            concerts[artist].reward.rewardindex++;
        }
    }
    
    //리워드의 소유 여부를 증명할 수 있다.
    function CheckReward(string memory artist) public view returns(uint){
        return(concerts[artist].rewardManage[msg.sender]);
    }
    
    //우리만 사용가능
    modifier isOwner {
        require(owner == msg.sender, "[ERROR] You have no authority");
            _;
    }
    //주최자만 사용가능
    modifier isValidator(string memory artist) {
        require(concerts[artist].agency==msg.sender);
        _;
    }
    
    function isValidSeat(string memory artist, uint _row, uint _col) public view returns (bool){
        if((_row <= 0) || (_row > concerts[artist].row) || (_col <= 0) || (_col > concerts[artist].col) 
            || concerts[artist].seats[_row-1][_col-1].isEmpty)
            return false;
        
        else return true;
    }
    
    function isValidPrice(string memory artist, uint _price) public view returns(bool){
        return (concerts[artist].limitTicketPrice < _price ? false : true);
    }
    
}


