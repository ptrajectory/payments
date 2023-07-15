import { type Meta, type StoryFn } from "@storybook/react"
import Input, { InputProps } from "."



export default {
    title: "Components/Atoms/Input",
    component: Input,
} as Meta<typeof Input>

const Template: StoryFn<typeof Input> = (args: InputProps) => <Input {...args} />

export const Default = Template.bind({})

Default.args = {
    placeholder: "Phone Number",
    input_size: "md",
}