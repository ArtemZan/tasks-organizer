import { Button, CircularProgress, Table } from "@mui/joy"
import { Task } from "../types"
import Delete from "@mui/icons-material/Delete"
import { roundNumber } from "../utils/round"
import { EditTaskDialog, desireOffset, desireOptions, importanceOptions } from "./AddTask"
import { mapExponentially } from "../utils/mapExponentially"
import { Backdrop, Dialog, DialogActions, DialogTitle } from "@mui/material"
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDebounce } from "../utils/useDebounce"
import { TableRow } from "./TableRow"

const mapParam = (number: number, range: number) => roundNumber(number / (range - 1) * 10, 1)

function useFormattedTasks(tasks: Task[], desireCoefficient: number) {
    const mapImportance = useMemo(() => mapExponentially(0, importanceOptions.length - 1, 1, 11), [])

    const format = useCallback(() => tasks.map(task => ({
        ...task,
        importance: roundNumber(mapImportance.toExpValue(task.importance) - 1, 1),
        desire: mapParam(task.desire, desireOptions.length + desireOffset)
    })).map(task => ({
        ...task,
        priority: roundNumber(desireCoefficient * task.desire + task.importance, 1)
    })).sort((a, b) => b.priority - a.priority), [desireCoefficient, mapImportance, tasks])

    const [isLoading, setIsLoading] = useState(false)

    const formattedRef = useRef<(Task & { priority: number })[]>()
    if (!formattedRef.current) {
        formattedRef.current = format()
    }

    const prevRatio = useRef<number>()

    const debounceDesireRatio = useDebounce(300)

    // console.log(isLoading)
    const isRatioSame = prevRatio.current === desireCoefficient || prevRatio.current === undefined
    if (isRatioSame) {
        formattedRef.current = format()
    }

    useEffect(() => {
        // console.log("Has ratio changed: ", !isRatioSame, prevRatio.current, desireCoefficient)
        prevRatio.current = desireCoefficient
        if (isRatioSame) {
            return
        }

        setIsLoading(true)
        debounceDesireRatio(() => {
            setIsLoading(false)
            formattedRef.current = format()
        })

    }, [desireCoefficient, debounceDesireRatio, format, isRatioSame])


    return {
        formatted: formattedRef.current,
        isLoading
    }
}

type TasksTableProps = {
    desireCoefficient: number
    tasks: Task[]
    deleteTask: (id: number) => void
    isLoading?: boolean
    setTasks: Dispatch<SetStateAction<Task[]>>
}



function ConfirmDeleteTask({ task, close, isOpen, confirm }: { task: Task, close: () => void, isOpen: boolean, confirm: () => void }) {
    return <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Delete task '{task?.name}' ?</DialogTitle>

        <DialogActions>
            <Button onClick={close}>
                Cancel
            </Button>
            <Button
                startDecorator={<Delete />}
                color="danger"
                onClick={confirm}>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
}

export function TasksTable({ desireCoefficient, tasks, deleteTask, setTasks }: TasksTableProps) {
    const {
        formatted,
        isLoading
    } = useFormattedTasks(tasks, desireCoefficient)

    const [selectedTaskId, setSelectedTaskId] = useState<number>()
    const [isEditing, setIsEditing] = useState(false)
    const selectedTask = useMemo(() => tasks.find(task => task.id === selectedTaskId), [tasks, selectedTaskId]) as Task

    const [deletionRequested, setDeletionRequested] = useState(false)

    function onEdit(taskId: number) {
        setSelectedTaskId(taskId)
        setIsEditing(true)
    }

    console.log("Is table loading: ", isLoading)

    function onRequestDelete(taskId: number) {
        setSelectedTaskId(taskId)
        setDeletionRequested(true)
    }

    const onTaskChange = (id: number, update: Partial<Task>) => {
        setTasks(tasks => tasks.map(task => task.id !== id ?
            task
            :
            { ...task, ...update }))

        setIsEditing(false)
    }


    return <div style={{ position: "relative", overflow: "auto" }}>

        <Table
            variant="soft"
            color="neutral"
            className="tasks-table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th style={{ width: "100px" }}>Importance</th>
                    <th style={{ width: "100px" }}>Desire to do</th>
                    <th style={{ maxWidth: "400px", whiteSpace: "wrap" }}>Priority = <i>{desireCoefficient} * Desire + Importance</i> = </th>
                    <th style={{ width: "80px" }}></th>
                </tr>
            </thead>
            <tbody>
                {formatted.map(task => <TableRow
                    task={task}
                    key={task.id}
                    deleteTask={onRequestDelete}
                    onEdit={onEdit}
                />)}


            </tbody>
        </Table>

        <Backdrop open={!!isLoading}
            style={{ position: "absolute", backgroundColor: "#fff8", top: "50px" }}>
            <CircularProgress />
        </Backdrop>

        <EditTaskDialog
            isOpen={isEditing}
            close={() => setIsEditing(false)}
            onSubmit={task => onTaskChange(task.id, task)}
            isEditing
            initialValues={selectedTask} />

        <ConfirmDeleteTask
            task={selectedTask}
            isOpen={deletionRequested}
            close={() => setDeletionRequested(false)}
            confirm={() => {
                setDeletionRequested(false)
                deleteTask(selectedTaskId as number)
            }} />
    </div>
}