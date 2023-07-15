import { PaymentForm } from '.'
import './App.css'

function App() {

  return (
    <>
    <PaymentForm
      amount={1000}
      additional_fields={{
        first_name: {
          default_value: "Joe"
        },
        last_name: {
          default_value: "Doe"
        },
        email: {
          default_value: "joedoe@email.com"
        }
      }}
    />
    </>
  )
}

export default App
