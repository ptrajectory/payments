import { StoryFn, Meta } from '@storybook/react'
import PhoneNumberInput, { PhoneNumberInputProps } from '.'


export default {
    title: 'Components/Atoms/PhoneNumberInput',
    component: PhoneNumberInput,
    argTypes: {

    }
} as Meta<typeof PhoneNumberInput>

const Template: StoryFn<typeof PhoneNumberInput> = (args: PhoneNumberInputProps) => <PhoneNumberInput {...args} />

export const Default = Template.bind({})

Default.args = {

}