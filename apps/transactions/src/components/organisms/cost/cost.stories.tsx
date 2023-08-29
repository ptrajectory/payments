import {Meta, StoryFn} from "@storybook/react"
import Cost from ".";


export default {
    title: "Organisms/Cost",
    component: Cost
} as Meta<typeof Cost>

const Template: StoryFn<typeof Cost> = (args: any) => <Cost  {...args} />

export const Default = Template.bind({})

Default.args = {
    
}