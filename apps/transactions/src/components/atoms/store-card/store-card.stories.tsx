import { type Meta, type StoryFn } from "@storybook/react" 
import StoreCard from "."


export default {
    title: "Components/Organisms/StoreCard",
    component: StoreCard
} as Meta<typeof StoreCard>


const Template: StoryFn<typeof StoreCard> = (args: any) => <StoreCard {...args} />


export const Default = Template.bind({})

Default.args = {
    
}