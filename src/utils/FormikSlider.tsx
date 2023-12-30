import { FormControl, FormControlLabel, FormHelperText, Slider } from "@mui/material"
import { useField } from "formik"
import { ComponentProps } from "react"

type AdditionalProps = {
    label?: string
    helperText?: string
    error?: boolean
}

type SliderProps = ComponentProps<typeof Slider>
type FormikSliderProps = Omit<SliderProps, "onChange" | "value"> & {
    name: string
    label?: string
}


export function LabeledSlider({ error, helperText, ...props }: SliderProps & AdditionalProps) {
    return <FormControl >
        <FormControlLabel
            labelPlacement="top"
            label={props.label}
            control={<Slider
                {...props}
            />}>
        </FormControlLabel>

        <FormHelperText error={error}>
            {helperText}
        </FormHelperText>
    </FormControl>
}

export function FormikSlider(props: FormikSliderProps) {
    const [field, meta] = useField(props.name)

    return <LabeledSlider
        {...props}
        value={field.value === undefined ? props.min : field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        helperText={meta.error}
        error={!!meta.error}
    />
}