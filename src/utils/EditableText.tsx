import { TextField } from "@mui/material"
import { ComponentProps, Dispatch, SetStateAction, useState } from "react"

type EditableTextProps = Omit<ComponentProps<typeof TextField>, "onChange" | "value"> & {
    value: any
    onChange: Dispatch<SetStateAction<string>> | ((newValue: string) => void)
    wrapperProps?: ComponentProps<"div">
}

export function EditableText(props: EditableTextProps) {
    const [edited, setIsEdited] = useState(false)

    return <div
        onClick={() => setIsEdited(true)}
        onBlur={() => setIsEdited(false)}>
        {edited ?
            <TextField
                size="small"
                value={props.value}
                onChange={e => props.onChange(e.target.value)} />
            :
            props.value}
    </div>
}