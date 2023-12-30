import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { Task } from "../types";
import { Stack } from "@mui/material";

export function TableRow({ task, deleteTask, onEdit }: { task: Task, onEdit: (id: number) => void, deleteTask: (id: number) => void }) {

    return <tr>
        <td>{task.name}</td>
        <td>
            {task.importance}
        </td>
        <td>{task.desire}</td>
        <td>{task.priority}</td>
        <td>
            <Stack direction="row">
                <IconButton onClick={() => onEdit(task.id)} color="primary">
                    <Edit />
                </IconButton>

                <IconButton onClick={() => deleteTask(task.id)} color="danger">
                    <Delete />
                </IconButton>
            </Stack>
        </td>
    </tr>
}