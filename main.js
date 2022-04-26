let news= [];
let menus = document.querySelectorAll(".menus button"); // menus 아래 button을 한번에 다 가져와서 이용할 준비함
menus.forEach(menu=> menu.addEventListener("click", (event)=>getNewsByTopic(event))); // 어떤 menu 선택했는지 event로 식별하고(새로 객체만듬), 클릭시의 함수 설정해줌
let page = 1;
let total_pages=0;


let searchButton = document.getElementById("search-button"); //클릭 이벤트 설정하기위해서 만듬
let url;

// 각 함수에서 필요한 url을 만든다
// api호출 함수를 부른다 

const getNews = async ()=>{

    try{
        let header = new Headers({"x-api-key":"us8Cb38Mw3ptIz5UM8ntljP9vv-E58SNCwaryuduuFo",});
        url.searchParams.set('page', page); // append or set // 페이지 이동을 위해서, api의 url 뒤에 붙여줌 &page= page(맨위에 설정한 전역변수 page) 
        let response = await fetch(url,{headers:header});  // ajax, fetch, https 데이터 전달 방식 
        let data = await response.json();
        if(response.status == 200){
        if(data.total_hits == 0){
            throw new Error("검색된 결과값이 없습니다.");
        }
        console.log("받는 데이터가 뭐지?", data);
        news = data.articles; //뉴스 기사정보가 news에 저장되어 있음
        total_pages = data.total_pages; // 맨 위에 저장공간(변수) 만들어 놓고, 200으로 성공 출력시, 콘솔창에서 페이지값도 가져와서 변수에 저장함 
        page = data.page;
        console.log(news);
        render()
        pagenation();
        }else{
            throw new Error(data.message)
        }
    }catch(error){
        console.log("잡힌 에러는", error.message);
        errorRender(error.message);
    }

;}

const getLatestNews = async()=> {
    
    url= new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10'); // API용 URL 함수가 따로 있다
    getNews();
  

};

const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLowerCase(); // api 홈페이지에 나온 규칙에 따라서, 소문자로 가져와야 기능이 적용됨
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();



};


const getNewsByKeyword = async ()=>{
   
/* 1. 검색 키워드 읽어오기
   2. url에 검색 키워드 붙이기
   3. 헤더 준비
   4. url 부르기
   5. 데이터 가져오기
   6. 데이터 부르기 */

   let keyword = document.getElementById("search-input").value;
   url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=kr&page_size=10`);
   getNews();
};


const render=()=>{
    let newsHTML = "";
    newsHTML = news.map((item)=>{ //map의 결과값은 항상 array(배열), news라는 array에 들어있는 item 요소들 // 아래 class="row" 부트스트랩 기능, 자동으로 한줄로 맞춰서 나열해줌
        return ` <div class="row news space">  
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}"/>
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
            ${item.summary}
            </p>
            <div>
            ${item.rights} * ${item.published_date}
            </div>
        </div>
    </div>`
    })
    .join(''); // map타입(배열, array)를 string값으로 변환해서 ` 없애줌

    document.getElementById("news-board").innerHTML=newsHTML;
};


const errorRender = (message) => {
let errorHTML = `<div class="alert alert-danger text-center" role="alert">
${message}
</div>`
document.getElementById("news-board").innerHTML = errorHTML; // 바로 위에 정상작동하면, newsHTML출력, 오류 시, errorHTML 출력
};

const pagenation =()=>{
    let pagenationHTML = ``; 
    let pageGroup = Math.ceil(page/5);
    let last = pageGroup*5;
    let first = last-4; 
    
    pagenationHTML = `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`;

    for(let i=first;i<=last;i++){
        pagenationHTML += `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    };

    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`;

 
document.querySelector(".pagination").innerHTML=pagenationHTML; // pagenation이라는 클래스를 갖고있는 html 태그를 선택하라
 /* total_page
    page
    page group
    last
    first
    first~last 페이지 프린트 */
};

const moveToPage = (pageNum) =>{
    /* 1. 이동하고싶은 페이지를 알아야함
    2. 이동하고싶은 페이지를 가지고 api를 다시 호출 */
page = pageNum;
getNews();
};


searchButton.addEventListener("click", getNewsByKeyword);  // getNewsByKeyword 함수를 만든 후에 사용 되는게 맞기 때문에(호이스팅), 맨밑에서 사용함 
getLatestNews();

/* 
1.url 준비
2.헤더 준비
3.백엔드, 서버에 요청
4.데이터를 보여줌

async, await을 통해서 4번부터 시작 안하고, 3번 될때까지 기다렸다가, 데이터 받고 4번 순차적으로 실행하게 함
*/