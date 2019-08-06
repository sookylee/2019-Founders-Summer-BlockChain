pragma solidity ^0.5.0;

/*해당 컨트랙트는 웹에서 구현할 필요가 없다.
컨트랙트안의 함수만 호출이 되며 송금 환불 등의 역할을 한다.
새로운 공연이 시작될 때마다 배포되며 설정한 날짜가 지나면 컨트랙트에서 정산이 완료된다.
*/
contract agencyAddress {
    address payable Agency; //공연 등록자
    address payable Owner; // 우리 주소
    address payable donationPoint; // 설정한 기부 포인트
    
    uint timeCancel; // 공연이 끝나는 날짜(돈을 받을 수 있는 날짜)
    uint Fee = 10; // 우리에게 오는 수수료(%) 눈에 보이기 쉽게 일단 10으로 설정
    
 //해당 함수는 처음 만들어질때만 생성이된다.
// 변수들이 설정된다.
    constructor (address payable _agency, address payable _owner, uint _time, address payable _donateAddr) public{
        require(Agency == address(0), "[ERROR]Not vacant");
        Agency = _agency;
        Owner = _owner; // Our address
        timeCancel= _time;
        donationPoint=_donateAddr;
    }
    
//이후 공연 등록자가 돈을 받을 때 실행하는 함수
    function receiveMoney(address _agency, uint _donationAmount) external payable{
        require (Agency == _agency);
        require (now >= timeCancel);
        //공연이 끝나는 날짜 이후가 되어야 받을 수 있다.

        donationPoint.transfer(_donationAmount);
        selfdestruct(Agency); // destruct contract and send ether to Agency
/*순차적으로 기부자에게 돈을 보내고 수익금의 일부를 가져가며 컨트랙트를 파괴하고 남은 잔액은 공연 등록자에게 보낸다*/
    }
    
//마찬가지로 호출되는 함수이며 환불할때 호출된다//
    function refund(address payable  _user, uint price) external payable{
        _user.transfer(price); // price는 티켓 가격
    }
    
    //이 contract의 address 반환.
    function getAddress() external view returns(address payable){
        return address(this);
    }

    function () external payable{
    }
}
