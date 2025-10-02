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
    const cardstatscont=document.querySelector("statscard");


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

        const data = await response.json();
        console.log("logging data", data);

    } catch (error) {
        console.error(error);
        statscont.innerHTML = '<p>No data found</p>';
    } finally {
        searchbutton.textContent = "Search";
        searchbutton.disabled = false;
    }
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