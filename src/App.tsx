import { useEffect, useState } from "react"
import { TasksTable } from "./tasks/TasksTable"
import { Task } from "./types"
import { AddTask } from "./tasks/AddTask"
import { Stack, Paper } from "@mui/material"
import { LabeledSlider } from "./utils/FormikSlider"
import { mapExponentially } from "./utils/mapExponentially"
import { useDebounce } from "./utils/useDebounce"

const perfectDesireToImportanceRatio = 0.25


function getSettingsFromLocalStorage() {
  const tasksItem = localStorage.getItem("settings")
  if (!tasksItem) {
    return
  }

  return JSON.parse(tasksItem) as Settings
}

type Settings = {
  tasks: Task[]
  desireCoefficient: number
}

function saveSettinsToLocalStorage(settings: Settings) {
  localStorage.setItem("settings", JSON.stringify(settings))
}

function DesireCoefficientSlider(props: { value: number, setValue: (newValue: number) => void}) {
  const {toExpValue, toLinearValue} = mapExponentially(0, 100, 0.01, 1)

  const offsetFromPerfect = Math.abs(props.value - perfectDesireToImportanceRatio) * 256 / 0.7

  return <LabeledSlider
    min={0}
    max={100}
    step={1}
    scale={toExpValue}
    label="Desire to importance ration (how important is your desire relative to the objective importance of a task)"
    value={toLinearValue(props.value)}
    onChange={(_, value) => props.setValue(toExpValue(Number(value)))}
    valueLabelDisplay="auto"
    className="desire-coefficient-slider"
    style={{
      "--color": `rgb(${offsetFromPerfect * 2 - 150}, ${200 - offsetFromPerfect}, ${256 - Math.abs(offsetFromPerfect - 0.5 * 256) * 2})`
    } as any}
  />
}

function App() {
  const initialData: Settings = getSettingsFromLocalStorage() || {} as Settings
  const [tasks, setTasks] = useState<Task[]>(initialData.tasks || [])
  const [desireCoefficient, setDesireCoefficient] = useState(initialData.desireCoefficient || perfectDesireToImportanceRatio)
  

  

  useEffect(() => {
    saveSettinsToLocalStorage({
      tasks,
      desireCoefficient
    })
  }, [tasks, desireCoefficient])

  function addTask(task: Task) {
    setTasks(tasks => [...tasks, task])
  }

  function deleteTask(id: number) {
    setTasks(tasks => tasks.filter(task => task.id !== id))
  }

  return <Paper sx={{ margin: "1em", padding: "1em" }}>
    <Stack
      direction="column">

      <DesireCoefficientSlider
        value={desireCoefficient}
        setValue={setDesireCoefficient} />

      <AddTask
        add={addTask} />

      <TasksTable
        deleteTask={deleteTask}
        desireCoefficient={desireCoefficient}
        tasks={tasks}
        setTasks={setTasks} />
    </Stack>
  </Paper>
}

export default App
