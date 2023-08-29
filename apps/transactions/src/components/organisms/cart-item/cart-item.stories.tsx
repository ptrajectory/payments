import {Meta, StoryFn} from "@storybook/react"
import CartItem from ".";


export default {
    title: "Organisms/CartItem",
    component: CartItem
} as Meta<typeof CartItem>

const Template: StoryFn<typeof CartItem> = (args: any) => <CartItem  {...args} />

export const Default = Template.bind({})

Default.args = {
    
}