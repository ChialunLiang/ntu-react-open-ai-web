"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
// vocab card 
import VocabGenResultCard from "@/components/VocabGenResultCard";
// the word card that will show when waiting for response 
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";
import { userAgentFromString } from "next/server";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    // when [] is empty the code below will only run first render happens 
    axios
      .get("/api/vocab-ai")
      .then(res => {
        console.log("res:", res);
        setVocabList(res.data.dataList)
      })
      .catch(err => {
        console.log("err:", err);
      });
  }, []);


  // Turn data to renderable component via loop
  const items = vocabList.map(result => {
    return <VocabGenResultCard result={result} key={result.createdAt} />
  });

  function submitHandler(e) {
    e.preventDefault();
    console.log("User Input: ", userInput);
    console.log("Language: ", language);
    const body = { userInput, language };
    console.log("body:", body);
    // set isWaiting to true
    setIsWaiting(true);
    setUserInput("");
    //  將body POST到 /api/vocab-ai { userInput: "", language: "" }
    axios.post("/api/vocab-ai", body)
      .then(res => {
        // When front-end and back-end dock without any problmes 
        // the data that back-end gives to front-end will be packaged in res.data
        console.log("res:", res);
        const result = res.data;
        // update state
        // place the newest search result at the start 
        setVocabList([result, ...vocabList])
        setIsWaiting(false);
      })
      .catch(err => {
        // when error occrus such as: code errror key error or netwrok break 
        console.log("err:", err);
        alert("error occured, please retry again later");

        setIsWaiting(false);
      });
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  type="text"
                  className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                  placeholder="Enter a word or phrase"
                  required
                />
              </div>
              <div className="w-1/5 px-2">
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="English">English</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton isWaiting={isWaiting} />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* if isWaiting  is true then show isWaiting card  */}
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          {/*  顯示AI輸出結果 */}
          {items}
        </div>
      </section>
    </>
  );
}
