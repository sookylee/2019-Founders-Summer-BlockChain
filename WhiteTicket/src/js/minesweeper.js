/* TODO 
 * 1. Map make
 * 2. tbody 생성 
 * 3. td에 좌클릭, 우클릭 event handler 달기
 * 4. 재귀 open함수 구현
 */

var mineMap = []; // for data
var tbody = document.querySelector('#table tbody'); // for display

var hor = 40;
var ver = 20;
var mine = 0;
var flag; // end flag
var openNum; // 열린 칸 개수


	/* var initialize */
	mineMap = []; // mineMap clear
	openNum = 0; // open Number clear
	flag = false; // end flag
//	hor = Number(document.querySelector('#hor').value);
//	ver = Number(document.querySelector('#ver').value);
//	mine = Number(document.querySelector('#mine').value);
	/* var initialize end */

	/* make map & add listener(우클릭,좌클릭) */
	var number = Array(hor * ver)
		.fill()
		.map(function(element,idx){
		return idx;
	});
    

	for(i = 0 ; i < ver ; i ++){
		var row = [];
		var tr = document.createElement('tr'); 
		mineMap.push(row);
		for(j = 0 ; j < hor ; j++){
			row.push(0);
			var td = document.createElement('td');

			/*td를 생성하고 바로 이벤트 달아야함
			* e.currentTarget => eventListener을 단 대상
			* e.Target => eventListener가 실행된 대상
			* tbody에 event 달고 td에서 event가 발생된다면 두개는 다름
			*/

			td.addEventListener('contextmenu',function(e){ // 우클릭 listener
				if(flag) return;
				e.preventDefault(); // 원래 효과 끔
				//e.currentTarget == td
				var pTr = e.currentTarget.parentNode; // td의 parent -> tr
				var pTbody = e.currentTarget.parentNode.parentNode; // tr의 parent -> tbody
				//tbody는 유사배열이라서 indexOf 못씀 -> prototype으로 되게함
				//tbody.children[r].children[c]로 접근 가능
				var c = Array.prototype.indexOf.call(pTr.children, e.currentTarget);
				var r = Array.prototype.indexOf.call(pTbody.children, pTr); 
			    if(mineMap[r][c] === 1) return;

				/* map change */
				if(e.currentTarget.textContent === ''){
					e.currentTarget.textContent = '!';
					e.currentTarget.classList.add('boomed');
				}
				else if(e.currentTarget.textContent === '!'){
					e.currentTarget.textContent = '?';
					e.currentTarget.classList.remove('boomed');
					e.currentTarget.classList.add('question');
				}
				else{
					e.currentTarget.classList.remove('question');
					e.currentTarget.textContent = '';
				}
				/* map change */
			});

			td.addEventListener('click',function(e){ // 좌클릭 listener
				if(flag) return;
			
				var pTr = e.currentTarget.parentNode;
				var pTbody = e.currentTarget.parentNode.parentNode;
				var c = Array.prototype.indexOf.call(pTr.children, e.currentTarget);
				var r = Array.prototype.indexOf.call(pTbody.children, pTr); 


				if(mineMap[r][c] === 'X'){
					e.currentTarget.textContent = 'X';
					e.currentTarget.classList.add('boomed');
					document.querySelector('#result').textContent = '펑!';
					flag = true;
				}
				else if(mineMap[r][c] === 0) tbody.children[r].children[c].classList.add('opened');
			});
			tr.append(td);
		}
		tbody.append(tr);
	}
	/* make map end */

	/* 지뢰 심기 */
	for(i = 0 ; i < mine ; i++){
		var idx = Math.floor(Math.random() * number.length);
		var num = number.splice(idx,1)[0];
		var r = Math.floor(num / ver);
		var c = num % ver;
		mineMap[r][c] = 'X'
	}
	//console.log(mineMap);
	/* 지뢰 심기 end */
 

// recursive open function //
function open(r,c){
	// mineMap[r][c]를 visited array처럼 사용
	if(flag) return;
	if(r < 0 || r >= ver || c < 0 || c >= hor) return;
	if(mineMap[r][c] === 1) return;
	tbody.children[r].children[c].classList.add('opened'); // 이렇게 배열처럼 접근가능
	openNum++;
	
	var cnt = 0;
	for( i = r-1 ; i < r+2 ; i++){
		if(i < 0 || i >= ver) continue;
		for( j = c-1 ; j < c+2 ; j++){
			if(j < 0 || j >= hor) continue;
			if(mineMap[i][j] == 'X') cnt++;
		}
	}
	if(cnt!=0)	tbody.children[r].children[c].textContent = cnt;
	mineMap[r][c] = 1; 

	if(openNum === ver * hor - mine){
		document.querySelector('#result').textContent = '지뢰찾기 성공!';
		flag = true;
		return;
	}

	/* 자바 스크립트 진짜 좀 구대기인게 
	 * for(~) 안에 재귀함수 넣어 놓으면 마지막 인덱스로 들어감
	 * 클로저인지 뭐시긴지 때문인듯
	 */

	if(cnt == 0){
		open(r-1,c-1);
		open(r-1,c);	
		open(r-1,c+1);	
		open(r,c-1);		
		open(r,c+1);	
		open(r+1,c-1);	
		open(r+1,c);	
		open(r+1,c+1);
	}
}
// recursive open function end//
