import {Meta, StoryFn} from "@storybook/react"
import Create from "./create";


export default {
    title: "Organisms/ProductForms/Create",
    component: Create
} as Meta<typeof Create>

const Template: StoryFn<typeof Create> = (args: any) => <Create  {...args} />

export const Default = Template.bind({})

Default.args = {
    
}