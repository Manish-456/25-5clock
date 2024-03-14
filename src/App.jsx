import { useState } from "react";
import { ArrowDown, ArrowUp, Pause, Play, RotateCcw } from "lucide-react";

export default function App() {
  const beepSound =
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"; 
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(beepSound));

  const playBreakAudio = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) return;
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) return;
      setSessionTime((prev) => prev + amount);

      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const resetTimer = () => {
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setDisplayTime(25 * 60);
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakAudio();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }

            return prev - 1;
          });

          nextDate += second;
        }
      }, 1000);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    setTimerOn((prev) => !prev);
  };

  return (
    <div className="min-h-screen max-w-md justify-center w-full flex flex-col gap-8 items-center mx-auto">
      <div>
        <h2 className="text-5xl md:text-7xl">25 + 5 Clock</h2>
      </div>
      <div className="flex w-full justify-between">
        <div>
          <Length
            title={"Break Length"}
            formatTime={formatTime}
            time={breakTime}
            changeTime={changeTime}
            type={"break"}
          />
        </div>
        <div>
          <Length
            title={"Session Length"}
            time={sessionTime}
            formatTime={formatTime}
            changeTime={changeTime}
            type={"session"}
          />
        </div>
      </div>

      <div
        className={`border-8  p-2 rounded-[25%] ${
          onBreak
            ? "border-red-500 text-red-500"
            : "border-slate-700 text-white"
        } `}
      >
        <div className="p-8 flex flex-col gap-2">
          <p className="text-center text-2xl">
            {onBreak ? "Break" : "Session"}
          </p>
          <div className="text-6xl">{formatTime(displayTime)}</div>
        </div>
      </div>

      <div className="controls flex gap-3">
        {timerOn ? (
          <button type="button" onClick={controlTime}>
            <Pause className="h-8 w-8" fill="white" />
          </button>
        ) : (
          <button type="button" onClick={controlTime}>
            <Play className="h-8 w-8" fill="white" />
          </button>
        )}
        <button type="button" onClick={resetTimer}>
          <RotateCcw className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}

function Length({ title, time, type, formatTime, changeTime }) {
  return (
    <div>
      <h3 className="text-2xl font-normal">{title}</h3>
      <div className="flex gap-2 items-center mt-2">
        <button
          className="p-0"
          type="button"
          onClick={() => changeTime(60, type)}
        >
          <ArrowUp className="h-8 w-8" />
        </button>
        <span className="text-3xl">{formatTime(time)}</span>
        <button
          className="p-0"
          type="button"
          onClick={() => changeTime(-60, type)}
        >
          <ArrowDown className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
