import { useEffect, useState, useCallback, useRef } from 'react'
import SpeechRecognition from 'react-speech-recognition'

type MediaRecorderProps = {
  recordingMinutes: number
  recordingSeconds: number
  initRecording: boolean
  mediaStream: MediaStream | null
  otherMediaStream?: MediaStream | null
  mediaRecorder: MediaRecorder | null
  audio: string
  blob: Blob | null
}
type MediaRecorderEvent = {
  data: Blob
}
type Interval = null | number | ReturnType<typeof setInterval>

const INITIAL_STATE = {
  recordingMinutes: 0,
  recordingSeconds: 0,
  initRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: '',
  blob: null,
}

export default function useMediaRecorder(beat: string) {
  const [recorderState, setRecorderState] = useState<MediaRecorderProps>(INITIAL_STATE)
  const recordAudioRef = useRef<any>(new Audio(beat))

  useEffect(() => {
    const MAX_RECORDER_TIME = 5
    let recordingInterval: Interval = null

    if (recorderState.initRecording)
      recordingInterval = setInterval(() => {
        setRecorderState(prevState => {
          if (
            prevState.recordingMinutes === MAX_RECORDER_TIME &&
            prevState.recordingSeconds === 0
          ) {
            typeof recordingInterval === 'number' && clearInterval(recordingInterval)
            return prevState
          }

          if (prevState.recordingSeconds >= 0 && prevState.recordingSeconds < 59)
            return {
              ...prevState,
              recordingSeconds: prevState.recordingSeconds + 1,
            }
          else if (prevState.recordingSeconds === 59)
            return {
              ...prevState,
              recordingMinutes: prevState.recordingMinutes + 1,
              recordingSeconds: 0,
            }
          else return prevState
        })
      }, 1000)
    else typeof recordingInterval === 'number' && clearInterval(recordingInterval)

    return () => {
      typeof recordingInterval === 'number' && clearInterval(recordingInterval)
    }
  })

  useEffect(() => {
    setRecorderState(prevState => {
      if (prevState.mediaStream)
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream),
        }
      else return prevState
    })
  }, [recorderState.mediaStream])

  useEffect(() => {
    const recorder = recorderState.mediaRecorder
    let chunks: Blob[] = []

    if (recorder && recorder.state === 'inactive') {
      recorder.start()

      recorder.ondataavailable = (event: MediaRecorderEvent) => {
        chunks.push(event.data)
      }

      recorder.onstop = () => {
        let mpegBlob = new Blob(chunks, { type: 'audio/mpeg-3' })
        chunks = []

        recorderState.otherMediaStream?.getAudioTracks().forEach((track: any) => track.stop())
        setRecorderState(prevState => {
          if (prevState.mediaRecorder) {
            return {
              ...prevState,
              audio: window.URL.createObjectURL(mpegBlob),
              blob: mpegBlob,
              initRecording: false,
              mediaRecorder: null,
              mediaStream: null,
              otherMediaStream: null,
            }
          } else {
            return INITIAL_STATE
          }
        })
      }
    }

    return () => {
      if (recorder) {
        recorder.stream.getAudioTracks().forEach((track: any) => track.stop())
      }
    }
  }, [recorderState.mediaRecorder])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      SpeechRecognition.startListening({ continuous: true })

      var audio = recordAudioRef.current.captureStream()
      recordAudioRef.current.play()
      recordAudioRef.current.loop = true

      const audioContext = new AudioContext()
      let audioIn_01 = audioContext.createMediaStreamSource(stream)
      let audioIn_02 = audioContext.createMediaStreamSource(audio)
      let destination = audioContext.createMediaStreamDestination()

      audioIn_01.connect(destination)
      audioIn_02.connect(destination)

      setRecorderState(prevState => {
        return {
          ...prevState,
          initRecording: true,
          mediaStream: destination.stream,
          otherMediaStream: stream,
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  const stopRecording = () => {
    if (recorderState.mediaRecorder !== null) {
      if (recorderState.mediaRecorder.state !== 'inactive') {
        SpeechRecognition.stopListening()
        recorderState.mediaRecorder.stop()
        recordAudioRef.current.pause()
        recordAudioRef.current.currentTime = 0

        setRecorderState(prevState => {
          return {
            ...prevState,
            initRecording: false,
          }
        })
      }
    }
  }

  const resetRecording = () => {
    setRecorderState(INITIAL_STATE)
  }

  return {
    recorderState,
    startRecording,
    stopRecording,
    resetRecording,
  }
}
