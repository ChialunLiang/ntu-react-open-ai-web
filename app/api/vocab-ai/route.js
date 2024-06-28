import openai from "@/services/openai";
import { Langar } from "next/font/google";
import db from "@/services/firebase-db";

// HTTP METHOD: POST, GET, PUT(UPDATE), DELETE
export async function GET() {
    // from Firestore vocab-ai  obtain all collection documents 
    const snapshot = await db.collection("vocab-ai").orderBy("createdAt", "desc").get();
    const dataList = [];
    snapshot.forEach(doc => {
        // obtain data from documents 
        const data = doc.data();
        // console.log(data);
        // put data into dataList array
        dataList.push(data);
    });

    return Response.json({ dataList });

}
export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const { userInput, language } = body;
    console.log("front-end data:", userInput, language)
    // TODO: 透過GPT-4o模型讓AI回傳相關單字
    // 文件連結：https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js
    // JSON Mode: https://platform.openai.com/docs/guides/text-generation/json-mode?lang=node.js
    const systemPrompt = `請作為一個單字聯想AI根據所提供的單字聯想5個相關單字以及繁体中文的意思
    输入：机场
    语言：English
    ###回应JSON范例:
    {
        wordList: [单字1，单字2，...]
        zhWordList: [单字1繁中的意思，单字2繁中意思，...]
    }
    ####
    `;
    const propmpt = `输入：${userInput}语言：${language}单字`;

    const openAIReqBody = {
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": propmpt }
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    };
    const completion = await openai.chat.completions.create(openAIReqBody);
    const aiContent = completion.choices[0].message.content;
    // JSON.parse("{}") => {} string to object function 
    const payload = JSON.parse(aiContent);
    console.log("AI Response", payload, typeof payload);
    // data that front-end receives 
    const data = {
        title: userInput,
        language,
        payload,
        createdAt: new Date().getTime()
    }
    // save data to FireStore vocab-ai collection
    await db.collection("vocab-ai").add(data)
    // send object data to front-end
    return Response.json(data);
}