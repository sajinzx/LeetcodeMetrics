document.addEventListener("DOMContentLoaded",function(){
    const searchbutton=document.getElementById("searchbutton");
    const usernameinput=document.getElementById("usernameinput");
    const statscont=document.querySelector(".stats");
    const easyprogresscircle=document.querySelector(".easyprogress");
    const mediumprogresscircle=document.querySelector(".mediumprogress");
    const hardprogresscircle=document.querySelector(".hardprogress");
    const easylabel=document.getElementById("easylabel");
    const mediumlabel=document.getElementById("mediumlabel");
    const hardlabel=document.getElementById("hardlabel");
    const cardstatscont=document.querySelector(".statscard");


    function validateusername(username)
    {
        if(username.trim()==="")
        {
            alert("Username should not be empty");
            return false;
        }
        const regex= /^[a-zA-Z0-9_-]{1,15}$/;
        const ismatching=regex.test(username);
        if(!ismatching)
        {
            alert("invalid username");
        }
        return ismatching;
    }
    
    async function fetchuserdetails(username) {
    try {
        searchbutton.textContent = "Searching...";
        searchbutton.disabled = true;

        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const targeturl = "https://leetcode.com/graphql/";

        const myHeaders = {
            "Content-Type": "application/json",
        };

        const graphql = JSON.stringify({
            query: `
              query userSessionProgress($username: String!) {
                allQuestionsCount{
                    difficulty
                    count
                }
                matchedUser(username: $username) {
                  submitStats {
                    acSubmissionNum {
                      difficulty
                      count
                      submissions
                    }
                  }
                }
              }
            `,
            variables: { username: username }
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
        };

        const response = await fetch(proxyurl + targeturl, requestOptions);

        if (!response.ok) {
            throw new Error("Unable to fetch the user details");
        }

        const parseddata = await response.json();
        console.log("logging data", parseddata);
        displayuserdata(parseddata);

    } 
    catch (error) {
        console.error(error);
        statscont.innerHTML = '<p>No data found</p>';
    } 
    finally {
        searchbutton.textContent = "Search";
        searchbutton.disabled = false;
    }
    }

    function updateprogress(solved,total,label,circle)
    {
        const progressdata=(solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressdata}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayuserdata(parseddata)
    {
        // const totalques=parseddata.data.allQuestionsCount[0].count;
        // const totaleasyques=parseddata.data.allQuestionsCount[1].count;
        // const totalmediumques=parseddata.data.allQuestionsCount[2].count;
        // const totalhardques=parseddata.data.allQuestionsCount[3].count;
        const allCounts = parseddata.data.allQuestionsCount;
        const totaleasyques = allCounts.find(q => q.difficulty === "Easy").count;
        const totalmediumques = allCounts.find(q => q.difficulty === "Medium").count;
        const totalhardques = allCounts.find(q => q.difficulty === "Hard").count;


        const solvedtotalques=parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedtotaleasyques=parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedtotalmediumques=parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedtotalhardques=parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;
        // const solvedCounts = parseddata.data.matchedUser.submitStats.acSubmissionNum;
        // const solvedtotaleasyques = solvedCounts.find(q => q.difficulty === "Easy").count;
        // const solvedtotalmediumques = solvedCounts.find(q => q.difficulty === "Medium").count;
        // const solvedtotalhardques = solvedCounts.find(q => q.difficulty === "Hard").count;


        updateprogress(solvedtotaleasyques,totaleasyques,easylabel,easyprogresscircle);
        updateprogress(solvedtotalmediumques,totalmediumques,mediumlabel,mediumprogresscircle);
        updateprogress(solvedtotalhardques,totalhardques,hardlabel,hardprogresscircle);

        const carddata=[
            {label:"total submissions",value:parseddata.data.matchedUser.submitStats.acSubmissionNum[0].submissions},
            {label:"total easy submissions",value:parseddata.data.matchedUser.submitStats.acSubmissionNum[1].submissions},
            {label:"total medium submissions",value:parseddata.data.matchedUser.submitStats.acSubmissionNum[2].submissions},
            {label:"total hard submissions",value:parseddata.data.matchedUser.submitStats.acSubmissionNum[3].submissions},
        ];
        //const carddata=parseddata.data.matchedUser.submitStats.acSubmissionNum;
        //directly assign array;

        console.log(carddata);

        cardstatscont.innerHTML=carddata.map(
            data=>`
                    <div class="card">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                    </div>
                `
        )
    }


    searchbutton.addEventListener('click',function(){
        const username=usernameinput.value;
        console.log("login username",username);
        if(validateusername(username))
        {
            fetchuserdetails(username);
        }
    })
})