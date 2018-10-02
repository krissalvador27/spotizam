import Recorder from "recorderjs";

// declare const AudioContext: any;

export function getRecorder(): Promise<any> {
  return new Promise(resolve => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        // @ts-ignore
        let AudioContextShim = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContextShim();
        const audioNode = audioContext.createMediaStreamSource(stream);
        const recorder = new Recorder(audioNode, { numChannels: 1 });

        if (recorder) {
          resolve(recorder);
        }
      });
  });
}

export function requestSpeechToText(audio: Blob): Promise<any> {
  const params: RequestInit = {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": `${process.env.REACT_APP_MICROSOFT_KEY}`,
      Accept: "application/json;text/xml",
      Host: "eastus.stt.speech.microsoft.com"
    },
    body: audio
  };

  return fetch(
    "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&profanity=raw",
    params
  ).then(res => {
    return res.json();
  });
}
