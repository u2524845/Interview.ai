"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Loader2 } from "lucide-react";

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

type SpeechRecognitionCtor = new () => ISpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  return (
    (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition ??
    null
  );
}

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognition());
  }, []);

  function startListening() {
    const SR = getSpeechRecognition();
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => (r as SpeechRecognitionResult)[0].transcript)
        .join(" ");
      onTranscript(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      className="gap-2"
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
    >
      {isListening ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Use Voice
        </>
      )}
    </Button>
  );
}
