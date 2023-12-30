import { useState } from "react";
import Add from "@mui/icons-material/Add"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Task } from "../types";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup"
import { TextField } from "formik-mui";
import { Button, DialogActions, IconButton } from "@mui/material"
import { FormikSlider } from "../utils/FormikSlider";


type AddTaskProps = {
    add: (task: Task) => void
}



const options = (options: string[], valueOffset?: number) => options.map((label, index) => ({ value: index + (valueOffset || 0), label }))

export const importanceOptions = [
    // "Insignificant bad consequences",
    // "Slight negative effect",
    "Doesn't affect almost anything",
    "Insignificant effect",
    "Somewhat important",
    "Significant effect",
    "Very important",
    "Crucial / vital"
]

const importanceMarks = options(importanceOptions)

export const desireOptions = [
    "Totally unpleasant",
    "Merely unpleasant",
    "Neutral",
    "Pleasant / satisfying",
    "Very satisfying",
    "Increadibly enjoyable"
]

export const desireOffset = 0
const desireMarks = options(desireOptions, desireOffset)

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required(),
    importance: Yup.number()
        .required()
        .min(0)
        .max(importanceMarks.length - 1),
    desire: Yup.number()
        .required()
        .min(desireOffset)
        .max(desireMarks.length - 1 + desireOffset)
})

export function EditTaskDialog({ isOpen, close, initialValues, onSubmit, isEditing }: { isOpen: boolean, close: () => void, initialValues: Task, onSubmit: (task: Task) => void, isEditing?: boolean }) {
    return <Dialog
        open={isOpen}
        onClose={close}
        className="add-task-dialog">
        <DialogTitle>
            Add new task
        </DialogTitle>
        <DialogContent sx={{ maxWidth: "calc(100vw - 64px)", width: "600px", boxSizing: "border-box" }}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                // validate={console.log}
                validationSchema={validationSchema}>

                <Form
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1em",
                        padding: "1em 0"
                    }}>
                    <Field
                        component={TextField}
                        name="name"
                        label="Name"
                        size="small"
                    />

                    <FormikSlider
                        name="importance"
                        label="Importance"
                        marks={importanceMarks}
                        min={0}
                        max={importanceMarks.length - 1}
                    />

                    <FormikSlider
                        name="desire"
                        label="Desire to do"
                        marks={desireMarks}
                        min={desireOffset}
                        max={desireMarks.length - 1 + desireOffset}
                    />

                    <DialogActions
                        sx={{ marginTop: "1em", gap: "0.5em", flexDirection: "row", justifyContent: "flex-end" }}>
                        <Button onClick={close}>
                            Cancel
                        </Button>

                        <Button type="submit">
                            {isEditing ? "Save" : "Add"}
                        </Button>
                    </DialogActions>
                </Form>
            </Formik>

        </DialogContent>
    </Dialog>
}

export function AddTask(props: AddTaskProps) {
    const [isAdding, setIsAdding] = useState(false)

    function onSubmit(newTask: Task) {
        props.add({
            ...newTask,
            id: new Date().getTime()
        })
        setIsAdding(false)
    }

    const initialValues = {
        desire: 0 + desireOffset,
        importance: 0,
        name: ""
    } as Task

    return <>
        <IconButton
            style={{ backgroundColor: "white", margin: "1em", marginLeft: "auto" }}
            onClick={() => setIsAdding(true)}>
            <Add />
        </IconButton>

        <EditTaskDialog
            isOpen={isAdding}
            close={() => setIsAdding(false)}
            onSubmit={onSubmit}
            initialValues={initialValues} />
    </>
}
