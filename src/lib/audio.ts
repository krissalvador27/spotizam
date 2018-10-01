import Recorder from "recorderjs";

declare const AudioContext: any;

export function getRecorder(): Promise<any> {
  return new Promise(resolve => {
    navigator.mediaDevices.getUserMedia({ audio: true, video : false })
      .then(stream => {
        const audioNode = new AudioContext().createMediaStreamSource(stream);

        resolve(new Recorder(audioNode))
      });
  });
}

export function requestSpeechToText(audio: Blob): Promise<any> {
  const params: RequestInit = {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": `${process.env.REACT_APP_MICROSOFT_KEY}`,
      "Accept": "application/json;text/xml",
      "Host": "eastus.stt.speech.microsoft.com"
    },
    body: audio
  };
  
  return fetch(
    "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&profanity=raw",
    params
  ).then(res => {
    return res.json()
  })
}