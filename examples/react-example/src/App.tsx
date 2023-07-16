import './App.css'
import "ptrajectory-mpesa-payments-ui/styles.css"
import { PaymentForm } from 'ptrajectory-mpesa-payments-ui'

function App() {

  return (
    <>
      <PaymentForm
        amount={1000}
        onFormSubmit={(data)=>{
          console.log(data)
        }}
        additional_fields={{
          first_name: {
            default_value: "Joe"
          },
          last_name: {
            default_value: "Doe"
          },
          email: {
            default_value: "cooljoe@email.com"
          }
        }}
      />
    </>
  )
}

export default App
