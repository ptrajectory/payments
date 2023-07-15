import { type Meta, type StoryFn } from "@storybook/react"
import PaymentForm from "./payment-form"


export default {
    title: "Components/Organisms/PaymentForm",
    component: PaymentForm
} as Meta<typeof PaymentForm>


const Template: StoryFn<typeof PaymentForm> = (args) => <PaymentForm {...args} /> 

export const Default = Template.bind({})

Default.args = {
    amount: 1000,
}

export const WithEmailFields = Template.bind({})

WithEmailFields.args = {
    amount: 1000,
    additional_fields: {
        email: {
            default_value: "cooljoe@email.com"
        }
    }
}

export const WithFirstNameFields = Template.bind({})

WithFirstNameFields.args = {
    amount: 1000,
    additional_fields: {
        first_name: {
            default_value: "Joe"
        }
    }
}


export const WithLastNameFields = Template.bind({}) 

WithLastNameFields.args = {
    amount: 1000,
    additional_fields: {
        last_name: {
            default_value: "Doe"
        }
    }
}

export const WithAllFields = Template.bind({})

WithAllFields.args = {
    amount: 1000,
    additional_fields: {
        first_name: {
            default_value: "Joe"
        },
        last_name: {
            default_value: "Doe"
        },
        email: {
            default_value: "joedoe@email.com"
        }
    }
}