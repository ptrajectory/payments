import { Meta, StoryFn } from "@storybook/react";
import Checkout from "./checkout";



export default {
    title: "Components/Organisms/Checkout",
    component: Checkout
} as Meta<typeof Checkout>


const Template: StoryFn<typeof Checkout> = (args: any) => <Checkout {...args} />

export const Default = Template.bind({})

Default.args = {
    
}