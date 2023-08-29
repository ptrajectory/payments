import { type Meta, type StoryFn } from "@storybook/react" 
import DashboardTopBar from "."


export default {
    title: "Components/Organisms/DashboardTopBar",
    component: DashboardTopBar
} as Meta<typeof DashboardTopBar>


const Template: StoryFn<typeof DashboardTopBar> = (args: any) => <DashboardTopBar {...args} />


export const Default = Template.bind({})

Default.args = {
    
}