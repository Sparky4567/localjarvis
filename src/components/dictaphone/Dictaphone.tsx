import { useState, useEffect } from "react";

const Dictaphone = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const castedWindow = window as any;
    const SpeechRecognition =
      castedWindow.SpeechRecognition || castedWindow.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = "en-US";

      // Event listener for when speech is recognized
      recognizer.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        // Loop through results and set transcript
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
        // eslint-disable-next-line prefer-const
        let questionField = document.querySelector("#questionField");
        // eslint-disable-next-line prefer-const
        let castedElement = questionField as HTMLInputElement;
        if (castedElement !== null) {
          castedElement.value = finalTranscript + interimTranscript;
        }
      };

      setRecognition(recognizer);
    } else {
      alert("Speech Recognition not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      // eslint-disable-next-line prefer-const
      let casted = recognition as any;
      casted.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      // eslint-disable-next-line prefer-const
      let casted = recognition as any;
      casted.stop();
      setListening(false);
    }
  };

  return (
    <div>
      <h1>Speech Recognition</h1>
      <p id="transcript">{transcript || "Speak something..."}</p>
      <button onClick={listening ? stopListening : startListening}>
        {listening ? "Stop Listening" : "Start Listening"}
      </button>
    </div>
  );
};

export default Dictaphone;
