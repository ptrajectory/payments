import {Meta, StoryFn} from "@storybook/react"
import Header from ".";


export default {
    title: "Organisms/Header",
    component: Header
} as Meta<typeof Header>

const Template: StoryFn<typeof Header> = (args: any) => <Header  {...args} />

export const Default = Template.bind({})

Default.args = {
    
}